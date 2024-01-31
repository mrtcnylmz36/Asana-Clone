module.exports = (error, req, res, next) => {
  console.log('Error middleware triggered');
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error...',
    },
  });
  next();
};
