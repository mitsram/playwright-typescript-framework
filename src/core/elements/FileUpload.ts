import { Page } from '@playwright/test';
import { BaseElement } from './BaseElement';
import { IElementOptions } from '../../types/IElementOptions';
import { ElementSelector } from '../../types/IDriverContext';

export class FileUpload extends BaseElement {
    constructor(page: Page, selector: ElementSelector) {
      super(page, selector);
    }
  
    public async uploadFile(filePath: string | string[], options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.getLocator().setInputFiles(filePath);
        },
        'upload file',
        { waitForVisible: true, ...options }
      );
    }
  
    public async clearFiles(options: IElementOptions = {}): Promise<void> {
      await this.executeWithRetry(
        async () => {
          await this.getLocator().setInputFiles([]);
        },
        'clear uploaded files',
        options
      );
    }
}