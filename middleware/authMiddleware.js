const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.protect = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Role-based access control
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (from protect middleware)
    if (!req.user) {
      return res.status(401).json({ error: 'Please log in first' });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action',
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }

    // If role is allowed, proceed to next middleware
    next();
  };
};