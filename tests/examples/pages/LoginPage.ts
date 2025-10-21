
import { Page } from '@playwright/test';
import { BasePage } from '../../../src/core/base/BasePage';
import { IElementOptions } from '../../../src/types/IElementOptions';

export class LoginPage extends BasePage {
  protected pageUrl = '/login';

  // Page Element Selectors
  private readonly selectors = {
    usernameField: '#user-name',
    passwordField: '#password',
    loginButton: '#login-button',
    errorMessage: '.error-message-container error',    
    pageTitle: 'h1.login-title'
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Check if login page is displayed
   */
  public async isDisplayed(): Promise<boolean> {
    try {
      await this.waitForElement(this.selectors.pageTitle);
      return await this.elementActions.isElementVisibleAsync(this.selectors.loginButton);
    } catch (error) {
      return false;
    }
  }

  /**
   * Perform login action
   */
  public async login(username: string, password: string, options?: IElementOptions): Promise<void> {

    this.logger.info(`Attempting login with username: ${username}`);    
    
    await this.elementActions.fillTextFieldAsync(this.selectors.usernameField, username, { retryOnFailure: true, ...options });    
    await this.elementActions.fillTextFieldAsync(this.selectors.passwordField, password, { retryOnFailure: true, ...options });    
    await this.elementActions.clickButtonAsync(this.selectors.loginButton, { retryOnFailure: true, ...options });

    // Wait for navigation
    await this.waitActions.waitForLoadState('networkidle');
    
    this.logger.info('Login action completed');
  }

  /**
   * Quick login helper method
   */
  public async quickLogin(username: string, password: string): Promise<void> {
    await this.navigate();
    await this.login(username, password);
  }
  

  /**
   * Get error message
   */
  public async getErrorMessage(): Promise<string> {
    return await this.elementActions.getTextAsync(this.selectors.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  public async isErrorDisplayed(): Promise<boolean> {
    return await this.elementActions.isElementVisibleAsync(this.selectors.errorMessage, { stopOnError: false });
  }  

  /**
   * Clear login form
   */
  public async clearForm(): Promise<void> {
    await this.elementActions.clearTextFieldAsync(this.selectors.usernameField);
    await this.elementActions.clearTextFieldAsync(this.selectors.passwordField);
  }
}