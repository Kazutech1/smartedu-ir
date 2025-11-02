import morgan from 'morgan';
export const logger = morgan('dev');
import responseTime from 'response-time';

export const responseTimer = responseTime((req, res, time) => {
  // Attach to res.locals and header for visibility
  res.setHeader('X-Response-Time-ms', time.toFixed(2));
  res.locals.timeMs = Number(time.toFixed(2));
});
