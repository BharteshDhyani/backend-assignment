export default class CustomError extends Error {
  code: number = 500;
  keyPattern?: Record<string, any>;
}
