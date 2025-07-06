import { apiService } from './apiService';

const reviewService = {
  // Get reviews for a listing
  getReviews: (listingId) => 
    apiService.get(`/reviews/${listingId}`, {}, false),
  
  // Create a new review
  createReview: (reviewData) => 
    apiService.post('/reviews', reviewData),
  
  // Update an existing review
  updateReview: (reviewId, reviewData) => 
    apiService.put(`/reviews/${reviewId}`, reviewData),
  
  // Delete a review
  deleteReview: (reviewId) => 
    apiService.delete(`/reviews/${reviewId}`),
  
  // Get user's reviews
  getUserReviews: () => 
    apiService.get('/reviews/user', {}, false),
  
  // Get average rating for a listing
  getAverageRating: (listingId) => 
    apiService.get(`/reviews/${listingId}/average`, {}, false),
};

export default reviewService;