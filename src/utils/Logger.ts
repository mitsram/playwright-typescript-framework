import { LogLevel } from '../types/LogLevel';
import { ILogger } from '../types/ILogger';
import * as fs from 'fs';
import * as path from 'path';

export class Logger implements ILogger {
  private static instance: Logger;
  private logFilePath: string;
  private enableConsole: boolean = true;

  private constructor() {
    const logsDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFilePath = path.join(logsDir, `test-${timestamp}.log`);
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const stackTrace = new Error().stack?.split('\n')[3]?.trim() || '';
    const caller = stackTrace.replace(/^at\s+/, '');
    
    let formattedMessage = `[${timestamp}] [${level}] [${caller}] - ${message}`;
    
    if (args.length > 0) {
      formattedMessage += ' ' + JSON.stringify(args, null, 2);
    }
    
    return formattedMessage;
  }

  private writeLog(message: string): void {
    fs.appendFileSync(this.logFilePath, message + '\n', 'utf-8');
    if (this.enableConsole) {
      console.log(message);
    }
  }

  public debug(message: string, ...args: any[]): void {
    const formatted = this.formatMessage(LogLevel.DEBUG, message, ...args);
    this.writeLog(formatted);
  }

  public info(message: string, ...args: any[]): void {
    const formatted = this.formatMessage(LogLevel.INFO, message, ...args);
    this.writeLog(formatted);
  }

  public warn(message: string, ...args: any[]): void {
    const formatted = this.formatMessage(LogLevel.WARN, message, ...args);
    this.writeLog(formatted);
  }

  public error(message: string, error?: Error): void {
    let formatted = this.formatMessage(LogLevel.ERROR, message);
    if (error) {
      formatted += `\nError: ${error.message}\nStack: ${error.stack}`;
    }
    this.writeLog(formatted);
  }

  public fatal(message: string, error?: Error): void {
    let formatted = this.formatMessage(LogLevel.FATAL, message);
    if (error) {
      formatted += `\nError: ${error.message}\nStack: ${error.stack}`;
    }
    this.writeLog(formatted);
  }

  public setConsoleOutput(enabled: boolean): void {
    this.enableConsole = enabled;
  }
}