import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../LoadingSpinner';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    action: '',
    targetType: '',
    adminId: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 25
  });
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAuditLogs(filters);
      setLogs(response.logs);
      setTotalPages(response.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Failed to fetch audit logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'CREATE_LISTING':
      case 'APPROVE_LISTING':
      case 'UNBAN_USER':
        return 'bg-green-100 text-green-800';
      case 'UPDATE_LISTING':
      case 'UPDATE_USER':
      case 'CHANGE_USER_ROLE':
      case 'BULK_UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE_LISTING':
      case 'BAN_USER':
      case 'BULK_DELETE':
        return 'bg-red-100 text-red-800';
      case 'VIEW_ADMIN_DASHBOARD':
        return 'bg-purple-100 text-purple-800';
      case 'ACTIVATE_LISTING':
      case 'DEACTIVATE_LISTING':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTargetTypeBadgeColor = (targetType) => {
    switch (targetType) {
      case 'User': return 'bg-blue-100 text-blue-800';
      case 'PGListing': return 'bg-indigo-100 text-indigo-800';
      case 'FlatListing': return 'bg-teal-100 text-teal-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderLogDetails = (log) => {
    if (!log) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900">Action</h4>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeColor(log.action)}`}>
              {log.action}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Target Type</h4>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTargetTypeBadgeColor(log.targetType)}`}>
              {log.targetType}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">User</h4>
            <p className="text-sm text-gray-600">{log.admin?.name || log.admin?.email || 'System'}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">IP Address</h4>
            <p className="text-sm text-gray-600">{log.ipAddress || 'N/A'}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">User Agent</h4>
            <p className="text-sm text-gray-600 truncate" title={log.userAgent}>
              {log.userAgent || 'N/A'}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Timestamp</h4>
            <p className="text-sm text-gray-600">{formatDate(log.createdAt)}</p>
          </div>
        </div>

        {log.targetId && (
          <div>
            <h4 className="font-medium text-gray-900">Target ID</h4>
            <p className="text-sm text-gray-600 font-mono">{String(log.targetId)}</p>
          </div>
        )}

        {log.description && (
          <div>
            <h4 className="font-medium text-gray-900">Description</h4>
            <p className="text-sm text-gray-600">{log.description}</p>
          </div>
        )}

        {log.beforeSnapshot && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Before Data</h4>
            <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-40">
              {JSON.stringify(log.beforeSnapshot, null, 2)}
            </pre>
          </div>
        )}

        {log.afterSnapshot && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">After Data</h4>
            <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-40">
              {JSON.stringify(log.afterSnapshot, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
        <div className="text-sm text-gray-600">
          Total Logs: {logs.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              <option value="CREATE_LISTING">Create Listing</option>
              <option value="UPDATE_LISTING">Update Listing</option>
              <option value="DELETE_LISTING">Delete Listing</option>
              <option value="APPROVE_LISTING">Approve Listing</option>
              <option value="REJECT_LISTING">Reject Listing</option>
              <option value="ACTIVATE_LISTING">Activate Listing</option>
              <option value="DEACTIVATE_LISTING">Deactivate Listing</option>
              <option value="UPDATE_USER">Update User</option>
              <option value="BAN_USER">Ban User</option>
              <option value="UNBAN_USER">Unban User</option>
              <option value="CHANGE_USER_ROLE">Change User Role</option>
              <option value="VIEW_ADMIN_DASHBOARD">View Admin Dashboard</option>
              <option value="BULK_DELETE">Bulk Delete</option>
              <option value="BULK_UPDATE">Bulk Update</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Type
            </label>
            <select
              value={filters.targetType}
              onChange={(e) => handleFilterChange('targetType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="User">User</option>
              <option value="PGListing">PG Listing</option>
              <option value="FlatListing">Flat Listing</option>
              <option value="System">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Per Page
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  action: '',
                  targetType: '',
                  adminId: '',
                  dateFrom: '',
                  dateTo: '',
                  page: 1,
                  limit: 25
                });
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.admin?.name || 'System'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.admin?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTargetTypeBadgeColor(log.targetType)}`}>
                        {log.targetType}
                      </span>
                    </div>
                    {log.targetId && (
                      <div className="text-xs text-gray-500 font-mono mt-1">
                        {String(log.targetId).substring(0, 8)}...
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-gray-900 truncate" title={log.description}>
                      {log.description || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.ipAddress || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedLog(log);
                        setShowLogModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No audit logs found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-2 border rounded-md ${
                filters.page === i + 1
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Log Details Modal */}
      {showLogModal && selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-8 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Audit Log Details
                </h3>
                <button
                  onClick={() => {
                    setShowLogModal(false);
                    setSelectedLog(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {renderLogDetails(selectedLog)}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowLogModal(false);
                    setSelectedLog(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
