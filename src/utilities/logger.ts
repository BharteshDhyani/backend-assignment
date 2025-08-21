import winston from 'winston';
import { getId as getCorrelationId } from 'express-correlation-id';
import type { TransformableInfo } from 'logform';

interface CorrelationInfo extends TransformableInfo {
  correlationId?: string;
}

const correlationFormat = winston.format(
  (info: CorrelationInfo) => {
    info.correlationId = getCorrelationId();
    return info;
  },
);

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    correlationFormat(),
    winston.format.timestamp(),
    winston.format.printf(
      ({ level, message, timestamp, correlationId }) => {
        return `${timestamp} [${level}] [correlationId=${correlationId}]: ${message}`;
      },
    ),
  ),
  transports: [new winston.transports.Console()],
});
