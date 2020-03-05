
export const Status200OK = 200;
export const Status400BadRequest = 400;
export const Status401Unauthorized = 401;
export const Status403Forbidden = 403;
export const Status404NotFound = 404;
export const Status422UnprocessableEntity = 422;
export const Status500InternalServerError = 500;
export const Status503ServiceUnavailable = 503;

export function isSuccess(code: number) {
  return code > 199 && code < 300;
}

export function isClientError(code: number) {
  return code > 399 && code < 500;
}

export function isServerError(code: number) {
  return code > 499 && code < 600;
}
