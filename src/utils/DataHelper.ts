// src/utils/DataHelper.ts

export class DataHelper {
    /**
     * Generate random string
     */
    public static generateRandomString(length: number = 10): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  
    /**
     * Generate random email
     */
    public static generateRandomEmail(domain: string = 'example.com'): string {
      const username = this.generateRandomString(10).toLowerCase();
      return `${username}@${domain}`;
    }
  
    /**
     * Generate random number
     */
    public static generateRandomNumber(min: number = 0, max: number = 1000): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    /**
     * Generate random date
     */
    public static generateRandomDate(start: Date = new Date(2000, 0, 1), end: Date = new Date()): Date {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
  
    /**
     * Format date to string
     */
    public static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
  
      return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day);
    }
  
    /**
     * Deep clone object
     */
    public static deepClone<T>(obj: T): T {
      return JSON.parse(JSON.stringify(obj));
    }
  
    /**
     * Wait for specified time
     */
    public static async wait(milliseconds: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
  
    /**
     * Retry function with exponential backoff
     */
    public static async retryWithBackoff<T>(
      fn: () => Promise<T>,
      maxRetries: number = 3,
      initialDelay: number = 1000
    ): Promise<T> {
      let lastError: Error;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error as Error;
          if (attempt < maxRetries - 1) {
            const delay = initialDelay * Math.pow(2, attempt);
            await this.wait(delay);
          }
        }
      }
      
      throw lastError!;
    }
  
    /**
     * Load JSON data from file
     */
    public static loadJsonData<T>(filePath: string): T {
      const fs = require('fs');
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  
    /**
     * Save JSON data to file
     */
    public static saveJsonData(filePath: string, data: any): void {
      const fs = require('fs');
      const path = require('path');
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
  }