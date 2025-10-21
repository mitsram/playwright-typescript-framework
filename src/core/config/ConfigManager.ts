import * as fs from 'fs';
import * as path from 'path';
import { ITestConfig } from '../../types/ITestConfig';
import { IEnvironmentConfig } from '../../types/IEnvironmentConfig';


export class ConfigManager {
  private static instance: ConfigManager;
  private testConfig!: ITestConfig;
  private environmentConfig!: IEnvironmentConfig;

  private constructor() {
    this.loadConfigs();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfigs(): void {
    const environment = process.env.TEST_ENV || 'test';
    const configPath = path.resolve(process.cwd(), 'config', `${environment}.config.json`);

    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }    

    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    this.testConfig = configData.testConfig;
    this.environmentConfig = configData.environment;
  }

  public getTestConfig(): ITestConfig {
    return this.testConfig;
  }

  public getEnvironmentConfig(): IEnvironmentConfig {
    return this.environmentConfig;
  }

  public getBaseUrl(): string {
    return this.environmentConfig.url;
  }

  public getApiBaseUrl(): string {
    return this.environmentConfig.apiUrl;
  }

  public getTimeout(): number {
    return this.testConfig.timeout;
  }

  public getBrowserType(): 'chromium' | 'firefox' | 'webkit' {
    return this.testConfig.browserType;
  }

  public isHeadless(): boolean {
    return this.testConfig.headless;
  }

  public updateConfig(updates: Partial<ITestConfig>): void {
    this.testConfig = { ...this.testConfig, ...updates };
  }
}