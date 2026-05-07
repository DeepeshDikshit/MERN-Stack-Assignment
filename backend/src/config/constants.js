export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const API_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  INVALID_REQUEST: 'Invalid request parameters',
  SERVER_ERROR: 'Internal server error',
};

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
