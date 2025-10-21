import { Page, Locator } from '@playwright/test';
import { Logger } from '../../utils/Logger';
import { IElementOptions } from '../../types/IElementOptions';
import { ElementSelector } from '../../types/IDriverContext';
import { ElementException } from '../exceptions/ElementException';
import { TimeoutException } from '../exceptions/TimeoutException';
import { ExceptionHandler } from '../exceptions/ExceptionHandler';
import { ConfigManager } from '../config/ConfigManager';

export abstract class BaseElement {
  protected page: Page;
  protected selector: string;
  protected logger = Logger.getInstance();
  protected configManager = ConfigManager.getInstance();
  protected defaultTimeout: number;

  constructor(page: Page, selector: ElementSelector) {
    this.page = page;
    this.selector = this.normalizeSelector(selector);
    this.defaultTimeout = this.configManager.getTimeout();
  }

  private normalizeSelector(selector: ElementSelector): string {
    if (typeof selector === 'string') {
      return selector;
    }

    if (selector.xpath) {
      return `xpath=${selector.xpath}`;
    }

    if (selector.css) {
      return selector.css;
    }

    if (selector.text) {
      return `text=${selector.text}`;
    }

    throw new ElementException('', 'parse', 'Invalid selector format provided');
  }

  protected getLocator(): Locator {
    return this.page.locator(this.selector);
  }

  protected async executeWithRetry<T>(
    action: () => Promise<T>,
    actionName: string,
    options: IElementOptions = {}
  ): Promise<T> {
    const maxRetries = options.retryOnFailure 
      ? this.configManager.getTestConfig().retryAttempts 
      : 1;
    const stopOnError = options.stopOnError ?? true;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.debug(
          `Executing ${actionName} on '${this.selector}' (attempt ${attempt}/${maxRetries})`
        );

        if (options.waitForVisible) {
          await this.waitForVisible(options.timeout);
        }

        if (options.scrollIntoView) {
          await this.scrollIntoView();
        }

        const result = await action();
        
        this.logger.info(
          `Successfully executed ${actionName} on '${this.selector}'`
        );
        
        return result;
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `Attempt ${attempt}/${maxRetries} failed for ${actionName} on '${this.selector}': ${lastError.message}`
        );

        if (attempt < maxRetries) {
          await this.page.waitForTimeout(1000 * attempt); // Progressive delay
        }
      }
    }

    const elementError = new ElementException(
      this.selector,
      actionName,
      lastError?.message || 'Unknown error',
      { attempts: maxRetries }
    );

    await ExceptionHandler.handle(elementError, this.page, stopOnError);
    throw elementError;
  }

  protected async waitForVisible(timeout?: number): Promise<void> {
    const waitTimeout = timeout ?? this.defaultTimeout;
    
    try {
      await this.getLocator().waitFor({ 
        state: 'visible', 
        timeout: waitTimeout 
      });
    } catch (error) {
      throw new TimeoutException(
        `Element '${this.selector}' not visible within ${waitTimeout}ms`,
        waitTimeout,
        { selector: this.selector }
      );
    }
  }

  protected async waitForEnabled(timeout?: number): Promise<void> {
    const waitTimeout = timeout ?? this.defaultTimeout;
    
    try {
      await this.getLocator().waitFor({ 
        state: 'attached', 
        timeout: waitTimeout 
      });
      
      const isEnabled = await this.getLocator().isEnabled({ timeout: waitTimeout });
      if (!isEnabled) {
        throw new Error('Element is disabled');
      }
    } catch (error) {
      throw new TimeoutException(
        `Element '${this.selector}' not enabled within ${waitTimeout}ms`,
        waitTimeout,
        { selector: this.selector }
      );
    }
  }

  protected async scrollIntoView(): Promise<void> {
    try {
      await this.getLocator().scrollIntoViewIfNeeded();
    } catch (error) {
      this.logger.warn(`Failed to scroll element into view: ${this.selector}`);
    }
  }

  public async isVisible(options: IElementOptions = {}): Promise<boolean> {
    return this.executeWithRetry(
      async () => {
        return await this.getLocator().isVisible();
      },
      'check visibility',
      { ...options, stopOnError: false }
    );
  }

  public async isEnabled(options: IElementOptions = {}): Promise<boolean> {
    return this.executeWithRetry(
      async () => {
        return await this.getLocator().isEnabled();
      },
      'check enabled state',
      { ...options, stopOnError: false }
    );
  }

  public async getText(options: IElementOptions = {}): Promise<string> {
    return this.executeWithRetry(
      async () => {
        const text = await this.getLocator().textContent();
        return text ?? '';
      },
      'get text',
      options
    );
  }

  public async getAttribute(
    attributeName: string,
    options: IElementOptions = {}
  ): Promise<string | null> {
    return this.executeWithRetry(
      async () => {
        return await this.getLocator().getAttribute(attributeName);
      },
      `get attribute '${attributeName}'`,
      options
    );
  }

  public async waitForElementCount(
    expectedCount: number,
    timeout?: number
  ): Promise<void> {
    const waitTimeout = timeout ?? this.defaultTimeout;
    
    try {
      await this.page.waitForFunction(
        ({ selector, count }) => {
          const elements = document.querySelectorAll(selector);
          return elements.length === count;
        },
        { selector: this.selector, count: expectedCount },
        { timeout: waitTimeout }
      );
    } catch (error) {
      throw new TimeoutException(
        `Expected ${expectedCount} elements with selector '${this.selector}'`,
        waitTimeout
      );
    }
  }
}