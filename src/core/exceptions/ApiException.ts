import { FrameworkException } from './FrameworkException';

export class ApiException extends FrameworkException {
    public readonly statusCode?: number;
    public readonly endpoint: string;
  
    constructor(
      endpoint: string,
      message: string,
      statusCode?: number,
      context?: Record<string, any>
    ) {
      super(
        `API Exception: ${message} for endpoint '${endpoint}'`,
        'HIGH',
        { ...context, endpoint, statusCode }
      );
      this.statusCode = statusCode;
      this.endpoint = endpoint;
    }
  }