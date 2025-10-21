// Core Browser
export { BrowserFactory } from './core/browser/BrowserFactory';
export { BrowserManager } from './core/browser/BrowserManager';

// Configuration
export { ConfigManager } from './core/config/ConfigManager';

// Drivers
export { WebDriver } from './core/driver/WebDriver';
export { ApiDriver } from './core/driver/ApiDriver';

// Elements
export { BaseElement } from './core/elements/BaseElement';
export { TextField } from './core/elements/TextField';
export { Button } from './core/elements/Button';
export { Checkbox } from './core/elements/Checkbox';
export { Dropdown } from './core/elements/Dropdown';
export { RadioButton } from './core/elements/RadioButton';
export { DatePicker } from './core/elements/DatePicker';
export { FileUpload } from './core/elements/FileUpload';

// Actions
export { ElementActions } from './core/actions/ElementActions';
export { WaitActions } from './core/actions/WaitActions';
export { NavigationActions } from './core/actions/NavigationActions';

// Base Classes
export { BasePage } from './core/base/BasePage';
export { BaseTest, test, expect } from './core/base/BaseTest';

// Exceptions
export { 
  FrameworkException, 
  ElementException, 
  TimeoutException, 
  ApiException 
} from './core/exceptions/FrameworkException';
export { ExceptionHandler } from './core/exceptions/ExceptionHandler';

// Utils
export { Logger } from './utils/Logger';

// Types
export * from './types';

// Version
export const VERSION = '1.0.0';