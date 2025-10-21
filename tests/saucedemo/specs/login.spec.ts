
import { test, expect } from '../../../src/core/base/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

test.describe('Login Tests', () => {

  test('Successful login with valid credentials', async ({ webDriver }) => {
    
    const loginPage = new LoginPage(webDriver.getPage());
    const dashboardPage = new HomePage(webDriver.getPage());

    // Navigate to login page
    await loginPage.navigate();
    expect(await loginPage.isDisplayed()).toBeTruthy();

    // Perform login
    await loginPage.login('standard_user', 'secret_sauce');

    // Verify dashboard is displayed
    expect(await dashboardPage.isDisplayed()).toBeTruthy();
    const welcomeMsg = await dashboardPage.getWelcomeMessage();
    expect(welcomeMsg).toContain('Swag Labs');
  });

  test('Login with invalid credentials shows error', async ({ webDriver }) => {
    const loginPage = new LoginPage(webDriver.getPage());

    await loginPage.navigate();
    await loginPage.login('standard_user', 'wrongpassword');

    // Verify error message
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Epic sadface: Username and password do not match any user in this service');
  });  
});





