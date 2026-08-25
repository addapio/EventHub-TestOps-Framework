import { Page, request } from '@playwright/test';

export const testPassword = 'ExploreHub!2026';

export async function createTestAccount(page: Page): Promise<string> {
  const api = await request.newContext({
    baseURL: 'https://api.eventhub.rahulshettyacademy.com',
  });

  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const email = `qa.${Date.now()}-${Math.random().toString(36).slice(2, 8)}@gmail.com`;
      const response = await api.post('/api/auth/register', {
        data: { email, password: testPassword },
      });

      if (response.status() === 201) {
        return email;
      }
    }

    throw new Error('Unable to provision a test account after 3 attempts');
  } finally {
    await api.dispose();
  }
}
