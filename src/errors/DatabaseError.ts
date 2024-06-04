export class DatabaseError extends Error {
    cause: Error;
  
    constructor(message: string, cause: Error) {
      super(message);
      this.name = 'DatabaseError';
      this.cause = cause;
    }
  }