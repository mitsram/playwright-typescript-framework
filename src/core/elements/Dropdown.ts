import { Page } from '@playwright/test';
import { BaseElement } from './BaseElement';
import { IElementOptions } from '../../types/IElementOptions';
import { ElementSelector } from '../../types/IDriverContext';

export class Dropdown extends BaseElement {
    constructor(page: Page, selector: ElementSelector) {
      super(page, selector);
    }
  
    public async selectByValue(value: string, options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.waitForEnabled(options.timeout);
          await this.getLocator().selectOption({ value });
        },
        `select option by value '${value}'`,
        { waitForVisible: true, scrollIntoView: true, ...options }
      );
    }
  
    public async selectByLabel(label: string, options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.waitForEnabled(options.timeout);
          await this.getLocator().selectOption({ label });
        },
        `select option by label '${label}'`,
        { waitForVisible: true, scrollIntoView: true, ...options }
      );
    }
  
    public async selectByIndex(index: number, options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.waitForEnabled(options.timeout);
          await this.getLocator().selectOption({ index });
        },
        `select option by index ${index}`,
        { waitForVisible: true, scrollIntoView: true, ...options }
      );
    }
  
    public async getSelectedValue(options: IElementOptions = {}): Promise<string> {
      return this.executeWithRetry(
        async () => {
          const value = await this.getLocator().inputValue();
          return value;
        },
        'get selected value',
        options
      );
    }
  
    public async getSelectedText(options: IElementOptions = {}): Promise<string> {
      return this.executeWithRetry(
        async () => {
          const selectedOption = this.page.locator(`${this.selector} option:checked`);
          const text = await selectedOption.textContent();
          return text ?? '';
        },
        'get selected text',
        options
      );
    }
  
    public async getAllOptions(options: IElementOptions = {}): Promise<string[]> {
      return this.executeWithRetry(
        async () => {
          const optionElements = this.page.locator(`${this.selector} option`);
          const count = await optionElements.count();
          const options: string[] = [];
          
          for (let i = 0; i < count; i++) {
            const text = await optionElements.nth(i).textContent();
            if (text) options.push(text);
          }
          
          return options;
        },
        'get all options',
        options
      );
    }
}