export interface IEnvironmentConfig {
    name: string;
    url: string;
    apiUrl: string;
    credentials?: {
      username: string;
      password: string;
    };
  }