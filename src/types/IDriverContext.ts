import { Page, BrowserContext, Browser, APIRequestContext } from '@playwright/test';

export type ElementSelector = string | { css?: string; xpath?: string; text?: string };

export interface IDriverContext {
    page: Page;
    context: BrowserContext;
    browser: Browser;
    apiContext: APIRequestContext;
  }