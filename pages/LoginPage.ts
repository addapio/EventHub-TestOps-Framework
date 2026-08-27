import { expect, Locator, Page, Response } from '@playwright/test';

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
    const loginUrl = 'https://eventhub.rahulshettyacademy.com/login';

    await this.page.goto(loginUrl, {
      waitUntil: 'domcontentloaded',
    });

    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (attempt > 0) {
        await this.page.reload({
          waitUntil: 'domcontentloaded',
        });
      }

      try {
        await expect(this.emailInput).toBeVisible({
          timeout: 10000,
        });

        return;
      } catch (error) {
        if (attempt === 2) {
          throw error;
        }
      }
    }
  }

  async signIn(email: string, password: string): Promise<Response> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    const [response] = await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.url().endsWith('/api/auth/login') &&
          response.request().method() === 'POST',
      ),
      this.signInButton.click(),
    ]);

    if (response.ok()) {
      await this.page.waitForURL(
        'https://eventhub.rahulshettyacademy.com/',
        {
          waitUntil: 'domcontentloaded',
        },
      );
    }

    return response;
  }

  async openRegistration(): Promise<void> {
    await this.registerLink.click({ force: true });

    await this.page.waitForURL(/\/register$/);

    await this.page
      .getByRole('textbox', { name: 'you@email.com' })
      .waitFor({ state: 'visible' });
  }

  async expectVisible(): Promise<void> {
    await expect(
      this.page.getByRole('heading', {
        name: 'Sign in to EventHub',
      }),
    ).toBeVisible();
  }
}