const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../traininginrwanda1.db'));

const Training = {
  create: (training, callback) => {
    db.run(
      `INSERT INTO trainings (
        title, description, duration, instructor, start_date, end_date, 
        fee, level, is_certified, what_you_will_learn, address, category_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        training.address,
        training.category_id // Add category_id
      ],
      callback
    );
  },

  // getAll: (callback) => {
  //   db.all('SELECT * FROM trainings', (err, rows) => {
  //     if (err) return callback(err);
  
  //     const parsedRows = rows.map(row => {
  //       // Create a copy of the row to avoid modifying the original
  //       const parsedRow = {...row};
  
  //       try {
  //         // Only attempt to parse if what_you_will_learn is a string and not empty
  //         if (parsedRow.what_you_will_learn && typeof parsedRow.what_you_will_learn === 'string') {
  //           parsedRow.what_you_will_learn = JSON.parse(parsedRow.what_you_will_learn);
  //         } else {
  //           parsedRow.what_you_will_learn = [];
  //         }
  //       } catch (parseError) {
  //         console.error('Error parsing what_you_will_learn:', parseError);
  //         parsedRow.what_you_will_learn = [];
  //       }
  
  //       return parsedRow;
  //     });
  
  //     callback(null, parsedRows);
  //   });
  // },


  // For getAll and getById methods, modify to parse category_id
  getAll: (callback) => {
    db.all('SELECT * FROM trainings', (err, rows) => {
      if (err) return callback(err);
  
      const parsedRows = rows.map(row => {
        const parsedRow = {...row};
  
        try {
          if (parsedRow.what_you_will_learn && typeof parsedRow.what_you_will_learn === 'string') {
            parsedRow.what_you_will_learn = JSON.parse(parsedRow.what_you_will_learn);
          } else {
            parsedRow.what_you_will_learn = [];
          }
        } catch (parseError) {
          console.error('Error parsing what_you_will_learn:', parseError);
          parsedRow.what_you_will_learn = [];
        }
  
        return parsedRow;
      });
  
      callback(null, parsedRows);
    });
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM trainings WHERE id = ?', [id], (err, row) => {
      if (err) return callback(err);
      
      if (row) {
        try {
          // Only parse what_you_will_learn if it's a string
          row.what_you_will_learn = row.what_you_will_learn 
            ? (typeof row.what_you_will_learn === 'string' 
                ? JSON.parse(row.what_you_will_learn) 
                : row.what_you_will_learn)
            : [];
        } catch (parseError) {
          // If parsing fails, default to an empty array
          console.error('Error parsing what_you_will_learn:', parseError);
          row.what_you_will_learn = [];
        }
      }
      
      callback(null, row);
    });
  },

  update: (id, updatedTraining, callback) => {
    db.run(
      `UPDATE trainings
       SET title = ?, description = ?, duration = ?, instructor = ?, 
           start_date = ?, end_date = ?, fee = ?, level = ?, 
           is_certified = ?, what_you_will_learn = ?, address = ?, category_id = ?
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
        JSON.stringify(updatedTraining.what_you_will_learn),
        updatedTraining.address,
        updatedTraining.category_id, // Add category_id
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
  
  // Add a method to get trainings by category
  getByCategory: (categoryId, callback) => {
    db.all('SELECT * FROM trainings WHERE category_id = ?', [categoryId], (err, rows) => {
      if (err) return callback(err);
  
      const parsedRows = rows.map(row => {
        try {
          row.what_you_will_learn = row.what_you_will_learn 
            ? (typeof row.what_you_will_learn === 'string' 
                ? JSON.parse(row.what_you_will_learn) 
                : row.what_you_will_learn)
            : [];
        } catch (parseError) {
          console.error('Error parsing what_you_will_learn:', parseError);
          row.what_you_will_learn = [];
        }
        return row;
      });
  
      callback(null, parsedRows);
    });
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
  },
  getByTraining: (trainingId, callback) => {
    db.all('SELECT * FROM training_schedules WHERE training_id = ?', [trainingId], (err, schedules) => {
      if (err) {
        return callback(err);
      }
      callback(null, schedules);
    });
  }
};

module.exports.Training = Training;
module.exports.Category = Category;
module.exports.TrainingSchedule = TrainingSchedule;
