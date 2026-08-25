import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

const password = 'ExploreHub!2026';

function uniqueEmail(): string {
  return `qa.${Date.now()}@gmail.com`;
}

test.describe('Core End-User Workflows', () => {
  test('Register a new EventHub account', async ({ page }) => {
    const login = new LoginPage(page);
    const register = new RegisterPage(page);
    const email = uniqueEmail();

    // 1. Open the login page and select Register.
    await login.goto();
    await login.openRegistration();
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await expect(register.createAccountButton).toBeVisible();

    // 2. Enter valid registration details.
    await register.emailInput.fill(email);
    await register.passwordInput.fill(password);
    await register.confirmPasswordInput.fill(password);
    await expect(register.confirmPasswordInput).toHaveValue(password);

    // 3. Select Create Account.
    await register.createAccountButton.click({ force: true });
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/');
    await expect(page.getByText(email, { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    // 4. Repeat with an already-registered email.
    await page.getByRole('button', { name: 'Logout' }).click();
    await login.expectVisible();
    await login.openRegistration();
    const duplicateResponse = page.waitForResponse((response) =>
      response.url().endsWith('/api/auth/register') && response.request().method() === 'POST',
    );
    await register.register(email, password);
    await expect((await duplicateResponse).status()).toBe(400);
    await expect(page).toHaveURL(/\/register$/);

    // 5. Repeat with invalid and mismatched values.
    await register.emailInput.fill('invalid-email');
    await register.passwordInput.fill('weak');
    await register.confirmPasswordInput.fill('different');
    await register.createAccountButton.click();
    await expect(page).not.toHaveURL('https://eventhub.rahulshettyacademy.com/');
    await expect(register.emailInput).toBeVisible();
  });
});
