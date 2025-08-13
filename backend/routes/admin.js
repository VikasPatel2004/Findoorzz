const express = require('express');
const requireAdmin = require('../middleware/adminMiddleware');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

const router = express.Router();

// Helper function to get client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// Helper function to log admin action
const logAction = async (req, action, targetType, targetId, targetName, description, before = null, after = null) => {
  try {
    await AuditLog.logAction({
      admin: req.user.userId,
      action,
      targetType,
      targetId,
      targetName,
      description,
      beforeSnapshot: before,
      afterSnapshot: after,
      ipAddress: getClientIP(req),
      userAgent: req.headers['user-agent']
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

// Dashboard Analytics
router.get('/dashboard/analytics', requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Get listing counts
    const [
      totalFlatListings,
      totalPGListings,
      activeFlatListings,
      activePGListings,
      flatListingsToday,
      pgListingsToday,
      flatListingsThisMonth,
      pgListingsThisMonth,
      totalUsers,
      usersThisMonth,
      pendingListings
    ] = await Promise.all([
      FlatListing.countDocuments(),
      PGListing.countDocuments(),
      FlatListing.countDocuments({ booked: false }),
      PGListing.countDocuments({ booked: false }),
      FlatListing.countDocuments({ createdAt: { $gte: today } }),
      PGListing.countDocuments({ createdAt: { $gte: today } }),
      FlatListing.countDocuments({ createdAt: { $gte: thisMonth } }),
      PGListing.countDocuments({ createdAt: { $gte: thisMonth } }),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thisMonth } }),
      // Assuming pending listings have a status field, otherwise use 0
      0 
    ]);

    // Get listings by city (top 10)
    const [flatByCity, pgByCity] = await Promise.all([
      FlatListing.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      PGListing.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    // Get daily listings for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [dailyFlats, dailyPGs] = await Promise.all([
      FlatListing.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { 
          $group: { 
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      PGListing.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const analytics = {
      totals: {
        flatListings: totalFlatListings,
        pgListings: totalPGListings,
        totalListings: totalFlatListings + totalPGListings,
        activeListings: activeFlatListings + activePGListings,
        users: totalUsers,
        pendingApproval: pendingListings
      },
      today: {
        flatListings: flatListingsToday,
        pgListings: pgListingsToday,
        totalListings: flatListingsToday + pgListingsToday
      },
      thisMonth: {
        flatListings: flatListingsThisMonth,
        pgListings: pgListingsThisMonth,
        totalListings: flatListingsThisMonth + pgListingsThisMonth,
        users: usersThisMonth
      },
      topCities: {
        flats: flatByCity,
        pgs: pgByCity
      },
      dailyTrends: {
        flats: dailyFlats,
        pgs: dailyPGs
      }
    };

    await logAction(req, 'VIEW_ADMIN_DASHBOARD', 'System', null, 'Dashboard Analytics', 'Viewed admin dashboard analytics');
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// Get all listings with filters and pagination
router.get('/listings', requireAdmin, async (req, res) => {
  try {
    const {
      type = 'all', // 'flat', 'pg', or 'all'
      status = 'all', // 'active', 'inactive', 'all'
      city,
      dateFrom,
      dateTo,
      ownerEmail,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    let listings = [];
    let totalCount = 0;

    // Build base filters
    const baseFilter = {};
    if (status === 'active') baseFilter.booked = false;
    if (status === 'inactive') baseFilter.booked = true;
    if (city) baseFilter.city = new RegExp(city, 'i');
    if (dateFrom || dateTo) {
      baseFilter.createdAt = {};
      if (dateFrom) baseFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) baseFilter.createdAt.$lte = new Date(dateTo);
    }

    if (type === 'flat' || type === 'all') {
      const flatFilter = { ...baseFilter };
      
      let flatQuery = FlatListing.find(flatFilter)
        .populate('owner', 'name email')
        .sort(sort);
      
      if (ownerEmail) {
        // Need to do a separate query for email filter
        const users = await User.find({ email: new RegExp(ownerEmail, 'i') });
        const userIds = users.map(u => u._id);
        flatFilter.owner = { $in: userIds };
      }
      
      const [flatListings, flatCount] = await Promise.all([
        type === 'flat' ? flatQuery.skip(skip).limit(parseInt(limit)) : flatQuery,
        FlatListing.countDocuments(flatFilter)
      ]);

      const flatListingsWithType = flatListings.map(listing => ({
        ...listing.toObject(),
        type: 'flat'
      }));

      if (type === 'flat') {
        listings = flatListingsWithType;
        totalCount = flatCount;
      } else {
        listings = listings.concat(flatListingsWithType);
        totalCount += flatCount;
      }
    }

    if (type === 'pg' || type === 'all') {
      const pgFilter = { ...baseFilter };
      
      let pgQuery = PGListing.find(pgFilter)
        .populate('owner', 'name email')
        .sort(sort);
      
      if (ownerEmail) {
        const users = await User.find({ email: new RegExp(ownerEmail, 'i') });
        const userIds = users.map(u => u._id);
        pgFilter.owner = { $in: userIds };
      }
      
      const [pgListings, pgCount] = await Promise.all([
        type === 'pg' ? pgQuery.skip(skip).limit(parseInt(limit)) : pgQuery,
        PGListing.countDocuments(pgFilter)
      ]);

      const pgListingsWithType = pgListings.map(listing => ({
        ...listing.toObject(),
        type: 'pg'
      }));

      if (type === 'pg') {
        listings = pgListingsWithType;
        totalCount = pgCount;
      } else {
        listings = listings.concat(pgListingsWithType);
        totalCount += pgCount;
      }
    }

    // If type is 'all', we need to sort and paginate the combined results
    if (type === 'all') {
      listings.sort((a, b) => {
        if (sortOrder === 'desc') {
          return new Date(b[sortBy]) - new Date(a[sortBy]);
        } else {
          return new Date(a[sortBy]) - new Date(b[sortBy]);
        }
      });
      
      const paginatedListings = listings.slice(skip, skip + parseInt(limit));
      listings = paginatedListings;
    }

    res.json({
      listings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching admin listings:', error);
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
});

// Update listing status (activate/deactivate)
router.patch('/listings/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'inactive'
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "active" or "inactive"' });
    }

    const booked = status === 'inactive';
    
    // Try to find in both collections
    let listing = await FlatListing.findById(id);
    let isFlat = true;
    
    if (!listing) {
      listing = await PGListing.findById(id);
      isFlat = false;
    }
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const beforeState = { booked: listing.booked };
    
    // Update the listing
    if (isFlat) {
      await FlatListing.findByIdAndUpdate(id, { booked });
    } else {
      await PGListing.findByIdAndUpdate(id, { booked });
    }

    const afterState = { booked };
    const action = status === 'active' ? 'ACTIVATE_LISTING' : 'DEACTIVATE_LISTING';
    const listingType = isFlat ? 'FlatListing' : 'PGListing';
    const description = `${status === 'active' ? 'Activated' : 'Deactivated'} ${isFlat ? 'flat' : 'PG'} listing: ${listing.houseNumber}, ${listing.colony}`;

    await logAction(req, action, listingType, id, `${listing.houseNumber}, ${listing.colony}`, description, beforeState, afterState);

    res.json({ 
      message: `Listing ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      listing: { ...listing.toObject(), booked }
    });

  } catch (error) {
    console.error('Error updating listing status:', error);
    res.status(500).json({ message: 'Error updating listing status', error: error.message });
  }
});

// Delete listing
router.delete('/listings/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find in both collections
    let listing = await FlatListing.findById(id);
    let isFlat = true;
    
    if (!listing) {
      listing = await PGListing.findById(id);
      isFlat = false;
    }
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const beforeState = listing.toObject();
    
    // Delete the listing
    if (isFlat) {
      await FlatListing.findByIdAndDelete(id);
    } else {
      await PGListing.findByIdAndDelete(id);
    }

    const listingType = isFlat ? 'FlatListing' : 'PGListing';
    const description = `Deleted ${isFlat ? 'flat' : 'PG'} listing: ${listing.houseNumber}, ${listing.colony}`;

    await logAction(req, 'DELETE_LISTING', listingType, id, `${listing.houseNumber}, ${listing.colony}`, description, beforeState, null);

    res.json({ message: 'Listing deleted successfully' });

  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
});

// Update listing details
router.put('/listings/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Try to find in both collections
    let listing = await FlatListing.findById(id);
    let isFlat = true;
    
    if (!listing) {
      listing = await PGListing.findById(id);
      isFlat = false;
    }
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const beforeState = listing.toObject();
    
    // Update the listing
    let updatedListing;
    if (isFlat) {
      updatedListing = await FlatListing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } else {
      updatedListing = await PGListing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    const afterState = updatedListing.toObject();
    const listingType = isFlat ? 'FlatListing' : 'PGListing';
    const description = `Updated ${isFlat ? 'flat' : 'PG'} listing: ${listing.houseNumber}, ${listing.colony}`;

    await logAction(req, 'UPDATE_LISTING', listingType, id, `${listing.houseNumber}, ${listing.colony}`, description, beforeState, afterState);

    res.json({ 
      message: 'Listing updated successfully',
      listing: updatedListing 
    });

  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
});

// Get all users with filters and pagination
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const {
      role = 'all',
      verificationStatus = 'all',
      email,
      name,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Build filters
    const filters = {};
    if (role !== 'all') filters.role = role;
    if (verificationStatus !== 'all') filters.verificationStatus = verificationStatus;
    if (email) filters.email = new RegExp(email, 'i');
    if (name) filters.name = new RegExp(name, 'i');

    const [users, totalCount] = await Promise.all([
      User.find(filters)
        .select('-passwordHash') // Don't send password hash
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filters)
    ]);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Update user role or status
router.patch('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, verificationStatus, isAdmin } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const beforeState = { role: user.role, verificationStatus: user.verificationStatus, isAdmin: user.isAdmin };
    
    const updateData = {};
    if (role) updateData.role = role;
    if (verificationStatus) updateData.verificationStatus = verificationStatus;
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');
    
    const afterState = { role: updatedUser.role, verificationStatus: updatedUser.verificationStatus, isAdmin: updatedUser.isAdmin };
    const description = `Updated user: ${user.name} (${user.email})`;

    await logAction(req, 'UPDATE_USER', 'User', id, `${user.name} (${user.email})`, description, beforeState, afterState);

    res.json({ 
      message: 'User updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Get audit logs
router.get('/audit-logs', requireAdmin, async (req, res) => {
  try {
    const {
      action,
      targetType,
      adminId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filters
    const filters = {};
    if (action) filters.action = action;
    if (targetType) filters.targetType = targetType;
    if (adminId) filters.admin = adminId;
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filters.createdAt.$lte = new Date(dateTo);
    }

    const [logs, totalCount] = await Promise.all([
      AuditLog.find(filters)
        .populate('admin', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(filters)
    ]);

    res.json({
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
});

// Bulk operations
router.post('/listings/bulk-action', requireAdmin, async (req, res) => {
  try {
    const { listingIds, action } = req.body; // action: 'activate', 'deactivate', 'delete'
    
    if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return res.status(400).json({ message: 'listingIds must be a non-empty array' });
    }

    if (!['activate', 'deactivate', 'delete'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be "activate", "deactivate", or "delete"' });
    }

    const results = { success: [], failed: [] };

    for (const id of listingIds) {
      try {
        // Try to find in both collections
        let listing = await FlatListing.findById(id);
        let isFlat = true;
        
        if (!listing) {
          listing = await PGListing.findById(id);
          isFlat = false;
        }
        
        if (!listing) {
          results.failed.push({ id, error: 'Listing not found' });
          continue;
        }

        if (action === 'delete') {
          if (isFlat) {
            await FlatListing.findByIdAndDelete(id);
          } else {
            await PGListing.findByIdAndDelete(id);
          }
          
          await logAction(req, 'DELETE_LISTING', isFlat ? 'FlatListing' : 'PGListing', id, 
                         `${listing.houseNumber}, ${listing.colony}`, 
                         `Bulk deleted ${isFlat ? 'flat' : 'PG'} listing`);
        } else {
          const booked = action === 'deactivate';
          
          if (isFlat) {
            await FlatListing.findByIdAndUpdate(id, { booked });
          } else {
            await PGListing.findByIdAndUpdate(id, { booked });
          }
          
          const logAction_ = action === 'activate' ? 'ACTIVATE_LISTING' : 'DEACTIVATE_LISTING';
          await logAction(req, logAction_, isFlat ? 'FlatListing' : 'PGListing', id, 
                         `${listing.houseNumber}, ${listing.colony}`, 
                         `Bulk ${action}d ${isFlat ? 'flat' : 'PG'} listing`);
        }

        results.success.push(id);
      } catch (error) {
        results.failed.push({ id, error: error.message });
      }
    }

    await logAction(req, 'BULK_UPDATE', 'System', null, 'Bulk Action', 
                   `Bulk ${action} on ${listingIds.length} listings. Success: ${results.success.length}, Failed: ${results.failed.length}`);

    res.json({ 
      message: `Bulk ${action} completed`,
      results 
    });

  } catch (error) {
    console.error('Error in bulk action:', error);
    res.status(500).json({ message: 'Error performing bulk action', error: error.message });
  }
});

module.exports = router;
