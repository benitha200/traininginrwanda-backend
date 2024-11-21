const { TrainingSchedule } = require('../models/Training');

const TrainingScheduleController = {
  createTrainingSchedule: (req, res) => {
    const schedule = req.body;
    TrainingSchedule.create(schedule, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating training schedule' });
      }
      res.status(201).json({ message: 'Training schedule created successfully' });
    });
  },

  getAllTrainingSchedules: (req, res) => {
    TrainingSchedule.getAll((err, schedules) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching training schedules' });
      }
      res.status(200).json(schedules);
    });
  },

  getTrainingScheduleById: (req, res) => {
    const { id } = req.params;
    TrainingSchedule.getById(id, (err, schedule) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching training schedule' });
      }
      if (!schedule) {
        return res.status(404).json({ error: 'Training schedule not found' });
      }
      res.status(200).json(schedule);
    });
  },

  updateTrainingSchedule: (req, res) => {
    const { id } = req.params;
    const updatedSchedule = req.body;
    TrainingSchedule.update(id, updatedSchedule, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating training schedule' });
      }
      res.status(200).json({ message: 'Training schedule updated successfully' });
    });
  },

  deleteTrainingSchedule: (req, res) => {
    const { id } = req.params;
    TrainingSchedule.delete(id, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting training schedule' });
      }
      res.status(200).json({ message: 'Training schedule deleted successfully' });
    });
  }
};

module.exports = TrainingScheduleController;