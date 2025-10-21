import { test, expect } from '../src/core/base/BaseTest';
import { UserFormPage } from '../src/pages/UserFormPage';

test.describe('User Form Tests', () => {
  test('Create new user with all fields', async ({ webDriver }) => {
    const userFormPage = new UserFormPage(webDriver.getPage());

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      role: 'Administrator',
      country: 'United States',
      active: true,
      birthDate: '1990-01-15',
      gender: 'male' as const,
      profilePicture: './testdata/profile.jpg'
    };

    await userFormPage.navigate();
    await userFormPage.fillUserForm(userData);
    await userFormPage.submitForm();

    // Verify success (implementation depends on your app)
    await webDriver.waitActions.waitForUrl(/\/users\/\d+/);
    expect(webDriver.navigationActions.getCurrentUrl()).toContain('/users/');
  });

  test('Form validation for required fields', async ({ webDriver }) => {
    const userFormPage = new UserFormPage(webDriver.getPage());

    await userFormPage.navigate();
    await userFormPage.submitForm();

    // Verify validation errors appear
    const firstNameError = await webDriver.elementActions.isElementVisibleAsync(
      '#firstName-error',
      { stopOnError: false }
    );
    expect(firstNameError).toBeTruthy();
  });
});