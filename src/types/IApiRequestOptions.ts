export interface IApiRequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
  }