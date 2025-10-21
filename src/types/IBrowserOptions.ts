export interface IBrowserOptions {
    headless?: boolean;
    slowMo?: number;
    viewport?: { width: number; height: number };
    recordVideo?: boolean;
    trace?: boolean;
  }