const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../traininginrwanda.db'));

const Training = {
  create: (training, callback) => {
    db.run(
      `INSERT INTO trainings (
        title, description, duration, instructor, start_date, end_date, 
        fee, level, is_certified, what_you_will_learn, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        training.title, 
        training.description,
        training.duration,
        training.instructor,
        training.start_date,
        training.end_date,
        training.fee,
        training.level,
        training.is_certified,
        JSON.stringify(training.what_you_will_learn),
        training.address
      ],
      callback
    );
  },

  getAll: (callback) => {
    db.all('SELECT * FROM trainings', (err, rows) => {
      if (err) return callback(err);

      const parsedRows = rows.map(row => ({
        ...row,
        what_you_will_learn: row.what_you_will_learn
          ? JSON.parse(row.what_you_will_learn) // Parse if not null/undefined
          : [] // Default to an empty array
      }));
      callback(null, parsedRows);
    });
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM trainings WHERE id = ?', [id], (err, row) => {
      if (err) return callback(err);

      if (row) {
        row.what_you_will_learn = row.what_you_will_learn
          ? JSON.parse(row.what_you_will_learn) // Parse if not null/undefined
          : []; // Default to an empty array
      }
      callback(null, row);
    });
  },

  update: (id, updatedTraining, callback) => {
    db.run(
      `UPDATE trainings
       SET title = ?, description = ?, duration = ?, instructor = ?, 
           start_date = ?, end_date = ?, fee = ?, level = ?, 
           is_certified = ?, what_you_will_learn = ?, address = ?
       WHERE id = ?`,
      [
        updatedTraining.title,
        updatedTraining.description,
        updatedTraining.duration,
        updatedTraining.instructor,
        updatedTraining.start_date,
        updatedTraining.end_date,
        updatedTraining.fee,
        updatedTraining.level,
        updatedTraining.is_certified,
        updatedTraining.what_you_will_learn,
        updatedTraining.address,
        id
      ],
      function (err) {
        if (err) {
          console.error("Database error:", err.message);
          return callback(err);
        }
        callback(null);
      }
    );
  },
  
  

  delete: (id, callback) => {
    db.run('DELETE FROM trainings WHERE id = ?', [id], callback);
  }
};
// Categories
const Category = {
  create: (category, callback) => {
    db.run(
      `INSERT INTO categories (name, description) VALUES (?, ?)`,
      [category.name, category.description],
      callback
    );
  },

  getAll: (callback) => {
    db.all('SELECT * FROM categories', callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM categories WHERE id = ?', [id], callback);
  },

  update: (id, updatedCategory, callback) => {
    db.run(
      `UPDATE categories
       SET name = ?, description = ?
       WHERE id = ?`,
      [updatedCategory.name, updatedCategory.description, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM categories WHERE id = ?', [id], callback);
  }
};

// Training Schedules
const TrainingSchedule = {
  create: (schedule, callback) => {
    db.run(
      `INSERT INTO training_schedules (
        training_id, start_date, end_date, capacity
      ) VALUES (?, ?, ?, ?)`,
      [schedule.training_id, schedule.start_date, schedule.end_date, schedule.capacity],
      callback
    );
  },

  getAll: (callback) => {
    db.all('SELECT * FROM training_schedules', callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM training_schedules WHERE id = ?', [id], callback);
  },

  update: (id, updatedSchedule, callback) => {
    db.run(
      `UPDATE training_schedules
       SET training_id = ?, start_date = ?, end_date = ?, capacity = ?
       WHERE id = ?`,
      [updatedSchedule.training_id, updatedSchedule.start_date, updatedSchedule.end_date, updatedSchedule.capacity, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM training_schedules WHERE id = ?', [id], callback);
  }
};

module.exports.Training = Training;
module.exports.Category = Category;
module.exports.TrainingSchedule = TrainingSchedule;
