//Higher-order function that wraps async route handler functions, allowing asynchronous errors to be caught and forwarded to error-handling middleware
module.exports = func => {
    return (req, res, next) => {
        // Execute the provided function and catch any promise rejections
        func(req, res, next).catch(next);
    };
};