import { Page } from '@playwright/test';
import { ElementActions } from '../actions/ElementActions';
import { WaitActions } from '../actions/WaitActions';
import { NavigationActions } from '../actions/NavigationActions';
import { Logger } from '../../utils/Logger';
import { ConfigManager } from '../config/ConfigManager';
import { IElementOptions } from '../../types/IElementOptions';

export abstract class BasePage {
  protected page: Page;
  protected elementActions: ElementActions;
  protected waitActions: WaitActions;
  protected navigationActions: NavigationActions;
  protected logger = Logger.getInstance();
  protected configManager = ConfigManager.getInstance();
  protected abstract pageUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.elementActions = new ElementActions(page);
    this.waitActions = new WaitActions(page);
    this.navigationActions = new NavigationActions(page);
  }

  /**
   * Navigate to the page
   */
  public async navigate(): Promise<void> {
    const fullUrl = this.getFullUrl();
    this.logger.info(`Navigating to page: ${fullUrl}`);
    await this.navigationActions.navigateToUrl(fullUrl);
    await this.waitForPageLoad();
  }

  /**
   * Get the full URL for the page
   */
  protected getFullUrl(): string {
    const baseUrl = this.configManager.getBaseUrl();
    return this.pageUrl.startsWith('http') 
      ? this.pageUrl 
      : `${baseUrl}${this.pageUrl}`;
  }

  /**
   * Wait for page to be fully loaded
   * Override in derived classes for custom loading logic
   */
  protected async waitForPageLoad(): Promise<void> {
    await this.waitActions.waitForLoadState('load');
    this.logger.debug('Page loaded successfully');
  }

  /**
   * Verify the page is displayed
   * Override in derived classes to check specific elements
   */
  public abstract isDisplayed(): Promise<boolean>;

  /**
   * Get the current page title
   */
  public async getPageTitle(): Promise<string> {
    return await this.navigationActions.getTitle();
  }

  /**
   * Get the current page URL
   */
  public getCurrentUrl(): string {
    return this.navigationActions.getCurrentUrl();
  }

  /**
   * Take a screenshot of the page
   */
  public async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    this.logger.info(`Screenshot saved: ${filename}`);
    return filename;
  }

  /**
   * Reload the current page
   */
  public async reload(): Promise<void> {
    await this.navigationActions.reload();
    await this.waitForPageLoad();
  }

  /**
   * Scroll to an element
   */
  protected async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for a specific element to be visible
   */
  protected async waitForElement(
    selector: string,
    options?: IElementOptions
  ): Promise<void> {
    await this.page.locator(selector).waitFor({
      state: 'visible',
      timeout: options?.timeout || this.configManager.getTimeout()
    });
  }

  /**
   * Execute custom JavaScript on the page
   */
  protected async executeScript<T>(script: string | Function, ...args: any[]): Promise<T> {
    return await this.page.evaluate(script as any, ...args);
  }

  /**
   * Switch to iframe
   */
  protected async switchToFrame(frameSelector: string): Promise<Page> {
    const frame = this.page.frameLocator(frameSelector);
    return this.page;
  }

  /**
   * Handle alert dialogs
   */
  protected async acceptAlert(): Promise<void> {
    this.page.once('dialog', dialog => dialog.accept());
  }

  protected async dismissAlert(): Promise<void> {
    this.page.once('dialog', dialog => dialog.dismiss());
  }

  protected async getAlertText(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once('dialog', dialog => {
        const text = dialog.message();
        dialog.accept();
        resolve(text);
      });
    });
  }
}