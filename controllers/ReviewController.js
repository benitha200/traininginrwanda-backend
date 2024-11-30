const { Review } = require('../models/Review');

const ReviewController = {
  createReview: (req, res) => {
    const review = req.body;

    // Validate the review
    const validationResult = Review.validateReview(review);
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: 'Invalid review', 
        details: validationResult.errors 
      });
    }

    Review.create(review, (err, result) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error creating review', 
          details: err.message 
        });
      }
      res.status(201).json({ 
        message: 'Review created successfully',
        reviewId: result.lastID 
      });
    });
  },

  getTrainingReviews: (req, res) => {
    const { trainingId } = req.params;

    // Fetch reviews for a specific training
    Review.getByTraining(trainingId, (err, reviews) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error fetching reviews', 
          details: err.message 
        });
      }
      res.status(200).json(reviews);
    });
  },

  getTrainingRating: (req, res) => {
    const { trainingId } = req.params;

    // Fetch average rating and review count for a training
    Review.getAverageRating(trainingId, (err, ratingData) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error fetching rating', 
          details: err.message 
        });
      }
      res.status(200).json({
        averageRating: ratingData.average_rating || 0,
        reviewCount: ratingData.review_count || 0
      });
    });
  },

  updateReview: (req, res) => {
    const { id } = req.params;
    const updatedReview = req.body;

    // Validate the review update
    const validationResult = Review.validateReview({
      ...updatedReview,
      training_id: 1 // Dummy value to pass validation
    });

    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: 'Invalid review update', 
        details: validationResult.errors 
      });
    }

    Review.update(id, updatedReview, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error updating review', 
          details: err.message 
        });
      }
      res.status(200).json({ message: 'Review updated successfully' });
    });
  },

  deleteReview: (req, res) => {
    const { id } = req.params;

    Review.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error deleting review', 
          details: err.message 
        });
      }
      res.status(200).json({ message: 'Review deleted successfully' });
    });
  }
};

module.exports = ReviewController;