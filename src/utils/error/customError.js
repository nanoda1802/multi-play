class CustomError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.code = errorCode;
    this.name = `CustomError`;
  }
}

export default CustomError;
