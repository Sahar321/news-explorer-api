class NotFoundError extends Error {
  constructor(message) {
    super(message || 'Resource not found');
    this.statusCode = 404;
    this.message = message || 'Resource not found';
  }
}

module.exports = NotFoundError;
