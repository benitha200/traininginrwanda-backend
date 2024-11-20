const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to database
    await saveResetToken(user.id, resetToken, resetTokenExpiry);

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await sendResetPasswordEmail(email, resetUrl);

    res.status(200).json({ 
      message: 'Password reset link sent to your email' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error processing password reset', 
      error: error.message 
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find user by reset token and check expiry
    const user = await findUserByResetToken(token);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update password and clear reset token
    await updateUserPassword(user.id, hashedPassword);

    res.status(200).json({ 
      message: 'Password reset successful' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error resetting password', 
      error: error.message 
    });
  }
};

// Change Password (for logged-in users)
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Fetch user from database
    const user = await findUserById(userId);

    // Verify current password
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update password
    await updateUserPassword(userId, hashedPassword);

    res.status(200).json({ 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error changing password', 
      error: error.message 
    });
  }
};

// Get All Users (admin-only)
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch users (exclude sensitive information)
    const users = await fetchAllUsers();

    res.status(200).json({ 
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      })) 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};

// Helper functions (you'll need to implement these with your SQLite database)
function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) reject(err);
      resolve(user);
    });
  });
}

function saveResetToken(userId, token, expiry) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', 
      [token, expiry, userId], 
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

function sendResetPasswordEmail(email, resetUrl) {
  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Your email configuration
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `
  };

  return transporter.sendMail(mailOptions);
}

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await findUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ 
          message: 'No user found with that email' 
        });
      }
  
      // Verify password
      const isMatch = bcrypt.compareSync(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }
  
      // Generate JWT token
      const token = generateToken(user);
  
      res.status(200).json({ 
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Login error', 
        error: error.message 
      });
    }
  };
  
  // Helper function to generate JWT token
  function generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: '1h' // Token expires in 1 hour
      }
    );
  }