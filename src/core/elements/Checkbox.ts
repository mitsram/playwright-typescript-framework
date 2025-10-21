import { Page } from '@playwright/test';
import { BaseElement } from './BaseElement';
import { IElementOptions } from '../../types/IElementOptions';
import { ElementSelector } from '../../types/IDriverContext';

export class Checkbox extends BaseElement {
    constructor(page: Page, selector: ElementSelector) {
      super(page, selector);
    }
  
    public async check(options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.waitForEnabled(options.timeout);
          await this.getLocator().check({ force: options.force });
        },
        'check checkbox',
        { waitForVisible: true, scrollIntoView: true, ...options }
      );
    }
  
    public async uncheck(options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.waitForEnabled(options.timeout);
          await this.getLocator().uncheck({ force: options.force });
        },
        'uncheck checkbox',
        { waitForVisible: true, scrollIntoView: true, ...options }
      );
    }
  
    public async isChecked(options: IElementOptions = {}): Promise<boolean> {
      return this.executeWithRetry(
        async () => {
          return await this.getLocator().isChecked();
        },
        'check if checkbox is checked',
        options
      );
    }
  
    public async toggle(options: IElementOptions = {}): Promise<void> {
      const isChecked = await this.isChecked(options);
      if (isChecked) {
        await this.uncheck(options);
      } else {
        await this.check(options);
      }
    }
}
  