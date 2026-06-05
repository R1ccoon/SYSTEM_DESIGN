const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    
    const status = err.status || 500;
    const message = err.message || 'Внутренняя ошибка сервера';
    
    res.status(status).json({
    error: true,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;