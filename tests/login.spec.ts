
import { test, expect } from '../src/core/base/BaseTest';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';

test.describe('Login Tests', () => {
  test('Successful login with valid credentials', async ({ webDriver }) => {
    
    const loginPage = new LoginPage(webDriver.getPage());
    const dashboardPage = new DashboardPage(webDriver.getPage());

    // Navigate to login page
    await loginPage.navigate();
    expect(await loginPage.isDisplayed()).toBeTruthy();

    // Perform login
    await loginPage.login('testuser', 'password123');

    // Verify dashboard is displayed
    expect(await dashboardPage.isDisplayed()).toBeTruthy();
    const welcomeMsg = await dashboardPage.getWelcomeMessage();
    expect(welcomeMsg).toContain('Welcome');
  });

  test('Login with invalid credentials shows error', async ({ webDriver }) => {
    const loginPage = new LoginPage(webDriver.getPage());

    await loginPage.navigate();
    await loginPage.login('invaliduser', 'wrongpassword');

    // Verify error message
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Invalid credentials');
  });

  test('Remember me checkbox functionality', async ({ webDriver }) => {
    const loginPage = new LoginPage(webDriver.getPage());

    await loginPage.navigate();
    await loginPage.checkRememberMe();
    
    const isChecked = await webDriver.elementActions.isCheckboxCheckedAsync('#remember-me');
    expect(isChecked).toBeTruthy();
  });
});





