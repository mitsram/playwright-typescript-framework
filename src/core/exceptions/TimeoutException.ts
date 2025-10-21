import { FrameworkException } from './FrameworkException';

export class TimeoutException extends FrameworkException {
    constructor(message: string, timeout: number, context?: Record<string, any>) {
      super(
        `Timeout Exception: ${message} (timeout: ${timeout}ms)`,
        'HIGH',
        { ...context, timeout }
      );
    }
  }