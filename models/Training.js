// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

// const db = new sqlite3.Database(path.resolve(__dirname, '../traininginrwanda1.db'));

// const Training = {
//   create: (training, callback) => {
//     db.run(
//       `INSERT INTO trainings (
//         title, description, duration, instructor, start_date, end_date, 
//         fee, level, is_certified, what_you_will_learn, address, category_id
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         training.title, 
//         training.description,
//         training.duration,
//         training.instructor,
//         training.start_date,
//         training.end_date,
//         training.fee,
//         training.level,
//         training.is_certified,
//         JSON.stringify(training.what_you_will_learn),
//         training.address,
//         training.category_id // Add category_id
//       ],
//       callback
//     );
//   },


//   // For getAll and getById methods, modify to parse category_id
//   getAll: (callback) => {
//     db.all('SELECT * FROM trainings', (err, rows) => {
//       if (err) return callback(err);

//       const parsedRows = rows.map(row => {
//         const parsedRow = {...row};

//         try {
//           if (parsedRow.what_you_will_learn && typeof parsedRow.what_you_will_learn === 'string') {
//             parsedRow.what_you_will_learn = JSON.parse(parsedRow.what_you_will_learn);
//           } else {
//             parsedRow.what_you_will_learn = [];
//           }
//         } catch (parseError) {
//           console.error('Error parsing what_you_will_learn:', parseError);
//           parsedRow.what_you_will_learn = [];
//         }

//         return parsedRow;
//       });

//       callback(null, parsedRows);
//     });
//   },

//   getById: (id, callback) => {
//     db.get('SELECT * FROM trainings WHERE id = ?', [id], (err, row) => {
//       if (err) return callback(err);

//       if (row) {
//         try {
//           // Only parse what_you_will_learn if it's a string
//           row.what_you_will_learn = row.what_you_will_learn 
//             ? (typeof row.what_you_will_learn === 'string' 
//                 ? JSON.parse(row.what_you_will_learn) 
//                 : row.what_you_will_learn)
//             : [];
//         } catch (parseError) {
//           // If parsing fails, default to an empty array
//           console.error('Error parsing what_you_will_learn:', parseError);
//           row.what_you_will_learn = [];
//         }
//       }

//       callback(null, row);
//     });
//   },

//   update: (id, updatedTraining, callback) => {
//     db.run(
//       `UPDATE trainings
//        SET title = ?, description = ?, duration = ?, instructor = ?, 
//            start_date = ?, end_date = ?, fee = ?, level = ?, 
//            is_certified = ?, what_you_will_learn = ?, address = ?, category_id = ?
//        WHERE id = ?`,
//       [
//         updatedTraining.title,
//         updatedTraining.description,
//         updatedTraining.duration,
//         updatedTraining.instructor,
//         updatedTraining.start_date,
//         updatedTraining.end_date,
//         updatedTraining.fee,
//         updatedTraining.level,
//         updatedTraining.is_certified,
//         JSON.stringify(updatedTraining.what_you_will_learn),
//         updatedTraining.address,
//         updatedTraining.category_id, // Add category_id
//         id
//       ],
//       function (err) {
//         if (err) {
//           console.error("Database error:", err.message);
//           return callback(err);
//         }
//         callback(null);
//       }
//     );
//   },

//   // Add a method to get trainings by category
//   getByCategory: (categoryId, callback) => {
//     db.all('SELECT * FROM trainings WHERE category_id = ?', [categoryId], (err, rows) => {
//       if (err) return callback(err);

//       const parsedRows = rows.map(row => {
//         try {
//           row.what_you_will_learn = row.what_you_will_learn 
//             ? (typeof row.what_you_will_learn === 'string' 
//                 ? JSON.parse(row.what_you_will_learn) 
//                 : row.what_you_will_learn)
//             : [];
//         } catch (parseError) {
//           console.error('Error parsing what_you_will_learn:', parseError);
//           row.what_you_will_learn = [];
//         }
//         return row;
//       });

//       callback(null, parsedRows);
//     });
//   },


//   delete: (id, callback) => {
//     db.run('DELETE FROM trainings WHERE id = ?', [id], callback);
//   }
// };
// // Categories
// const Category = {
//   create: (category, callback) => {
//     db.run(
//       `INSERT INTO categories (name, description) VALUES (?, ?)`,
//       [category.name, category.description],
//       callback
//     );
//   },

//   getAll: (callback) => {
//     db.all('SELECT * FROM categories', callback);
//   },

//   getById: (id, callback) => {
//     db.get('SELECT * FROM categories WHERE id = ?', [id], callback);
//   },

//   update: (id, updatedCategory, callback) => {
//     db.run(
//       `UPDATE categories
//        SET name = ?, description = ?
//        WHERE id = ?`,
//       [updatedCategory.name, updatedCategory.description, id],
//       callback
//     );
//   },

//   delete: (id, callback) => {
//     db.run('DELETE FROM categories WHERE id = ?', [id], callback);
//   }
// };

// // Training Schedules
// const TrainingSchedule = {
//   create: (schedule, callback) => {
//     db.run(
//       `INSERT INTO training_schedules (
//         training_id, start_date, end_date, capacity
//       ) VALUES (?, ?, ?, ?)`,
//       [schedule.training_id, schedule.start_date, schedule.end_date, schedule.capacity],
//       callback
//     );
//   },

//   getAll: (callback) => {
//     db.all('SELECT * FROM training_schedules', callback);
//   },

//   getById: (id, callback) => {
//     db.get('SELECT * FROM training_schedules WHERE id = ?', [id], callback);
//   },

//   update: (id, updatedSchedule, callback) => {
//     db.run(
//       `UPDATE training_schedules
//        SET training_id = ?, start_date = ?, end_date = ?, capacity = ?
//        WHERE id = ?`,
//       [updatedSchedule.training_id, updatedSchedule.start_date, updatedSchedule.end_date, updatedSchedule.capacity, id],
//       callback
//     );
//   },

//   delete: (id, callback) => {
//     db.run('DELETE FROM training_schedules WHERE id = ?', [id], callback);
//   },
//   getByTraining: (trainingId, callback) => {
//     db.all('SELECT * FROM training_schedules WHERE training_id = ?', [trainingId], (err, schedules) => {
//       if (err) {
//         return callback(err);
//       }
//       callback(null, schedules);
//     });
//   }
// };

// module.exports.Training = Training;
// module.exports.Category = Category;
// module.exports.TrainingSchedule = TrainingSchedule;


// const prisma = require('./../prisma/prismaClient');

// const Training = {
//   create: async (training) => {
//     try {
//       return await prisma.training.create({
//         data: {
//           ...training,
//           what_you_will_learn: training.what_you_will_learn
//             ? JSON.stringify(training.what_you_will_learn)
//             : undefined,
//         }
//       });
//     } catch (error) {
//       console.error('Error creating training:', error);
//       throw error;
//     }
//   },

//   getAll: async () => {
//     try {
//       const trainings = await prisma.training.findMany({
//         include: { category: true }
//       });

//       return trainings.map(training => ({
//         ...training,
//         what_you_will_learn: training.what_you_will_learn
//           ? JSON.parse(training.what_you_will_learn)
//           : []
//       }));
//     } catch (error) {
//       console.error('Error fetching trainings:', error);
//       throw error;
//     }
//   },

//   getById: async (id) => {
//     try {
//       const training = await prisma.training.findUnique({
//         where: { id: parseInt(id) },
//         include: { category: true }
//       });

//       if (training) {
//         return {
//           ...training,
//           what_you_will_learn: training.what_you_will_learn
//             ? JSON.parse(training.what_you_will_learn)
//             : []
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error('Error fetching training:', error);
//       throw error;
//     }
//   },

//   update: async (id, updatedTraining) => {
//     try {
//       const { id: _, ...updateData } = updatedTraining;
//       return await prisma.training.update({
//         where: {
//           id: 1, // Replace with the actual training ID you want to update
//         },
//         data: {
//           title: "Data Science",
//           description: "Data Science",
//           duration: 10,
//           instructor: "Training In Rwanda",
//           start_date: null,
//           end_date: null,
//           fee: "300000",
//           level: "Advanced",
//           is_certified: true,
//           what_you_will_learn: JSON.stringify(["Data Science", "Advanced Techniques"]),
//           address: "Kigali, Rwanda",
//           category: {
//             connect: { id: 1 }, // Link the training to a category with ID 1
//           },
//         },
//       });

//     } catch (error) {
//       console.error('Error updating training:', error);
//       throw error;
//     }
//   },

//   getByCategory: async (categoryId) => {
//     try {
//       const trainings = await prisma.training.findMany({
//         where: { category_id: parseInt(categoryId) },
//         include: { category: true }
//       });

//       return trainings.map(training => ({
//         ...training,
//         what_you_will_learn: training.what_you_will_learn
//           ? JSON.parse(training.what_you_will_learn)
//           : []
//       }));
//     } catch (error) {
//       console.error('Error fetching trainings by category:', error);
//       throw error;
//     }
//   },

//   delete: async (id) => {
//     try {
//       return await prisma.training.delete({
//         where: { id: parseInt(id) }
//       });
//     } catch (error) {
//       console.error('Error deleting training:', error);
//       throw error;
//     }
//   }
// };

// module.exports = { Training };

const prisma = require('./../prisma/prismaClient');
const Decimal = require('decimal.js');

const Training = {
  create: async (training) => {
    try {
      return await prisma.training.create({
        data: {
          title: training.title,
          description: training.description,
          duration: training.duration ? Number(training.duration) : null,
          instructor: training.instructor,
          fee: training.fee ? new Decimal(training.fee).toDecimalPlaces(2).toString() : null,
          level: training.level,
          is_certified: training.is_certified,
          what_you_will_learn: JSON.stringify(training.what_you_will_learn),
          address: training.address,
          category: training.category_id ? {
            connect: { id: training.category_id }
          } : undefined,
          start_date: training.start_date ? new Date(training.start_date) : null,
          end_date: training.end_date ? new Date(training.end_date) : null,
        },
      });
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      const trainings = await prisma.training.findMany({
        include: { category: true },
      });
  
      return trainings.map((training) => {
        let parsedWhatYouWillLearn = [];
        if (training.what_you_will_learn) {
          try {
            // Attempt to parse `what_you_will_learn`
            parsedWhatYouWillLearn = JSON.parse(training.what_you_will_learn);
          } catch (parseError) {
            console.error(
              `Failed to parse 'what_you_will_learn' for training ID ${training.id}:`,
              parseError
            );
            // Keep the raw string if parsing fails
            parsedWhatYouWillLearn = training.what_you_will_learn;
          }
        }
  
        return {
          ...training,
          what_you_will_learn: parsedWhatYouWillLearn,
        };
      });
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  },  

  getById: async (id) => {
    try {
      const training = await prisma.training.findUnique({
        where: { id: parseInt(id) },
        include: { category: true },
      });

      if (training) {
        return {
          ...training,
          what_you_will_learn: training.what_you_will_learn
            ? JSON.parse(training.what_you_will_learn)
            : [],
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching training:', error);
      throw error;
    }
  },

  // update: async (id, updatedTraining) => {
  //   try {
  //     return await prisma.training.update({
  //       where: { id: parseInt(id) }, // Use the dynamic ID
  //       data: {
  //         ...updatedTraining,
  //         what_you_will_learn: updatedTraining.what_you_will_learn
  //           ? JSON.stringify(updatedTraining.what_you_will_learn)
  //           : undefined,
  //         category: updatedTraining.category_id
  //           ? {
  //               connect: { id: updatedTraining.category_id },
  //             }
  //           : undefined, // Connect category if provided
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error updating training:', error);
  //     throw error;
  //   }
  // },

  update: async (id, updatedTraining) => {
    try {
      // Exclude the `id` field from `updatedTraining`
      const { id: _, category_id, ...dataToUpdate } = updatedTraining;

      return await prisma.training.update({
        where: {
          id: parseInt(id), // Ensure `id` is an integer
        },
        data: {
          ...dataToUpdate, // Spread valid fields to update
          category: category_id
            ? {
                connect: { id: category_id }, // Use `connect` for the relational field
              }
            : undefined, // Skip `category` if `category_id` is not provided
        },
      });
    } catch (error) {
      console.error('Error updating training:', error);
      throw error;
    }
  },

  getByCategory: async (categoryId) => {
    try {
      const trainings = await prisma.training.findMany({
        where: { category_id: parseInt(categoryId) },
        include: { category: true },
      });

      return trainings.map((training) => ({
        ...training,
        what_you_will_learn: training.what_you_will_learn
          ? JSON.parse(training.what_you_will_learn)
          : [],
      }));
    } catch (error) {
      console.error('Error fetching trainings by category:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      // Delete related training schedules
      await prisma.trainingSchedule.deleteMany({
        where: { training_id: parseInt(id) },
      });

      // Delete related reviews
      await prisma.review.deleteMany({
        where: { training_id: parseInt(id) },
      });

      // Delete the training itself
      return await prisma.training.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      console.error('Error deleting training:', error);
      throw error;
    }
  }
};

module.exports = { Training };
