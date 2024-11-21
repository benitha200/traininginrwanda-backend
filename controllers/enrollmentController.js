// controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');

exports.createEnrollment = async (req, res) => {
  try {
    const enrollmentData = req.body;
    const newEnrollment = await Enrollment.createEnrollment(enrollmentData);
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating enrollment', 
      error: error.message 
    });
  }
};

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.getAllEnrollments();
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching enrollments', 
      error: error.message 
    });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.getEnrollmentById(id);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching enrollment', 
      error: error.message 
    });
  }
};

exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await Enrollment.updateEnrollmentStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating enrollment status', 
      error: error.message 
    });
  }
};