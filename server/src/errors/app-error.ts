// Throw this anywhere to fail a request with a specific status code;
// errorHandler catches it and maps it to that response.
export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}
