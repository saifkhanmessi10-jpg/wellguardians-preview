export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

export const notFound = (msg = "Not found") => new AppError(404, "not_found", msg);
export const conflict = (code: string, msg: string) => new AppError(409, code, msg);
export const badRequest = (msg: string, fields?: Record<string, string>) =>
  new AppError(400, "validation_error", msg, fields);
