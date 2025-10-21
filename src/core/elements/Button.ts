import { Page } from '@playwright/test';
import { BaseElement } from './BaseElement';
import { IElementOptions } from '../../types/IElementOptions';
import { ElementSelector } from '../../types/IDriverContext';

export class Button extends BaseElement {
    constructor(page: Page, selector: ElementSelector) {
      super(page, selector);
    }
  
    public async click(options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.waitForEnabled(options.timeout);
          await this.getLocator().click({ force: options.force });
        },
        'click button',
        { waitForVisible: true, scrollIntoView: true, ...options }
      );
    }
  
    public async doubleClick(options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.waitForEnabled(options.timeout);
          await this.getLocator().dblclick({ force: options.force });
        },
        'double click button',
        { waitForVisible: true, scrollIntoView: true, ...options }
      );
    }
  
    public async hover(options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.getLocator().hover({ force: options.force });
        },
        'hover over button',
        { waitForVisible: true, ...options }
      );
    }
  }