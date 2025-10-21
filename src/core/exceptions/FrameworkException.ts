export class FrameworkException extends Error {
    public readonly timestamp: Date;
    public readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    public readonly context?: Record<string, any>;
    public readonly screenshot?: string;
  
    constructor(
      message: string,
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
      context?: Record<string, any>,
      screenshot?: string
    ) {
      super(message);
      this.name = this.constructor.name;
      this.timestamp = new Date();
      this.severity = severity;
      this.context = context;
      this.screenshot = screenshot;
      Error.captureStackTrace(this, this.constructor);
    }
  
    public toJSON(): Record<string, any> {
      return {
        name: this.name,
        message: this.message,
        severity: this.severity,
        timestamp: this.timestamp.toISOString(),
        context: this.context,
        screenshot: this.screenshot,
        stack: this.stack
      };
    }
  }