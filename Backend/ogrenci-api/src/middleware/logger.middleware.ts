import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logLevelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const getResponseLogLevel = (statusCode: number): LogLevel => {
  if (statusCode >= 500) return 'error';
  if (statusCode >= 400) return 'warn';
  return 'info';
};

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const level = getResponseLogLevel(res.statusCode);
    if (logLevelPriority[level] < logLevelPriority[env.LOG_LEVEL]) return;

    const logEntry = JSON.stringify({
      level,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
    });

    console[level](logEntry);
  });

  next();
};
