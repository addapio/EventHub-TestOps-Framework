import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { createTestAccount, testPassword } from './test-account';

test.describe('Core End-User Workflows', () => {
  test('Book tickets for an event', async ({ page }) => {
    const login = new LoginPage(page);
    const events = new EventsPage(page);
    const details = new EventDetailsPage(page);
    const email = await createTestAccount(page);

    // 1. Open an available event and inspect ticket quantity.
    await login.goto();
    await login.signIn(email, testPassword);
    await events.goto();
    await events.openEvent('World Tech Summit');
    await expect(details.quantity).toHaveText('1');
    await expect(page.getByText('(max 8)', { exact: true })).toBeVisible();
    await expect(page.getByText('$1,500', { exact: true }).last()).toBeVisible();

    // 2. Increase and reduce the quantity.
    await details.changeQuantity(1);
    await expect(details.quantity).toHaveText('2');
    await expect(page.getByText('$3,000', { exact: true }).last()).toBeVisible();
    await details.changeQuantity(-1);
    await expect(details.quantity).toHaveText('1');
    await expect(details.decreaseButton).toBeDisabled();
    await expect(details.quantity).toHaveText('1');

    // 3. Submit without attendee details.
    await details.confirmBooking();
    await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toHaveCount(0);

    // 4. Submit a valid booking.
    await details.setAttendee('QA Test Customer', email, '+91 98765 43210');
    await details.confirmBooking();
    await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible();
    await expect(page.getByText('QA Test Customer', { exact: true })).toBeVisible();
    await expect(page.getByText('$1,500', { exact: true })).toHaveCount(3);
    await expect(page.getByText(/^[A-Z0-9-]{6,}$/).first()).toBeVisible();

    // 5. Verify an excessive quantity cannot be selected.
    await page.getByRole('link', { name: 'Browse More Events' }).click();
    await events.openEvent('World Tech Summit');
    await details.changeQuantity(7);
    await expect(details.quantity).toHaveText('8');
    await expect(details.increaseButton).toBeDisabled();
  });
});
