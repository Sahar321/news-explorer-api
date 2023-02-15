class UnauthorizedError extends Error {
  constructor(message) {
    super(message || 'You are not authorized to access');
    this.statusCode = 401;
    this.message = message || 'You are not authorized to access';
  }
}

module.exports = UnauthorizedError;
