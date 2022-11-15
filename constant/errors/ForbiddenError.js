class ForbiddenError extends Error {
  constructor(message) {
    super(message || 'You do not have permissions to perform this action.');
    this.statusCode = 403;
    this.message = message || 'You do not have permissions to perform this action.';
  }
}

module.exports = ForbiddenError;
