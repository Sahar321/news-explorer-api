class TooManyRequestsError extends Error {
  constructor(message) {
    super(message || 'Too Many Requests');
    this.statusCode = 429;
    this.message = message || 'Too Many Requests';
  }
}

module.exports = TooManyRequestsError;
