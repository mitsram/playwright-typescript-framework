import { Page } from '@playwright/test';
import { Logger } from '../../utils/Logger';

export class WaitActions {
    private page: Page;
    private logger = Logger.getInstance();
  
    constructor(page: Page) {
      this.page = page;
    }
  
    public async waitForTimeout(milliseconds: number): Promise<void> {
      this.logger.debug(`Waiting for ${milliseconds}ms`);
      await this.page.waitForTimeout(milliseconds);
    }
  
    public async waitForLoadState(
      state: 'load' | 'domcontentloaded' | 'networkidle' = 'load',
      timeout?: number
    ): Promise<void> {
      this.logger.debug(`Waiting for load state: ${state}`);
      await this.page.waitForLoadState(state, { timeout });
    }
  
    public async waitForUrl(url: string | RegExp, timeout?: number): Promise<void> {
      this.logger.debug(`Waiting for URL: ${url}`);
      await this.page.waitForURL(url, { timeout });
    }
  
    public async waitForResponse(
      urlPattern: string | RegExp,
      timeout?: number
    ): Promise<void> {
      this.logger.debug(`Waiting for response: ${urlPattern}`);
      await this.page.waitForResponse(urlPattern, { timeout });
    }
  
    public async waitForRequest(
      urlPattern: string | RegExp,
      timeout?: number
    ): Promise<void> {
      this.logger.debug(`Waiting for request: ${urlPattern}`);
      await this.page.waitForRequest(urlPattern, { timeout });
    }
}
  