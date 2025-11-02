export const sendSuccess = (res, data = {}, timeMs = null) => {
    const payload = { status: 'success', data };
    if (timeMs !== null) payload.timeMs = Number(timeMs);
    return res.json(payload);
  };
  
  export const sendError = (res, message = 'Internal server error', code = 500, timeMs = null) => {
    const payload = { status: 'error', message };
    if (timeMs !== null) payload.timeMs = Number(timeMs);
    return res.status(code).json(payload);
  };
  
  export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  