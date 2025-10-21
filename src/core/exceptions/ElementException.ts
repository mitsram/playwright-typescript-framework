import { FrameworkException } from './FrameworkException';

export class ElementException extends FrameworkException {
    public readonly selector: string;
    public readonly action: string;
  
    constructor(
      selector: string,
      action: string,
      message: string,
      context?: Record<string, any>,
      screenshot?: string
    ) {
      super(
        `Element Exception: Failed to ${action} on element '${selector}'. ${message}`,
        'HIGH',
        { ...context, selector, action },
        screenshot
      );
      this.selector = selector;
      this.action = action;
    }
  }