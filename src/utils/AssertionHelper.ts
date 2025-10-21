// src/utils/AssertionHelper.ts

export class AssertionHelper {
    /**
     * Assert element text contains value
     */
    public static assertTextContains(actual: string, expected: string, message?: string): void {
      if (!actual.includes(expected)) {
        throw new Error(message || `Expected "${actual}" to contain "${expected}"`);
      }
    }
  
    /**
     * Assert element is visible with retry
     */
    public static async assertElementVisible(
      isVisible: () => Promise<boolean>,
      timeout: number = 5000,
      message?: string
    ): Promise<void> {
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        if (await isVisible()) {
          return;
        }
        await DataHelper.wait(500);
      }
      
      throw new Error(message || 'Element is not visible within timeout');
    }
  
    /**
     * Assert array contains element
     */
    public static assertArrayContains<T>(array: T[], element: T, message?: string): void {
      if (!array.includes(element)) {
        throw new Error(message || `Array does not contain element: ${element}`);
      }
    }
  
    /**
     * Assert object properties
     */
    public static assertObjectHasProperties(obj: any, properties: string[], message?: string): void {
      const missingProps = properties.filter(prop => !(prop in obj));
      
      if (missingProps.length > 0) {
        throw new Error(message || `Object missing properties: ${missingProps.join(', ')}`);
      }
    }
  }