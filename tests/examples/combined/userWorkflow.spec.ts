import { test, expect } from '../../../src/core/base/BaseTest';
import { LoginPage } from '../../../src/pages/LoginPage';
import { UserFormPage } from '../../../src/pages/UserFormPage';

test.describe('Combined Web and API Tests', () => {
    test('Create user via API and verify in UI', async ({ webDriver, apiDriver }) => {
      // Step 1: Create user via API
      const newUser = {
        firstName: 'API',
        lastName: 'User',
        email: 'api.user@example.com',
        role: 'User',
        active: true
      };
  
      const apiResponse = await apiDriver.post('/users', newUser);
      expect(apiResponse.status).toBe(201);
      const createdUserId = apiResponse.data.id;
  
      // Step 2: Login to UI
      const loginPage = new LoginPage(webDriver.getPage());
      await loginPage.quickLogin('admin', 'admin123');
  
      // Step 3: Navigate to users page and verify the created user
      await webDriver.navigationActions.navigateToUrl(`/users/${createdUserId}`);
      
      const userName = await webDriver.elementActions.getTextAsync('.user-name');
      expect(userName).toBe(`${newUser.firstName} ${newUser.lastName}`);
  
      // Step 4: Cleanup - Delete user via API
      await apiDriver.delete(`/users/${createdUserId}`);
    });
  
    test('Update user in UI and verify via API', async ({ webDriver, apiDriver }) => {
      // Step 1: Create user via API
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
        role: 'User'
      };
  
      const createResponse = await apiDriver.post('/users', newUser);
      const userId = createResponse.data.id;
  
      // Step 2: Login and update user via UI
      const loginPage = new LoginPage(webDriver.getPage());
      await loginPage.quickLogin('admin', 'admin123');
  
      const userFormPage = new UserFormPage(webDriver.getPage());
      await webDriver.navigationActions.navigateToUrl(`/users/${userId}/edit`);
  
      await webDriver.elementActions.fillTextFieldAsync('#firstName', 'Updated');
      await webDriver.elementActions.clickButtonAsync('#submit-btn');
  
      // Step 3: Verify update via API
      const apiResponse = await apiDriver.get(`/users/${userId}`);
      expect(apiResponse.data.firstName).toBe('Updated');
  
      // Cleanup
      await apiDriver.delete(`/users/${userId}`);
    });
  
    test('End-to-end user registration flow', async ({ webDriver, apiDriver }) => {
      const timestamp = Date.now();
      const testEmail = `user${timestamp}@example.com`;
  
      // Step 1: Register via UI
      await webDriver.navigationActions.navigateToUrl('/register');
      
      await webDriver.elementActions.fillTextFieldAsync('#email', testEmail);
      await webDriver.elementActions.fillTextFieldAsync('#password', 'Password123!');
      await webDriver.elementActions.fillTextFieldAsync('#confirmPassword', 'Password123!');
      await webDriver.elementActions.fillTextFieldAsync('#firstName', 'Test');
      await webDriver.elementActions.fillTextFieldAsync('#lastName', 'User');
      await webDriver.elementActions.clickButtonAsync('#register-btn');
  
      // Wait for registration success
      await webDriver.waitActions.waitForUrl(/\/dashboard/);
  
      // Step 2: Verify user exists via API
      const usersResponse = await apiDriver.get('/users', {
        params: { email: testEmail }
      });
  
      expect(usersResponse.data.length).toBe(1);
      expect(usersResponse.data[0].email).toBe(testEmail);
  
      // Step 3: Verify user can login via API
      const loginResponse = await apiDriver.post('/auth/login', {
        username: testEmail,
        password: 'Password123!'
      });
  
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.data).toHaveProperty('token');
    });
  });