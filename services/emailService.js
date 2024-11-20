const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { db } = require('../app');

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.enrollInCourse = (req, res) => {
  const { userId, courseId, personalInfo } = req.body;

  // First, check if course has available capacity
  db.get('SELECT * FROM courses WHERE id = ?', [courseId], (err, course) => {
    if (err || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Insert enrollment
    const enrollQuery = `
      INSERT INTO enrollments (user_id, course_id) 
      VALUES (?, ?)
    `;

    db.run(enrollQuery, [userId, courseId], async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Enrollment failed', details: err });
      }

      try {
        // Generate PDF Invitation
        const pdfPath = await generateInvitationPDF(course, personalInfo);
        
        // Send Email
        await sendEnrollmentEmail(personalInfo.email, course, pdfPath);

        res.status(201).json({ 
          message: 'Successfully enrolled', 
          course: course 
        });
      } catch (error) {
        res.status(500).json({ error: 'Email or PDF generation failed' });
      }
    });
  });
};

function generateInvitationPDF(course, personalInfo) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, '../pdfs', `invitation_${Date.now()}.pdf`);
    
    doc.pipe(fs.createWriteStream(pdfPath));

    doc
      .fontSize(25)
      .text('Course Enrollment Invitation', 100, 80)
      .moveDown()
      .fontSize(15)
      .text(`Course: ${course.title}`)
      .text(`Date: ${course.start_date} - ${course.end_date}`)
      .text(`Name: ${personalInfo.fullName}`)
      .text(`Email: ${personalInfo.email}`);

    doc.end();

    doc.on('finish', () => resolve(pdfPath));
    doc.on('error', reject);
  });
}

async function sendEnrollmentEmail(email, course, pdfPath) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: `Enrollment Confirmation: ${course.title}`,
    text: 'Thank you for enrolling in our course!',
    attachments: [{ path: pdfPath }]
  };

  return transporter.sendMail(mailOptions);
}