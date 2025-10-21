import { Page } from '@playwright/test';
import { BasePage } from '@core/base/BasePage';

export class DashboardPage extends BasePage {
    protected pageUrl = '/dashboard';
  
    private readonly selectors = {
      welcomeMessage: '.welcome-message',
      userMenu: '#user-menu',
      logoutButton: '#logout-btn',
      searchField: '#search',
      notificationBadge: '.notification-badge'
    };
  
    constructor(page: Page) {
      super(page);
    }
  
    public async isDisplayed(): Promise<boolean> {
      try {
        return await this.elementActions.isElementVisibleAsync(this.selectors.welcomeMessage);
      } catch (error) {
        return false;
      }
    }
  
    public async getWelcomeMessage(): Promise<string> {
      return await this.elementActions.getTextAsync(this.selectors.welcomeMessage);
    }
  
    public async logout(): Promise<void> {
      await this.elementActions.clickButtonAsync(this.selectors.userMenu);
      await this.elementActions.clickButtonAsync(this.selectors.logoutButton);
      await this.waitActions.waitForUrl(/\/login/);
    }
  
    public async search(query: string): Promise<void> {
      await this.elementActions.fillTextFieldAsync(this.selectors.searchField, query);
      await this.elementActions.pressKeyAsync(this.selectors.searchField, 'Enter');
    }
  
    public async getNotificationCount(): Promise<number> {
      const text = await this.elementActions.getTextAsync(this.selectors.notificationBadge);
      return parseInt(text) || 0;
    }
}