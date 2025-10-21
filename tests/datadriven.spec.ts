import { test, expect } from '../src/core/base/BaseTest';
import { LoginPage } from '../src/pages/LoginPage';
import { DashboardPage } from '../src/pages/DashboardPage';

import * as fs from 'fs';

interface TestUser {
  username: string;
  password: string;
  expectedResult: 'success' | 'failure';
  errorMessage?: string;
}

test.describe('Data-Driven Login Tests', () => {
  // Load test data from JSON file
  const testData: TestUser[] = JSON.parse(
    fs.readFileSync('./testdata/login-testdata.json', 'utf-8')
  );

  testData.forEach((data) => {
    test(`Login test for ${data.username}`, async ({ webDriver }) => {
      const loginPage = new LoginPage(webDriver.getPage());
      const dashboardPage = new DashboardPage(webDriver.getPage());

      await loginPage.navigate();
      await loginPage.login(data.username, data.password);

      if (data.expectedResult === 'success') {
        expect(await dashboardPage.isDisplayed()).toBeTruthy();
      } else {
        expect(await loginPage.isErrorDisplayed()).toBeTruthy();
        if (data.errorMessage) {
          const error = await loginPage.getErrorMessage();
          expect(error).toContain(data.errorMessage);
        }
      }
    });
  });
});