import { Page } from '@playwright/test';
import { Logger } from '../../utils/Logger';

export class NavigationActions {
    private page: Page;
    private logger = Logger.getInstance();
  
    constructor(page: Page) {
      this.page = page;
    }
  
    public async navigateToUrl(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
      this.logger.info(`Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil: options?.waitUntil || 'load' });
    }
  
    public async reload(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
      this.logger.info('Reloading page');
      await this.page.reload({ waitUntil: options?.waitUntil || 'load' });
    }
  
    public async goBack(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
      this.logger.info('Navigating back');
      await this.page.goBack({ waitUntil: options?.waitUntil || 'load' });
    }
  
    public async goForward(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
      this.logger.info('Navigating forward');
      await this.page.goForward({ waitUntil: options?.waitUntil || 'load' });
    }
  
    public getCurrentUrl(): string {
      return this.page.url();
    }
  
    public async getTitle(): Promise<string> {
      return await this.page.title();
    }
}