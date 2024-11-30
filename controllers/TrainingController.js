// // controllers/TrainingController.js
// const { Training } = require('../models/Training');

// const TrainingController = {
//     createTraining: (req, res) => {
//         const training = req.body;
        
//         // Validate category_id if needed
//         if (!training.category_id) {
//           return res.status(400).json({ error: 'Category ID is required' });
//         }
    
//         Training.create(training, (err) => {
//           if (err) {
//             return res.status(500).json({ error: 'Error creating training', details: err.message });
//           }
//           res.status(201).json({ message: 'Training created successfully' });
//         });
//       },

//       getTrainingsByCategory: (req, res) => {
//         const { categoryId } = req.params;
        
//         Training.getByCategory(categoryId, (err, trainings) => {
//           if (err) {
//             return res.status(500).json({ error: 'Error fetching trainings', details: err.message });
//           }
//           res.status(200).json(trainings);
//         });
//       },

//     getAllTrainings: (req, res) => {
//         Training.getAll((err, trainings) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Error fetching trainings' });
//             }
//             res.status(200).json(trainings);
//         });
//     },

//     getTrainingById: (req, res) => {
//         const { id } = req.params;
//         Training.getById(id, (err, training) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Error fetching training' });
//             }
//             if (!training) {
//                 return res.status(404).json({ error: 'Training not found' });
//             }
//             res.status(200).json(training);
//         });
//     },

//     updateTraining: (req, res) => {
//         const { id } = req.params;
//         const updatedTraining = req.body;

//         console.log('Update request body:', updatedTraining); // Log the incoming data

//         Training.update(id, updatedTraining, (err) => {
//             if (err) {
//                 console.error('Update error:', err.message); // Log the exact error
//                 return res.status(500).json({ error: 'Error updating training' });
//             }
//             res.status(200).json({ message: 'Training updated successfully' });
//         });
//     },

//     deleteTraining: (req, res) => {
//         const { id } = req.params;
//         Training.delete(id, (err) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Error deleting training' });
//             }
//             res.status(200).json({ message: 'Training deleted successfully' });
//         });
//     }
// };

// module.exports = TrainingController;

const { Training } = require('../models/Training');

const TrainingController = {
  createTraining: async (req, res) => {
    try {
      const training = req.body;

      // Validate category_id if needed
      if (!training.category_id) {
        return res.status(400).json({ error: 'Category ID is required' });
      }

      const createdTraining = await Training.create(training);
      res.status(201).json({
        message: 'Training created successfully',
        training: createdTraining 
      });
    } catch (error) {
      console.error('Training creation error:', error);
      res.status(500).json({ 
        error: 'Error creating training', 
        details: error.message 
      });
    }
  },

  getTrainingsByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const trainings = await Training.getByCategory(categoryId);
      res.status(200).json(trainings);
    } catch (error) {
      console.error('Fetching trainings by category error:', error);
      res.status(500).json({ 
        error: 'Error fetching trainings', 
        details: error.message 
      });
    }
  },

  getAllTrainings: async (req, res) => {
    try {
      const trainings = await Training.getAll();
      res.status(200).json(trainings);
    } catch (error) {
      console.error('Fetching all trainings error:', error);
      res.status(500).json({ 
        error: 'Error fetching trainings', 
        details: error.message 
      });
    }
  },

  getTrainingById: async (req, res) => {
    try {
      const { id } = req.params;
      const training = await Training.getById(id);
      
      if (!training) {
        return res.status(404).json({ error: 'Training not found' });
      }
      
      res.status(200).json(training);
    } catch (error) {
      console.error('Fetching training by ID error:', error);
      res.status(500).json({ 
        error: 'Error fetching training', 
        details: error.message 
      });
    }
  },

  updateTraining: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTraining = req.body;
  
      const updated = await Training.update(id, updatedTraining);
  
      res.status(200).json({ message: 'Training updated successfully', training: updated });
    } catch (error) {
      console.error('Error updating training:', error);
      res.status(500).json({
        error: 'Error updating training',
        details: error.message,
      });
    }
  },
  

  deleteTraining: async (req, res) => {
    try {
      const { id } = req.params;
  
      // Call the delete method in the Training model
      await Training.delete(id);
  
      res.status(200).json({ message: 'Training deleted successfully' });
    } catch (error) {
      console.error('Delete training error:', error);
      res.status(500).json({
        error: 'Error deleting training',
        details: error.message,
      });
    }
  }  
};

module.exports = TrainingController;