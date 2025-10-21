# Playwright Typescript Framework
Enterprise-grade Test Automation Framework using TypeScript and Playwright for Web and API testing.


## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone git@github.com:mitsram/playwright-typescript-framework.git
cd playwright-typescript-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Build the framework
npm run build
```

## Configuration

### Environment Configuration

Create configuration files in the `config/` directory:

- `test.config.json` - Test environment
- `dev.config.json` - Development environment
- `prod.config.json` - Production environment

### Configuration Structure

```json
{
  "testConfig": {
    "baseUrl": "http://localhost:3000",
    "apiBaseUrl": "http://localhost:3000/api",
    "timeout": 30000,
    "retryAttempts": 2,
    "browserType": "chromium",
    "headless": false,
    "screenshotOnFailure": true
  },
  "environment": {
    "name": "test",
    "url": "http://localhost:3000",
    "apiUrl": "http://localhost:3000/api"
  }
}
```

## Usage Examples

### 1. Web Testing

#### Creating a Page Object

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '../src/core/base/BasePage';

export class LoginPage extends BasePage {
  protected pageUrl = '/login';

  private readonly selectors = {
    usernameField: '#username',
    passwordField: '#password',
    loginButton: '#login-btn'
  };

  constructor(page: Page) {
    super(page);
  }

  public async isDisplayed(): Promise<boolean> {
    return await this.elementActions.isElementVisibleAsync(
      this.selectors.loginButton
    );
  }

  public async login(username: string, password: string): Promise<void> {
    // Using the pattern: fillTextFieldAsync(selector, value)
    await this.elementActions.fillTextFieldAsync(
      this.selectors.usernameField,
      username
    );

    await this.elementActions.fillTextFieldAsync(
      this.selectors.passwordField,
      password
    );

    await this.elementActions.clickButtonAsync(
      this.selectors.loginButton
    );
  }
}
```

#### Writing a Test

```typescript
import { test, expect } from '../src/core/base/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
  test('Successful login', async ({ webDriver }) => {
    const loginPage = new LoginPage(webDriver.getPage());

    await loginPage.navigate();
    await loginPage.login('testuser', 'password123');

    expect(webDriver.navigationActions.getCurrentUrl()).toContain('/dashboard');
  });
});
```

### 2. API Testing

```typescript
test.describe('User API Tests', () => {
  test('Create user via API', async ({ apiDriver }) => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };

    const response = await apiDriver.post('/users', newUser);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });

  test('Get user with authentication', async ({ apiDriver }) => {
    // Set auth token
    apiDriver.setAuthToken('your-token-here');

    const response = await apiDriver.get('/users/me');
    expect(response.status).toBe(200);
  });
});
```

### 3. Combined Web + API Testing

```typescript
test('Create user via API and verify in UI', async ({ webDriver, apiDriver }) => {
  // Create user via API
  const apiResponse = await apiDriver.post('/users', {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  });

  const userId = apiResponse.data.id;

  // Verify in UI
  const loginPage = new LoginPage(webDriver.getPage());
  await loginPage.quickLogin('admin', 'admin123');

  await webDriver.navigationActions.navigateToUrl(`/users/${userId}`);
  
  const userName = await webDriver.elementActions.getTextAsync('.user-name');
  expect(userName).toBe('Test User');
});
```

## Element Actions
The framework provides a comprehensive set of element actions:

### Text Field Actions
```typescript
await elementActions.fillTextFieldAsync('#NAME_ROW', 'John Doe');
await elementActions.clearTextFieldAsync('#NAME_ROW');
await elementActions.typeTextAsync('#NAME_ROW', 'John Doe', 50);
const value = await elementActions.getTextFieldValueAsync('#NAME_ROW');
```

### Button Actions

```typescript
await elementActions.clickButtonAsync('#submit-btn');
await elementActions.doubleClickButtonAsync('#submit-btn');
await elementActions.hoverButtonAsync('#submit-btn');
```

### Checkbox Actions

```typescript
await elementActions.checkCheckboxAsync('#agree-terms');
await elementActions.uncheckCheckboxAsync('#agree-terms');
await elementActions.toggleCheckboxAsync('#agree-terms');
const isChecked = await elementActions.isCheckboxCheckedAsync('#agree-terms');
```

### Dropdown Actions

```typescript
await elementActions.selectDropdownByValueAsync('#country', 'US');
await elementActions.selectDropdownByLabelAsync('#country', 'United States');
await elementActions.selectDropdownByIndexAsync('#country', 0);
const selected = await elementActions.getSelectedDropdownValueAsync('#country');
```

### Advanced Options

All element actions support advanced options:

```typescript
await elementActions.fillTextFieldAsync('#NAME_ROW', 'John Doe', {
  timeout: 10000,              // Custom timeout
  waitForVisible: true,        // Wait for element to be visible
  scrollIntoView: true,        // Scroll element into view
  force: false,                // Force action even if element is not actionable
  retryOnFailure: true,        // Retry on failure
  stopOnError: true            // Stop execution on error
});
```

## Running Tests

```bash
# Run all tests in test environment
npm test

# Run tests in different environment
npm run test:dev
npm run test:prod

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI
npm run test:ui

# View test report
npm run test:report

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Reporting

The framework generates multiple report formats:

- **HTML Report**: `test-results/html-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`

## Error Handling

The framework provides detailed error information:

```typescript
// Example error output:
[2024-01-15T10:30:45.123Z] [ERROR] [LoginPage.login:25] - Element Exception: Failed to fill text field on element '#username'. Element not found
Error Context:
{
  "selector": "#username",
  "action": "fill",
  "attempts": 2,
  "severity": "HIGH",
  "screenshot": "screenshots/errors/error-2024-01-15T10-30-45.png"
}
Stack Trace:
  at LoginPage.login (pages/LoginPage.ts:25:10)
  at Test.testFunction (tests/login.spec.ts:15:20)
```

## Best Practices

1. **Page Objects**: Keep page objects focused and single-responsibility
2. **Test Data**: Store test data in separate files under `testdata/`
3. **Selectors**: Use data-testid attributes for more stable selectors
4. **Wait Strategies**: Prefer explicit waits over arbitrary timeouts
5. **Error Handling**: Let the framework handle retries and errors
6. **Logging**: Use the built-in logger for consistent logging
7. **Cleanup**: Always cleanup test data in API tests

## Advanced Features

### Custom Element Options

```typescript
const options: IElementOptions = {
  timeout: 15000,
  retryOnFailure: true,
  stopOnError: false
};

await elementActions.fillTextFieldAsync('#field', 'value', options);
```

### Screenshot Helper

```typescript
await webDriver.takeScreenshot('custom-screenshot.png');
await page.takeScreenshot('page-screenshot');
```

### Custom Wait Strategies

```typescript
await waitActions.waitForTimeout(2000);
await waitActions.waitForLoadState('networkidle');
await waitActions.waitForUrl(/dashboard/);
await waitActions.waitForResponse(/api\/users/);
```

## Support

For issues and questions:
- Create an issue in the repository
- Contact the automation team


