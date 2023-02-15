class ConflictError extends Error {
  constructor(message) {
    super(
      message
        || 'The request could not be processed because of conflict in the request',
    );
    this.statusCode = 409;
    this.message = message
      || 'The request could not be processed because of conflict in the request';
  }
}

module.exports = ConflictError;
