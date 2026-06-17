const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth?.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretnauticalhelixkey12345');
    socket.userId = decoded.id; // Attach userId for personal room join
    next();
  } catch (err) {
    next(new Error('Authentication error: Token invalid'));
  }
};

module.exports = { socketAuth };
