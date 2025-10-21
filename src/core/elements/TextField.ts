import { Page } from '@playwright/test';
import { BaseElement } from './BaseElement';
import { IElementOptions } from '../../types/IElementOptions';
import { ElementSelector } from '../../types/IDriverContext';

export class TextField extends BaseElement {
  constructor(page: Page, selector: ElementSelector) {
    super(page, selector);
  }

  public async fill(value: string, options: IElementOptions = {}): Promise<void> {
    await this.executeWithRetry(
      async () => {
        await this.waitForEnabled(options.timeout);
        await this.getLocator().fill(value, { force: options.force });
      },
      'fill text field',
      { waitForVisible: true, scrollIntoView: true, ...options }
    );
  }

  public async clear(options: IElementOptions = {}): Promise<void> {
    await this.executeWithRetry(
      async () => {
        await this.waitForEnabled(options.timeout);
        await this.getLocator().clear({ force: options.force });
      },
      'clear text field',
      { waitForVisible: true, ...options }
    );
  }

  public async type(text: string, delay: number = 50, options: IElementOptions = {}): Promise<void> {
    await this.executeWithRetry(
      async () => {
        await this.waitForEnabled(options.timeout);
        await this.getLocator().type(text, { delay });
      },
      'type into text field',
      { waitForVisible: true, scrollIntoView: true, ...options }
    );
  }

  public async getValue(options: IElementOptions = {}): Promise<string> {
    return this.executeWithRetry(
      async () => {
        const value = await this.getLocator().inputValue();
        return value;
      },
      'get text field value',
      options
    );
  }

  public async pressKey(key: string, options: IElementOptions = {}): Promise<void> {
    await this.executeWithRetry(
      async () => {
        await this.getLocator().press(key);
      },
      `press key '${key}'`,
      options
    );
  }
}