exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Database errors
  if (err.code === '23505') {
    return res.status(400).json({ message: 'This email is already registered' });
  }
  
  // Default error response
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
