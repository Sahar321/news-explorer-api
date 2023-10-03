class UnauthorizedError extends Error {
  constructor(message, shouldDisplayToUser = false) {
    super(message || 'You are not authorized to access');
    this.statusCode = 401;
    this.shouldDisplayToUser = shouldDisplayToUser;
    this.message = message || 'You are not authorized to access';
  }
}

module.exports = UnauthorizedError;
