import { Page } from '@playwright/test';
import { BasePage } from '../core/base/BasePage';

export class UserFormPage extends BasePage {
    protected pageUrl = '/users/new';
  
    private readonly selectors = {
      firstNameField: '#firstName',
      lastNameField: '#lastName',
      emailField: '#email',
      phoneField: '#phone',
      roleDropdown: '#role',
      countryDropdown: '#country',
      statusCheckbox: '#active',
      birthDatePicker: '#birthDate',
      profilePictureUpload: '#profilePicture',
      genderRadioMale: 'input[name="gender"][value="male"]',
      genderRadioFemale: 'input[name="gender"][value="female"]',
      submitButton: '#submit-btn',
      cancelButton: '#cancel-btn'
    };
  
    constructor(page: Page) {
      super(page);
    }
  
    public async isDisplayed(): Promise<boolean> {
      return await this.elementActions.isElementVisibleAsync(this.selectors.firstNameField);
    }
  
    /**
     * Fill complete user form
     */
    public async fillUserForm(userData: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      role: string;
      country: string;
      active?: boolean;
      birthDate?: string;
      gender?: 'male' | 'female';
      profilePicture?: string;
    }): Promise<void> {
      this.logger.info('Filling user form', userData);
  
      // Fill required text fields
      await this.elementActions.fillTextFieldAsync(
        this.selectors.firstNameField,
        userData.firstName
      );
  
      await this.elementActions.fillTextFieldAsync(
        this.selectors.lastNameField,
        userData.lastName
      );
  
      await this.elementActions.fillTextFieldAsync(
        this.selectors.emailField,
        userData.email
      );
  
      // Fill optional phone field
      if (userData.phone) {
        await this.elementActions.fillTextFieldAsync(
          this.selectors.phoneField,
          userData.phone
        );
      }
  
      // Select role from dropdown
      await this.elementActions.selectDropdownByLabelAsync(
        this.selectors.roleDropdown,
        userData.role
      );
  
      // Select country from dropdown
      await this.elementActions.selectDropdownByLabelAsync(
        this.selectors.countryDropdown,
        userData.country
      );
  
      // Set active status
      if (userData.active !== undefined) {
        if (userData.active) {
          await this.elementActions.checkCheckboxAsync(this.selectors.statusCheckbox);
        } else {
          await this.elementActions.uncheckCheckboxAsync(this.selectors.statusCheckbox);
        }
      }
  
      // Select birth date
      if (userData.birthDate) {
        await this.elementActions.selectDateAsync(
          this.selectors.birthDatePicker,
          userData.birthDate
        );
      }
  
      // Select gender
      if (userData.gender === 'male') {
        await this.elementActions.selectRadioButtonAsync(this.selectors.genderRadioMale);
      } else if (userData.gender === 'female') {
        await this.elementActions.selectRadioButtonAsync(this.selectors.genderRadioFemale);
      }
  
      // Upload profile picture
      if (userData.profilePicture) {
        await this.elementActions.uploadFileAsync(
          this.selectors.profilePictureUpload,
          userData.profilePicture
        );
      }
  
      this.logger.info('User form filled successfully');
    }
  
    public async submitForm(): Promise<void> {
      await this.elementActions.clickButtonAsync(this.selectors.submitButton);
      await this.waitActions.waitForLoadState('networkidle');
    }
  
    public async cancelForm(): Promise<void> {
      await this.elementActions.clickButtonAsync(this.selectors.cancelButton);
    }
  
    public async createUser(userData: any): Promise<void> {
      await this.navigate();
      await this.fillUserForm(userData);
      await this.submitForm();
    }
  }