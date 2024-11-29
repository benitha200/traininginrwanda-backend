const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./traininginrwanda1.db');

class Enrollment {
  static createEnrollment(enrollmentData) {
    return new Promise((resolve, reject) => {
      const { fullname, email, phone, address, training_schedule_id } = enrollmentData;
      const query = `
        INSERT INTO enrollment 
        (fullname, email, phone, address, training_schedule_id) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(query, 
        [fullname, email, phone, address, training_schedule_id], 
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }

  static getAllEnrollments() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT e.*, ts.start_date, ts.end_date, t.title as training_title 
        FROM enrollment e
        JOIN training_schedules ts ON e.training_schedule_id = ts.id
        JOIN trainings t ON ts.training_id = t.id
      `, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getEnrollmentById(id) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT e.*, ts.start_date, ts.end_date, t.title as training_title 
        FROM enrollment e
        JOIN training_schedules ts ON e.training_schedule_id = ts.id
        JOIN trainings t ON ts.training_id = t.id
        WHERE e.id = ?
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static updateEnrollmentStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run(`
        UPDATE enrollment
        SET status = ? 
        WHERE id = ?
      `, [status, id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Enrollment status updated' });
        }
      });
    });
  }
}

module.exports = Enrollment;