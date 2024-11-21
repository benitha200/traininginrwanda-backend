const express = require('express');
const TrainingScheduleController = require('../controllers/TrainingScheduleController');

const router = express.Router();

router.post('/', TrainingScheduleController.createTrainingSchedule);
router.get('/', TrainingScheduleController.getAllTrainingSchedules);
router.get('/:id', TrainingScheduleController.getTrainingScheduleById);
router.put('/:id', TrainingScheduleController.updateTrainingSchedule);
router.delete('/:id', TrainingScheduleController.deleteTrainingSchedule);

module.exports = router;