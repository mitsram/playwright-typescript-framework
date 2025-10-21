import { Page } from '@playwright/test';
import { TextField } from '../elements/TextField';
import { Button } from '../elements/Button';
import { Checkbox } from '../elements/Checkbox';
import { Dropdown } from '../elements/Dropdown';
import { RadioButton } from '../elements/RadioButton';
import { DatePicker } from '../elements/DatePicker';
import { FileUpload } from '../elements/FileUpload';
import { ElementSelector } from '../../types/IDriverContext';
import { IElementOptions } from '../../types/IElementOptions';
import { Logger } from '../../utils/Logger';

export class ElementActions {
  private page: Page;
  private logger = Logger.getInstance();

  constructor(page: Page) {
    this.page = page;
  }

  // Text Field Actions
  public async fillTextFieldAsync(selector: ElementSelector, value: string, options: IElementOptions = {}): Promise<void> {
    const textField = new TextField(this.page, selector);
    await textField.fill(value, options);
  }

  public async clearTextFieldAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<void> {
    const textField = new TextField(this.page, selector);
    await textField.clear(options);
  }

  public async typeTextAsync(selector: ElementSelector, text: string, delay: number = 50, options: IElementOptions = {}): Promise<void> {
    const textField = new TextField(this.page, selector);
    await textField.type(text, delay, options);
  }

  public async getTextFieldValueAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<string> {
    const textField = new TextField(this.page, selector);
    return await textField.getValue(options);
  }

  // Button Actions
  public async clickButtonAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<void> {
    const button = new Button(this.page, selector);
    await button.click(options);
  }

  public async doubleClickButtonAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<void> {
    const button = new Button(this.page, selector);
    await button.doubleClick(options);
  }

  public async hoverButtonAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<void> {
    const button = new Button(this.page, selector);
    await button.hover(options);
  }

  // Checkbox Actions
  public async checkCheckboxAsync(selector: ElementSelector,  options: IElementOptions = {}): Promise<void> {
    const checkbox = new Checkbox(this.page, selector);
    await checkbox.check(options);
  }

  public async uncheckCheckboxAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<void> {
    const checkbox = new Checkbox(this.page, selector);
    await checkbox.uncheck(options);
  }

  public async toggleCheckboxAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<void> {
    const checkbox = new Checkbox(this.page, selector);
    await checkbox.toggle(options);
  }

  public async isCheckboxCheckedAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<boolean> {
    const checkbox = new Checkbox(this.page, selector);
    return await checkbox.isChecked(options);
  }

  // Dropdown Actions
  public async selectDropdownByValueAsync(selector: ElementSelector, value: string, options: IElementOptions = {}): Promise<void> {
    const dropdown = new Dropdown(this.page, selector);
    await dropdown.selectByValue(value, options);
  }

  public async selectDropdownByLabelAsync(selector: ElementSelector, label: string, options: IElementOptions = {}): Promise<void> {
    const dropdown = new Dropdown(this.page, selector);
    await dropdown.selectByLabel(label, options);
  }

  public async selectDropdownByIndexAsync(selector: ElementSelector, index: number, options: IElementOptions = {}): Promise<void> {
    const dropdown = new Dropdown(this.page, selector);
    await dropdown.selectByIndex(index, options);
  }

  public async getSelectedDropdownValueAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<string> {
    const dropdown = new Dropdown(this.page, selector);
    return await dropdown.getSelectedValue(options);
  }

  public async getAllDropdownOptionsAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<string[]> {
    const dropdown = new Dropdown(this.page, selector);
    return await dropdown.getAllOptions(options);
  }

  // Radio Button Actions
  public async selectRadioButtonAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<void> {
    const radioButton = new RadioButton(this.page, selector);
    await radioButton.select(options);
  }

  public async isRadioButtonSelectedAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<boolean> {
    const radioButton = new RadioButton(this.page, selector);
    return await radioButton.isSelected(options);
  }

  // Date Picker Actions
  public async selectDateAsync(selector: ElementSelector, date: string, options: IElementOptions = {}): Promise<void> {
    const datePicker = new DatePicker(this.page, selector);
    await datePicker.selectDate(date, options);
  }

  public async getSelectedDateAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<string> {
    const datePicker = new DatePicker(this.page, selector);
    return await datePicker.getSelectedDate(options);
  }

  // File Upload Actions
  public async uploadFileAsync(selector: ElementSelector, filePath: string | string[], options: IElementOptions = {}): Promise<void> {
    const fileUpload = new FileUpload(this.page, selector);
    await fileUpload.uploadFile(filePath, options);
  }

  public async clearUploadedFilesAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<void> {
    const fileUpload = new FileUpload(this.page, selector);
    await fileUpload.clearFiles(options);
  }

  // Generic Element Actions
  public async getTextAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<string> {
    const button = new Button(this.page, selector); // Using Button as base for generic operations
    return await button.getText(options);
  }

  public async getAttributeAsync(selector: ElementSelector, attributeName: string, options: IElementOptions = {}): Promise<string | null> {
    const button = new Button(this.page, selector);
    return await button.getAttribute(attributeName, options);
  }

  public async isElementVisibleAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<boolean> {
    const button = new Button(this.page, selector);
    return await button.isVisible(options);
  }

  public async isElementEnabledAsync(selector: ElementSelector, options: IElementOptions = {}): Promise<boolean> {
    const button = new Button(this.page, selector);
    return await button.isEnabled(options);
  }

  public async waitForElementCountAsync(selector: ElementSelector, expectedCount: number, timeout?: number): Promise<void> {
    const button = new Button(this.page, selector);
    await button.waitForElementCount(expectedCount, timeout);
  }

  // Keyboard Actions
  public async pressKeyAsync(selector: ElementSelector, key: string, options: IElementOptions = {}): Promise<void> {
    const element = this.page.locator(selector.toString());
    await element.press(key, { timeout: options.timeout });
  }
}
