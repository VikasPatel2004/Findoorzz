import React, { useState } from 'react';

// Inline Star Icon
const StarIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-500' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 4,
      review: "Great place to stay! The landlord was very helpful.",
      date: "2023-05-15"
    },
    {
      id: 2,
      name: "Priya Patel",
      rating: 5,
      review: "Excellent facilities and maintenance. Highly recommended!",
      date: "2023-06-20"
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 0,
    review: '',
    name: ''
  });

  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.review) return;
    
    const reviewToAdd = {
      id: reviews.length + 1,
      name: newReview.name || "Anonymous",
      rating: newReview.rating,
      review: newReview.review,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([...reviews, reviewToAdd]);
    setNewReview({ rating: 0, review: '', name: '' });
    
    // Here you would typically send the review to your backend
    console.log("Review submitted:", reviewToAdd);
  };

  return (
    <div className="mt-12 border-t pt-8 flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-6 text-center">Reviews ({reviews.length})</h3>
      
      {/* Review Form */}
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
                >
                  <StarIcon filled={hoverRating >= star || newReview.rating >= star} />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name (optional)
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={newReview.name}
              onChange={(e) => setNewReview({...newReview, name: e.target.value})}
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              id="review"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={newReview.review}
              onChange={(e) => setNewReview({...newReview, review: e.target.value})}
              placeholder="Share your experience with this listing..."
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            disabled={newReview.rating === 0 || !newReview.review}
          >
            Submit Review
          </button>
        </form>
      </div>
      
      {/* Reviews List */}
      <div className="space-y-6 w-full max-w-md">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon 
                          key={star}
                          filled={review.rating >= star}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{review.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
