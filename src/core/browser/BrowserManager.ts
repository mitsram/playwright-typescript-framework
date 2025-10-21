import { Browser, BrowserContext, Page } from '@playwright/test';
import { Logger } from '../../utils/Logger';
import { FrameworkException } from '../exceptions/FrameworkException';
import { BrowserFactory } from './BrowserFactory';
import { IBrowserOptions } from '../../types/IBrowserOptions';

export class BrowserManager {
    private static instance: BrowserManager;
    private browser?: Browser;
    private context?: BrowserContext;
    private page?: Page;
    private logger = Logger.getInstance();
  
    private constructor() {}
  
    public static getInstance(): BrowserManager {
      if (!BrowserManager.instance) {
        BrowserManager.instance = new BrowserManager();
      }
      return BrowserManager.instance;
    }
  
    public async initialize(
      browserType?: 'chromium' | 'firefox' | 'webkit',
      options?: IBrowserOptions
    ): Promise<void> {
      this.browser = await BrowserFactory.createBrowser(browserType, options);
      this.context = await BrowserFactory.createContext(this.browser, options);
      this.page = await BrowserFactory.createPage(this.context);
    }
  
    public getPage(): Page {
      if (!this.page) {
        throw new FrameworkException(
          'Page not initialized. Call initialize() first.',
          'CRITICAL'
        );
      }
      return this.page;
    }
  
    public getContext(): BrowserContext {
      if (!this.context) {
        throw new FrameworkException(
          'Context not initialized. Call initialize() first.',
          'CRITICAL'
        );
      }
      return this.context;
    }
  
    public getBrowser(): Browser {
      if (!this.browser) {
        throw new FrameworkException(
          'Browser not initialized. Call initialize() first.',
          'CRITICAL'
        );
      }
      return this.browser;
    }
  
    public async cleanup(): Promise<void> {
      try {
        if (this.context) {
          await this.context.close();
          this.logger.info('Browser context closed');
        }
        if (this.browser) {
          await this.browser.close();
          this.logger.info('Browser closed');
        }
      } catch (error) {
        this.logger.error('Error during cleanup', error as Error);
      }
    }
  }