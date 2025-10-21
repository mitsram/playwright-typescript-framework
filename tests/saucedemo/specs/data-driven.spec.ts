import { test, expect } from '../../../src/core/base/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

import * as fs from 'fs';

interface TestUser {
  username: string;
  password: string;
  expectedResult: 'success' | 'failure';
  errorMessage?: string;
}

test.describe('SauceDemo ata-Driven Login Tests', () => {
  
  // Load test data from JSON file
  const testData: TestUser[] = JSON.parse(
    fs.readFileSync('./tests/saucedemo/data/login-testdata.json', 'utf-8')
  );

  testData.forEach((data, index) => {
    test(`Login test for ${data.username} - Case ${index + 1}`, async ({ webDriver }) => {
      const loginPage = new LoginPage(webDriver.getPage());
      const dashboardPage = new HomePage(webDriver.getPage());

      await loginPage.navigate();
      await loginPage.login(data.username, data.password);

      if (data.expectedResult === 'success') {
        const isDisplayed = await dashboardPage.isDisplayed();
        expect(isDisplayed).toBeTruthy();        
      } else {
        const isErrorDisplayed = await loginPage.isErrorDisplayed();        
        expect(isErrorDisplayed).toBeTruthy();        
        if (data.errorMessage) {
          const error = await loginPage.getErrorMessage();
          expect(error).toContain(data.errorMessage);
        }
      }
    });
  });
});