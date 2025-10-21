export interface ITestConfig {
    baseUrl: string;
    apiBaseUrl: string;
    timeout: number;
    retryAttempts: number;
    browserType: 'chromium' | 'firefox' | 'webkit';
    headless: boolean;
    slowMo: number;
    viewport: { width: number; height: number };
    screenshotOnFailure: boolean;
    videoOnFailure: boolean;
    traceOnFailure: boolean;
}