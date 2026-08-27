import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

import { createTestAccount, testPassword } from './test-account';

test.describe('Core End-User Workflows', () => {

  test('Sign in and end an authenticated session', async ({ page }) => {

    const login = new LoginPage(page);

    const email = await createTestAccount(page);

    // 1. Submit valid credentials.

    await login.goto();

    const successfulLogin = await login.signIn(email, testPassword);

    await expect(successfulLogin.ok()).toBeTruthy();

    await expect(page).toHaveURL(
      'https://eventhub.rahulshettyacademy.com/',
    );

    await expect(page.getByTestId('nav-events')).toBeVisible();

    await expect(page.getByTestId('nav-bookings')).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Logout' }),
    ).toBeVisible();

    // 2. Sign out.

    await page.getByRole('button', { name: 'Logout' }).click();

    await login.expectVisible();

    await expect(
      page.getByRole('button', { name: 'Logout' }),
    ).toHaveCount(0);

    // 3. Attempt an incorrect password.

    const failedLogin = await login.signIn(
      email,
      'WrongPassword!2026',
    );

    await expect(failedLogin.status()).toBe(400);

    await expect(page).toHaveURL(/\/login$/);

    await expect(
      page.getByRole('heading', {
        name: 'Sign in to EventHub',
      }),
    ).toBeVisible();

    // 4. Submit blank and malformed credentials.

    await login.emailInput.fill('invalid-email');

    await login.passwordInput.fill('');

    await login.signInButton.click({ force: true });

    await expect(page).toHaveURL(/\/login$/);

    await expect(
      page.getByRole('heading', {
        name: 'Sign in to EventHub',
      }),
    ).toBeVisible();
  });

});