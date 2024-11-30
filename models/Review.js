const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../traininginrwanda1.db'));

const Review = {
  create: (review, callback) => {
    db.run(
      `INSERT INTO reviews (
        training_id, user_email, user_phone, stars, description
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        review.training_id,
        review.user_email,
        review.user_phone,
        review.stars,
        review.description || null
      ],
      function(err) {
        if (err) {
          return callback(err, null);
        }
        // Use `this.lastID` instead of `result.lastID`
        callback(null, { lastID: this.lastID });
      }
    );
  },

  getByTraining: (trainingId, callback) => {
    db.all('SELECT * FROM reviews WHERE training_id = ? ORDER BY created_at DESC', [trainingId], callback);
  },

  getAverageRating: (trainingId, callback) => {
    db.get(
      'SELECT AVG(stars) as average_rating, COUNT(*) as review_count FROM reviews WHERE training_id = ?',
      [trainingId],
      callback
    );
  },

  update: (id, updatedReview, callback) => {
    db.run(
      `UPDATE reviews 
       SET stars = ?, description = ? 
       WHERE id = ?`,
      [
        updatedReview.stars,
        updatedReview.description || null,
        id
      ],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM reviews WHERE id = ?', [id], callback);
  },

  validateReview: (review) => {
    const errors = [];

    if (!review.training_id) {
      errors.push('Training ID is required');
    }

    if (!review.user_email) {
      errors.push('User email is required');
    }

    if (!review.user_phone) {
      errors.push('User phone is required');
    }

    if (!review.stars || review.stars < 1 || review.stars > 5) {
      errors.push('Stars must be between 1 and 5');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

module.exports = { Review };