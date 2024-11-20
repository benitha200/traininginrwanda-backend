const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const cors = require('cors');
const path = require('path');

// Database Connection
const db = new sqlite3.Database('./coursemanagement.db', (err) => {
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
    role TEXT DEFAULT 'student'
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

  // Enrollments Table
  db.run(`CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(course_id) REFERENCES courses(id)
  )`);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes (to be imported)
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/enrollments', enrollmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, db };