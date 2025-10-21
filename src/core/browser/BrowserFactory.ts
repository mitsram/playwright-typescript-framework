import { Browser, chromium, firefox, webkit, BrowserContext, Page } from '@playwright/test';
import { IBrowserOptions } from '../../types/IBrowserOptions';
import { ConfigManager } from '../config/ConfigManager';
import { Logger } from '../../utils/Logger';
import { FrameworkException } from '../exceptions/FrameworkException';

export class BrowserFactory {
  private static logger = Logger.getInstance();
  private static configManager = ConfigManager.getInstance();

  public static async createBrowser(
    browserType?: 'chromium' | 'firefox' | 'webkit',
    options?: IBrowserOptions
  ): Promise<Browser> {
    const type = browserType || this.configManager.getBrowserType();
    const config = this.configManager.getTestConfig();

    const launchOptions = {
      headless: options?.headless ?? config.headless,
      slowMo: options?.slowMo ?? config.slowMo,
      args: this.getBrowserArgs(type)
    };

    this.logger.info(`Launching ${type} browser`, launchOptions);

    try {
      let browser: Browser;

      switch (type) {
        case 'chromium':
          browser = await chromium.launch(launchOptions);
          break;
        case 'firefox':
          browser = await firefox.launch(launchOptions);
          break;
        case 'webkit':
          browser = await webkit.launch(launchOptions);
          break;
        default:
          throw new FrameworkException(
            `Unsupported browser type: ${type}`,
            'CRITICAL'
          );
      }

      this.logger.info(`${type} browser launched successfully`);
      return browser;
    } catch (error) {
      this.logger.error(`Failed to launch ${type} browser`, error as Error);
      throw new FrameworkException(
        `Browser launch failed: ${(error as Error).message}`,
        'CRITICAL',
        { browserType: type }
      );
    }
  }

  public static async createContext(
    browser: Browser,
    options?: IBrowserOptions
  ): Promise<BrowserContext> {
    const config = this.configManager.getTestConfig();

    const contextOptions: any = {
      viewport: options?.viewport ?? config.viewport,
      recordVideo: options?.recordVideo ? { dir: 'videos/' } : undefined,
      ignoreHTTPSErrors: true,
      acceptDownloads: true
    };

    try {
      const context = await browser.newContext(contextOptions);

      if (options?.trace ?? config.traceOnFailure) {
        await context.tracing.start({ screenshots: true, snapshots: true });
      }

      this.logger.info('Browser context created successfully');
      return context;
    } catch (error) {
      this.logger.error('Failed to create browser context', error as Error);
      throw new FrameworkException(
        `Context creation failed: ${(error as Error).message}`,
        'CRITICAL'
      );
    }
  }

  public static async createPage(context: BrowserContext): Promise<Page> {
    try {
      const page = await context.newPage();
      const config = this.configManager.getTestConfig();
      
      page.setDefaultTimeout(config.timeout);
      page.setDefaultNavigationTimeout(config.timeout);

      this.logger.info('New page created successfully');
      return page;
    } catch (error) {
      this.logger.error('Failed to create page', error as Error);
      throw new FrameworkException(
        `Page creation failed: ${(error as Error).message}`,
        'CRITICAL'
      );
    }
  }

  private static getBrowserArgs(browserType: string): string[] {
    const commonArgs = [
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ];

    if (browserType === 'chromium') {
      return [
        ...commonArgs,
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ];
    }

    return commonArgs;
  }
}
