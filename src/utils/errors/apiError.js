class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }
  
  const throwError = (message, status) => {
    throw new ApiError(message, status);
  };
  
  module.exports = { throwError, ApiError };
  