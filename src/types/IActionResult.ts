export interface IActionResult {
    success: boolean;
    error?: Error;
    message?: string;
    screenshot?: string;
  }