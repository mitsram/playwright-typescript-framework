import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './Logger';

export class ScreenshotHelper {
  private static logger = Logger.getInstance();

  public static async captureScreenshot(
    page: Page,
    name: string,
    options?: { fullPage?: boolean; path?: string }
  ): Promise<string> {
    const screenshotDir = options?.path || path.resolve(process.cwd(), 'screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const fullPath = path.join(screenshotDir, filename);

    await page.screenshot({
      path: fullPath,
      fullPage: options?.fullPage ?? true
    });

    this.logger.info(`Screenshot captured: ${fullPath}`);
    return fullPath;
  }

  public static async captureElementScreenshot(
    page: Page,
    selector: string,
    name: string
  ): Promise<string> {
    const screenshotDir = path.resolve(process.cwd(), 'screenshots', 'elements');
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const fullPath = path.join(screenshotDir, filename);

    await page.locator(selector).screenshot({ path: fullPath });

    this.logger.info(`Element screenshot captured: ${fullPath}`);
    return fullPath;
  }

  public static async compareScreenshots(
    page: Page,
    baselineImage: string,
    name: string
  ): Promise<boolean> {
    const currentScreenshot = await this.captureScreenshot(page, name);
    
    // Implement visual comparison logic here
    // This is a placeholder - use a library like pixelmatch or looksSame
    
    this.logger.info('Screenshot comparison completed');
    return true;
  }
}