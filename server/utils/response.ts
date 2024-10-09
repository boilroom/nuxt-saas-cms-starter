import { H3Event } from 'h3';

const successResponse = (event: H3Event, data?: any) => {
  setResponseHeaders(event, {
    'Content-Type': 'application/json',
  });
  setResponseStatus(event, 200);
  return {
    statusCode: 200,
    status: 'ok',
    data: data ? data : null,
  };
}

const errorResponse = (event: H3Event, error: string, statusCode?: number) => {
  setResponseHeaders(event, {
    'Content-Type': 'application/json',
  });
  setResponseStatus(event, statusCode);
  return {
    statusCode: statusCode ? statusCode : 404,
    status: 'error',
    error,
  };
}

export { successResponse, errorResponse };