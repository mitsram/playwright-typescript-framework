import { request, APIRequestContext, APIResponse } from '@playwright/test';
import { IApiRequestOptions } from '../../types/IApiRequestOptions';
import { IApiResponse } from '../../types/IApiResponse';
import { Logger } from '../../utils/Logger';
import { ConfigManager } from '../config/ConfigManager';
import { ApiException } from '../exceptions/ApiException';
import { FrameworkException } from '../exceptions/FrameworkException';
import { ExceptionHandler } from '../exceptions/ExceptionHandler';

export class ApiDriver {
  private apiContext!: APIRequestContext;
  private logger = Logger.getInstance();
  private configManager = ConfigManager.getInstance();
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || this.configManager.getApiBaseUrl();
  }

  public async initialize(options?: { headers?: Record<string, string> }): Promise<void> {
    try {
      this.apiContext = await request.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: { ...this.defaultHeaders, ...options?.headers },
        ignoreHTTPSErrors: true
      });
      this.logger.info('API context initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize API context', error as Error);
      throw new FrameworkException(
        `API context initialization failed: ${(error as Error).message}`,
        'CRITICAL'
      );
    }
  }

  public setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    this.logger.info('Default headers updated', headers);
  }

  public setAuthToken(token: string, type: 'Bearer' | 'Basic' = 'Bearer'): void {
    this.defaultHeaders['Authorization'] = `${type} ${token}`;
    this.logger.info(`Authentication token set (${type})`);
  }

  private async executeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    options?: IApiRequestOptions
  ): Promise<IApiResponse<T>> {
    const startTime = Date.now();
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      this.logger.info(`API ${method} Request: ${fullUrl}`, {
        params: options?.params,
        headers: options?.headers
      });

      let response: APIResponse;

      const requestOptions: any = {
        headers: { ...this.defaultHeaders, ...options?.headers },
        params: options?.params,
        timeout: options?.timeout || this.configManager.getTimeout()
      };

      switch (method) {
        case 'GET':
          response = await this.apiContext.get(endpoint, requestOptions);
          break;
        case 'POST':
          response = await this.apiContext.post(endpoint, {
            ...requestOptions,
            data: options?.data
          });
          break;
        case 'PUT':
          response = await this.apiContext.put(endpoint, {
            ...requestOptions,
            data: options?.data
          });
          break;
        case 'PATCH':
          response = await this.apiContext.patch(endpoint, {
            ...requestOptions,
            data: options?.data
          });
          break;
        case 'DELETE':
          response = await this.apiContext.delete(endpoint, requestOptions);
          break;
        default:
          throw new ApiException(endpoint, `Unsupported HTTP method: ${method}`);
      }

      const duration = Date.now() - startTime;
      const responseData = await this.parseResponse<T>(response);

      const apiResponse: IApiResponse<T> = {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        data: responseData,
        duration
      };

      this.logger.info(`API ${method} Response: ${response.status()} - ${duration}ms`, {
        status: response.status(),
        duration
      });

      if (!response.ok()) {
        throw new ApiException(
          endpoint,
          `Request failed with status ${response.status()}`,
          response.status(),
          { method, response: apiResponse }
        );
      }

      return apiResponse;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`API ${method} Request Failed: ${fullUrl}`, error as Error);

      if (error instanceof ApiException) {
        await ExceptionHandler.handle(error, undefined, true);
      }

      throw new ApiException(
        endpoint,
        (error as Error).message,
        undefined,
        { method, duration }
      );
    }
  }

  private async parseResponse<T>(response: APIResponse): Promise<T> {
    const contentType = response.headers()['content-type'] || '';

    try {
      if (contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType.includes('text')) {
        return (await response.text()) as any;
      } else {
        return (await response.body()) as any;
      }
    } catch (error) {
      this.logger.warn('Failed to parse response body', error as Error);
      return null as any;
    }
  }

  public async get<T = any>(
    endpoint: string,
    options?: IApiRequestOptions
  ): Promise<IApiResponse<T>> {
    return this.executeRequest<T>('GET', endpoint, options);
  }

  public async post<T = any>(
    endpoint: string,
    data?: any,
    options?: IApiRequestOptions
  ): Promise<IApiResponse<T>> {
    return this.executeRequest<T>('POST', endpoint, { ...options, data });
  }

  public async put<T = any>(
    endpoint: string,
    data?: any,
    options?: IApiRequestOptions
  ): Promise<IApiResponse<T>> {
    return this.executeRequest<T>('PUT', endpoint, { ...options, data });
  }

  public async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: IApiRequestOptions
  ): Promise<IApiResponse<T>> {
    return this.executeRequest<T>('PATCH', endpoint, { ...options, data });
  }

  public async delete<T = any>(
    endpoint: string,
    options?: IApiRequestOptions
  ): Promise<IApiResponse<T>> {
    return this.executeRequest<T>('DELETE', endpoint, options);
  }

  public async uploadFile(
    endpoint: string,
    filePath: string,
    fieldName: string = 'file',
    additionalData?: Record<string, any>
  ): Promise<IApiResponse<any>> {
    try {
      const formData: any = {
        [fieldName]: {
          name: filePath.split('/').pop() || 'file',
          mimeType: 'application/octet-stream',
          buffer: Buffer.from('') // In real scenario, read file content
        }
      };

      if (additionalData) {
        Object.assign(formData, additionalData);
      }

      const response = await this.apiContext.post(endpoint, {
        multipart: formData,
        headers: this.defaultHeaders
      });

      return {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        data: await this.parseResponse(response),
        duration: 0
      };
    } catch (error) {
      throw new ApiException(
        endpoint,
        `File upload failed: ${(error as Error).message}`
      );
    }
  }

  public async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
      this.logger.info('API context disposed');
    }
  }

  public getApiContext(): APIRequestContext {
    if (!this.apiContext) {
      throw new FrameworkException(
        'API context not initialized. Call initialize() first.',
        'CRITICAL'
      );
    }
    return this.apiContext;
  }
}