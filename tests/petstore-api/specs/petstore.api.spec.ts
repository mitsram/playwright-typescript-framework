import { test, expect } from '../../../src/core/base/BaseTest';

// Sample pet data for testing
const newPet = {
  id: Math.floor(Math.random() * 1000000), // Random ID for uniqueness
  name: 'Doggie',
  status: 'available',
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 1, name: 'friendly' }],
};

test.describe('Petstore API Tests', () => {

  test('POST /pet - Create a new pet', async ({ apiDriver }) => {
    
    const response = await apiDriver.post('/v2/pet', newPet);

    // Verify response body
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data.name).toBe(newPet.name);
    //expect(response.data.json).toMatchObject(newPet);
  });

  test('GET /pet/{petId} - Retrieve a pet by ID', async ({ apiDriver }) => {
    // First, create a pet to ensure it exists
    await apiDriver.post('/v2/pet', newPet );

    // Retrieve the pet
    const response = await apiDriver.get('/v2/pet/' + newPet.id);

    // Verify response status
    expect(response.status).toBe(200);

    // Verify response body
    const pet = await response.data;
    expect(pet.id).toBe(newPet.id);
    expect(pet.name).toBe('Doggie');
  });

  test('PUT /pet - Update an existing pet', async ({ apiDriver }) => {
    // First, create a pet
    await apiDriver.post(`/v2/pet`, newPet );

    // Updated pet data
    const updatedPet = {
      ...newPet,
      name: 'Doggie Updated',
      status: 'sold',
    };

    const response = await apiDriver.put(`/v2/pet`, updatedPet);

    // Verify response status
    expect(response.status).toBe(200);

    // Verify updated pet
    const pet = await response.data;
    expect(pet.name).toBe('Doggie Updated');
    expect(pet.status).toBe('sold');
  });

  test('GET /pet/findByStatus - Find pets by status', async ({ apiDriver }) => {
    const response = await apiDriver.get(`/v2/pet/findByStatus?status=available`);

    // Verify response status
    expect(response.status).toBe(200);

    // Verify response body is an array
    const pets = await response.data;
    expect(Array.isArray(pets)).toBe(true);

    // Verify at least one pet has status 'available'
    expect(pets.some((pet: any) => pet.status === 'available')).toBe(true);
  });

  test('DELETE /pet/{petId} - Delete a pet', async ({ apiDriver }) => {
    // First, create a pet to delete
    await apiDriver.post(`/v2/pet`, newPet );

    // Delete the pet
    const response = await apiDriver.delete(`/v2/pet/${newPet.id}`);

    // Verify response status
    expect(response.status).toBe(200);

    // Verify pet no longer exists
    const getResponse = await apiDriver.get(`/v2/pet/${newPet.id}`);
    expect(getResponse.status).toBe(404); // Not found
  });

  test('POST /pet - Invalid pet data', async ({ apiDriver }) => {
    // Invalid pet data (missing required fields)
    const invalidPet = {
      id: newPet.id,
      // Missing name and status
    };

    const response = await apiDriver.post(`/v2/pet`, {
      data: invalidPet,
    });

    // Expect a 405 or similar error for invalid input
    expect(response.status).not.toBe(200);
  });
});