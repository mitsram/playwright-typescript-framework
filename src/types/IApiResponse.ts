export interface IApiResponse<T = any> {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: T;
    duration: number;
  }