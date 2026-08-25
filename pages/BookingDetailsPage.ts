import { Locator, Page } from '@playwright/test';

export class BookingDetailsPage {
  readonly cancelButton: Locator;
  readonly refundButton: Locator;
  constructor(private readonly page: Page) {
    this.cancelButton = page.getByRole('button', { name: 'Cancel Booking' });
    this.refundButton = page.getByRole('button', { name: 'Check eligibility for refund?' });
  }
  async checkRefundEligibility(): Promise<void> { await this.refundButton.click(); }
  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.getByRole('button', { name: 'Yes, cancel it' }).click();
  }
}
