import { test, expect } from '../../../src/core/base/BaseTest';

test.describe('User API Tests', () => {
  
    test('GET - Fetch all users', async ({ apiDriver }) => {
      const response = await apiDriver.get('/users');
  
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      expect(response.data.length).toBeGreaterThan(0);
    });
  
    test('POST - Create new user', async ({ apiDriver }) => {
      const newUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        role: 'User'
      };
  
      const response = await apiDriver.post('/users', newUser);
  
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.email).toBe(newUser.email);
    });
  
    test('PUT - Update existing user', async ({ apiDriver }) => {
      const userId = 1;
      const updateData = {
        firstName: 'Jane Updated',
        lastName: 'Smith Updated'
      };
  
      const response = await apiDriver.put(`/users/${userId}`, updateData);
  
      expect(response.status).toBe(200);
      expect(response.data.firstName).toBe(updateData.firstName);
    });
  
    test('DELETE - Remove user', async ({ apiDriver }) => {
      const userId = 999;
      const response = await apiDriver.delete(`/users/${userId}`);
  
      expect(response.status).toBe(204);
    });
  
    test('API - Authentication with bearer token', async ({ apiDriver }) => {
      // Login to get token
      const loginResponse = await apiDriver.post('/auth/login', {
        username: 'testuser',
        password: 'password123'
      });
  
      expect(loginResponse.status).toBe(200);
      const token = loginResponse.data.token;
  
      // Set auth token
      apiDriver.setAuthToken(token);
  
      // Make authenticated request
      const response = await apiDriver.get('/users/me');
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('username');
    });
  });