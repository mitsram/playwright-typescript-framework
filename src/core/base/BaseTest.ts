import { test as base, TestInfo } from '@playwright/test';
import { WebDriver } from '../driver/WebDriver';
import { ApiDriver } from '../driver/ApiDriver';
import { Logger } from '../../utils/Logger';
import { ConfigManager } from '../config/ConfigManager';
import * as path from 'path';

export interface TestFixtures {
  webDriver: WebDriver;
  apiDriver: ApiDriver;
}

export const test = base.extend<TestFixtures>({
  webDriver: async ({}, use, testInfo) => {
    const webDriver = new WebDriver();
    const logger = Logger.getInstance();
    const config = ConfigManager.getInstance();

    try {
      logger.info(`Starting test: ${testInfo.title}`);
      await webDriver.initialize(config.getBrowserType());
      await use(webDriver);
    } catch (error) {
      logger.error(`Test failed: ${testInfo.title}`, error as Error);
      throw error;
    } finally {
      // Capture screenshot on failure
      if (testInfo.status === 'failed' && config.getTestConfig().screenshotOnFailure) {
        const screenshotPath = path.join(
          'screenshots',
          'failures',
          `${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`
        );
        await webDriver.takeScreenshot(screenshotPath);
        logger.info(`Failure screenshot saved: ${screenshotPath}`);
      }

      await webDriver.cleanup();
      logger.info(`Test completed: ${testInfo.title} - Status: ${testInfo.status}`);
    }
  },

  apiDriver: async ({}, use) => {
    const apiDriver = new ApiDriver();
    const logger = Logger.getInstance();

    try {
      logger.info('Initializing API driver');
      await apiDriver.initialize();
      await use(apiDriver);
    } finally {
      await apiDriver.dispose();
      logger.info('API driver disposed');
    }
  }
});

export { expect } from '@playwright/test';

/**
 * Abstract Base Test Class
 * Extend this class for test suites
 */
export abstract class BaseTest {
  protected logger = Logger.getInstance();
  protected config = ConfigManager.getInstance();

  /**
   * Setup method to run before each test
   * Override in derived classes for custom setup
   */
  protected async setup(): Promise<void> {
    this.logger.info('Test setup started');
  }

  /**
   * Teardown method to run after each test
   * Override in derived classes for custom teardown
   */
  protected async teardown(): Promise<void> {
    this.logger.info('Test teardown completed');
  }

  /**
   * Create test data
   * Override in derived classes for test-specific data
   */
  protected createTestData(): any {
    return {};
  }

  /**
   * Cleanup test data
   * Override in derived classes for cleanup logic
   */
  protected async cleanupTestData(): Promise<void> {
    this.logger.debug('Cleaning up test data');
  }
}