import { expect, Locator, Page } from '@playwright/test';

export class EventDetailsPage {
  readonly quantity: Locator;
  readonly increaseButton: Locator;
  readonly decreaseButton: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly confirmBookingButton: Locator;

  constructor(private readonly page: Page) {
    this.quantity = page.getByText('Tickets', { exact: true }).locator('..').getByText(/^\d+$/);
    this.increaseButton = page.getByRole('button', { name: '+' });
    this.decreaseButton = page.getByRole('button', { name: '−' });
    this.nameInput = page.getByRole('textbox', { name: 'Full Name*' });
    this.emailInput = page.getByRole('textbox', { name: 'Email*' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number*' });
    this.confirmBookingButton = page.getByRole('button', { name: 'Confirm Booking' });
  }
  async setAttendee(name: string, email: string, phone: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }
  async changeQuantity(delta: number): Promise<void> {
    const button = delta > 0 ? this.increaseButton : this.decreaseButton;
    for (let index = 0; index < Math.abs(delta); index += 1) {
      const currentQuantity = Number(await this.quantity.textContent());
      await button.click({ force: true });
      await expect(this.quantity).toHaveText(String(currentQuantity + Math.sign(delta)));
    }
  }
  async confirmBooking(): Promise<void> { await this.confirmBookingButton.dispatchEvent('click'); }
}
