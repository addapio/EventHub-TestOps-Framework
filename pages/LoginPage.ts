import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerLink: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://eventhub.rahulshettyacademy.com/login', { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible' });
  }
  async signIn(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    const loginResponse = this.page.waitForResponse((response) =>
      response.url().endsWith('/api/auth/login') && response.request().method() === 'POST',
    );
    await this.signInButton.click();
    const response = await loginResponse;
    if (response.ok()) {
      await this.page.waitForURL('https://eventhub.rahulshettyacademy.com/');
    }
  }
  async openRegistration(): Promise<void> {
    await this.registerLink.click({ force: true });
    await this.page.waitForURL(/\/register$/);
    await this.page.getByRole('textbox', { name: 'you@email.com' }).waitFor({ state: 'visible' });
  }
  async expectVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Sign in to EventHub' })).toBeVisible();
  }
}
