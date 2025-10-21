import { Logger } from '../../utils/Logger';
import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { FrameworkException } from './FrameworkException';

export class ExceptionHandler {
  private static logger = Logger.getInstance();

  public static async handle(
    error: Error,
    page?: Page,
    stopOnError: boolean = true
  ): Promise<void> {
    const screenshot = page ? await this.captureScreenshot(page) : undefined;

    if (error instanceof FrameworkException) {
      this.logger.error(`Framework Exception: ${error.message}`, error);
      this.logDetailedError(error);
    } else {
      this.logger.error(`Unexpected Error: ${error.message}`, error);
    }

    if (screenshot) {
      this.logger.info(`Screenshot captured: ${screenshot}`);
    }

    if (stopOnError) {
      throw error;
    }
  }

  private static async captureScreenshot(page: Page): Promise<string | undefined> {
    try {
      const screenshotDir = path.resolve(process.cwd(), 'screenshots', 'errors');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(screenshotDir, `error-${timestamp}.png`);
      
      await page.screenshot({ path: screenshotPath, fullPage: true });
      return screenshotPath;
    } catch (screenshotError) {
      this.logger.warn('Failed to capture screenshot', screenshotError as Error);
      return undefined;
    }
  }

  private static logDetailedError(error: FrameworkException): void {
    const errorDetails = {
      name: error.name,
      message: error.message,
      severity: error.severity,
      timestamp: error.timestamp.toISOString(),
      context: error.context,
      screenshot: error.screenshot,
      stackTrace: this.parseStackTrace(error.stack)
    };

    this.logger.error('Detailed Error Information:', new Error(JSON.stringify(errorDetails, null, 2)));
  }

  private static parseStackTrace(stack?: string): Array<{ file: string; line: number; column: number; function: string }> {
    if (!stack) return [];

    const stackLines = stack.split('\n').slice(1);
    return stackLines.map(line => {
      const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        return {
          function: match[1],
          file: match[2],
          line: parseInt(match[3]),
          column: parseInt(match[4])
        };
      }
      return { file: line.trim(), line: 0, column: 0, function: 'unknown' };
    });
  }
}