const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const cors = require('cors');
const path = require('path');

// Database Connection
const db = new sqlite3.Database('./traininginrwanda.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create Tables
db.serialize(() => {
  // Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'ADMIN'
  )`);

  // Categories Table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    description TEXT
  )`);

  // Courses Table
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category_id INTEGER,
    description TEXT,
    start_date DATE,
    end_date DATE,
    capacity INTEGER,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  )`);

  // Enrollment Table
  db.run(`CREATE TABLE IF NOT EXISTS enrollment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    email TEXT,
    phone TEXT, 
    address TEXT,
    training_schedule_id INTEGER,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    FOREIGN KEY(training_schedule_id) REFERENCES training_schedules(id)
  )`);

    // Trainings Table
    db.run(`CREATE TABLE IF NOT EXISTS trainings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      duration INTEGER,
      instructor TEXT,
      start_date DATE,
      end_date DATE,
      fee DECIMAL(10,2),
      level TEXT,
      is_certified BOOLEAN,
      what_you_will_learn TEXT,
      address TEXT
    )`);

    //categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT
    )`);
  
    // Training Schedules Table
    db.run(`CREATE TABLE IF NOT EXISTS training_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_id INTEGER,
      start_date DATE,
      end_date DATE,
      capacity INTEGER,
      FOREIGN KEY(training_id) REFERENCES trainings(id)
    )`);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes (to be imported)
const authRoutes = require('./routes/authRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const trainingScheduleRoutes = require('./routes/trainingScheduleRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/training-schedules', trainingScheduleRoutes);
app.use('/api/enrollments', enrollmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, db };