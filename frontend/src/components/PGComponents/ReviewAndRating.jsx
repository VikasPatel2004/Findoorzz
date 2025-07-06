import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import reviewService from '../../services/reviewService';

// Inline Star Icon
const StarIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const ReviewsSection = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });

  const [hoverRating, setHoverRating] = useState(0);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviews('pg', id);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      alert('Please login to submit a review');
      return;
    }

    if (newReview.rating === 0 || !newReview.comment.trim()) {
      alert('Please provide both rating and comment');
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        listingType: 'pg',
        listingId: id,
        rating: newReview.rating,
        comment: newReview.comment.trim()
      };

      await reviewService.createReview(reviewData, token);
      
      // Reset form and refresh reviews
      setNewReview({ rating: 0, comment: '' });
      await fetchReviews();
      
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user || !token) {
      alert('Please login to delete reviews');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId, token);
      await fetchReviews();
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="mt-12 border-t pt-8 flex flex-col items-center">
        <div className="text-center py-10">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t pt-8 flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Reviews ({reviews.length})
        {reviews.length > 0 && (
          <span className="ml-2 text-lg font-normal text-gray-600">
            • Average: {calculateAverageRating()} ⭐
          </span>
        )}
      </h3>
      
      {/* Review Form - Only show if user is logged in */}
      {user && token && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 w-full max-w-4xl">
          <h4 className="text-lg font-semibold mb-4 text-center">Write a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <StarIcon filled={hoverRating >= star || newReview.rating >= star} />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Share your experience with this listing..."
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={newReview.rating === 0 || !newReview.comment.trim() || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Login prompt for non-authenticated users */}
      {!user && (
        <div className="bg-blue-50 p-4 rounded-lg mb-8 w-full max-w-4xl text-center">
          <p className="text-blue-800">
            Please <a href="/LoginPage" className="underline font-semibold">login</a> to write a review.
          </p>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="space-y-6 w-full max-w-4xl">
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{review.user?.name || 'Anonymous'}</h4>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon 
                          key={star}
                          filled={review.rating >= star}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                
                {/* Delete button for review author */}
                {user && review.user?._id === user._id && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Delete review"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
