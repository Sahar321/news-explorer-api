class InValidRequestError extends Error {
  constructor(message) {
    super(message || 'request is invalid');
    this.statusCode = 400;
    this.message = message || 'request is invalid';
  }
}

module.exports = InValidRequestError;
