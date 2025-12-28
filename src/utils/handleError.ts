export class appError extends Error {
  status: number;
  isOperational: boolean;
  constructor(statusCode: number, message: string) {
    super(message);
    this.status = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
