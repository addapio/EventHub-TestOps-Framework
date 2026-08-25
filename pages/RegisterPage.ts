import { Locator, Page } from '@playwright/test';

export class RegisterPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly createAccountButton: Locator;
  readonly signInLink: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'you@email.com' });
    this.passwordInput = page.getByRole('textbox', { name: 'Min 8 chars, uppercase, number & symbol' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Repeat your password' });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
  }
  async register(email: string, password: string, confirmation = password): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmation);
    await this.createAccountButton.click();
  }
}
