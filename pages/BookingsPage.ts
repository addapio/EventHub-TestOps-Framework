import { Locator, Page } from '@playwright/test';

export class BookingsPage {
  readonly clearAllButton: Locator;
  constructor(private readonly page: Page) { this.clearAllButton = page.getByRole('button', { name: 'Clear all bookings' }); }
  async goto(): Promise<void> { await this.page.goto('https://eventhub.rahulshettyacademy.com/bookings'); }
  bookingCard(reference: string): Locator { return this.page.getByText(reference, { exact: true }).locator('..').locator('..'); }
  async openDetails(): Promise<void> { await this.page.getByRole('button', { name: 'View Details' }).click(); }
  async cancelBooking(): Promise<void> { await this.page.getByRole('button', { name: 'Cancel Booking' }).click(); }
  async clearAll(): Promise<void> { await this.clearAllButton.click(); }
}
