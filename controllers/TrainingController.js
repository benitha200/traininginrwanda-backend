// controllers/TrainingController.js
const { Training } = require('../models/Training');

const TrainingController = {
    // createTraining: (req, res) => {
    //     const training = req.body;
    //     Training.create(training, (err) => {
    //         if (err) {
    //             return res.status(500).json({ error: 'Error creating training' });
    //         }
    //         res.status(201).json({ message: 'Training created successfully' });
    //     });
    // },

    createTraining: (req, res) => {
        const training = req.body;
        
        // Validate category_id if needed
        if (!training.category_id) {
          return res.status(400).json({ error: 'Category ID is required' });
        }
    
        Training.create(training, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error creating training', details: err.message });
          }
          res.status(201).json({ message: 'Training created successfully' });
        });
      },

      getTrainingsByCategory: (req, res) => {
        const { categoryId } = req.params;
        
        Training.getByCategory(categoryId, (err, trainings) => {
          if (err) {
            return res.status(500).json({ error: 'Error fetching trainings', details: err.message });
          }
          res.status(200).json(trainings);
        });
      },

    getAllTrainings: (req, res) => {
        Training.getAll((err, trainings) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching trainings' });
            }
            res.status(200).json(trainings);
        });
    },

    getTrainingById: (req, res) => {
        const { id } = req.params;
        Training.getById(id, (err, training) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching training' });
            }
            if (!training) {
                return res.status(404).json({ error: 'Training not found' });
            }
            res.status(200).json(training);
        });
    },

    updateTraining: (req, res) => {
        const { id } = req.params;
        const updatedTraining = req.body;

        console.log('Update request body:', updatedTraining); // Log the incoming data

        Training.update(id, updatedTraining, (err) => {
            if (err) {
                console.error('Update error:', err.message); // Log the exact error
                return res.status(500).json({ error: 'Error updating training' });
            }
            res.status(200).json({ message: 'Training updated successfully' });
        });
    },

    deleteTraining: (req, res) => {
        const { id } = req.params;
        Training.delete(id, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting training' });
            }
            res.status(200).json({ message: 'Training deleted successfully' });
        });
    }
};

module.exports = TrainingController;