import { Page, BrowserContext, Browser } from '@playwright/test';
import { BrowserManager } from '../browser/BrowserManager';
import { ElementActions } from '../actions/ElementActions';
import { WaitActions } from '../actions/WaitActions';
import { NavigationActions } from '../actions/NavigationActions';
import { Logger } from '../../utils/Logger';
import { IBrowserOptions } from '../../types/IBrowserOptions';

export class WebDriver {
  private browserManager: BrowserManager;
  private logger = Logger.getInstance();
  public elementActions!: ElementActions;
  public waitActions!: WaitActions;
  public navigationActions!: NavigationActions;

  constructor() {
    this.browserManager = BrowserManager.getInstance();
  }

  public async initialize(
    browserType?: 'chromium' | 'firefox' | 'webkit',
    options?: IBrowserOptions
  ): Promise<void> {
    await this.browserManager.initialize(browserType, options);
    const page = this.getPage();
    
    this.elementActions = new ElementActions(page);
    this.waitActions = new WaitActions(page);
    this.navigationActions = new NavigationActions(page);
    
    this.logger.info('WebDriver initialized successfully');
  }

  public getPage(): Page {
    return this.browserManager.getPage();
  }

  public getContext(): BrowserContext {
    return this.browserManager.getContext();
  }

  public getBrowser(): Browser {
    return this.browserManager.getBrowser();
  }

  public async takeScreenshot(path: string): Promise<void> {
    await this.getPage().screenshot({ path, fullPage: true });
    this.logger.info(`Screenshot saved: ${path}`);
  }

  public async executeScript<T>(script: string | Function, ...args: any[]): Promise<T> {
    return await this.getPage().evaluate(script as any, ...args);
  }

  public async addCookie(name: string, value: string, domain?: string): Promise<void> {
    await this.getContext().addCookies([
      {
        name,
        value,
        domain: domain || new URL(this.getPage().url()).hostname,
        path: '/'
      }
    ]);
    this.logger.info(`Cookie added: ${name}`);
  }

  public async clearCookies(): Promise<void> {
    await this.getContext().clearCookies();
    this.logger.info('All cookies cleared');
  }

  public async setViewportSize(width: number, height: number): Promise<void> {
    await this.getPage().setViewportSize({ width, height });
    this.logger.info(`Viewport size set to: ${width}x${height}`);
  }

  public async cleanup(): Promise<void> {
    await this.browserManager.cleanup();
    this.logger.info('WebDriver cleaned up');
  }
}