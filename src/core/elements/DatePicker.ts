import { Page } from '@playwright/test';
import { BaseElement } from './BaseElement';
import { IElementOptions } from '../../types/IElementOptions';
import { ElementSelector } from '../../types/IDriverContext';

export class DatePicker extends BaseElement {
    constructor(page: Page, selector: ElementSelector) {
      super(page, selector);
    }
  
    public async selectDate(date: string, options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.waitForEnabled(options.timeout);
          await this.getLocator().fill(date);
        },
        'select date',
        { waitForVisible: true, scrollIntoView: true, ...options }
      );
    }
  
    public async getSelectedDate(options: IElementOptions = {}): Promise<string> {
      return this.executeWithRetry(
        async () => {
          return await this.getLocator().inputValue();
        },
        'get selected date',
        options
      );
    }
}