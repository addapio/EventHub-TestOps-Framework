import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { BookingsPage } from '../pages/BookingsPage';
import { BookingDetailsPage } from '../pages/BookingDetailsPage';
import { createTestAccount, testPassword } from './test-account';

test.describe('Core End-User Workflows', () => {
  test('View and manage an existing booking', async ({ page }) => {
    const login = new LoginPage(page);
    const events = new EventsPage(page);
    const eventDetails = new EventDetailsPage(page);
    const bookings = new BookingsPage(page);
    const email = await createTestAccount(page);

    // 1. Create one confirmed booking and open My Bookings.
    await login.goto();
    await login.signIn(email, testPassword);
    await events.goto();
    await events.openEvent('World Tech Summit');
    await eventDetails.setAttendee('Booking Manager', email, '+91 98765 43210');
    await eventDetails.confirmBooking();
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Details' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel Booking' })).toBeVisible();

    // 2. Open booking details.
    await bookings.openDetails();
    const bookingDetails = new BookingDetailsPage(page);
    await expect(page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Payment Summary' })).toBeVisible();

    // 3. Check refund eligibility.
    await bookingDetails.checkRefundEligibility();
    await expect(page.getByText(/Checking your refund eligibility|Eligible for refund|not eligible/i)).toBeVisible();
    await expect(page.getByText(/Eligible for refund|not eligible/i)).toBeVisible();

    // 4. Cancel the booking and verify its state.
    page.on('dialog', (dialog) => dialog.accept());
    await bookingDetails.cancel();
    await expect(page).toHaveURL(/\/bookings$/);
    await expect(page.getByText('confirmed', { exact: true })).toHaveCount(0);

    // 5. Clear all remaining bookings.
    await bookings.clearAll();
    await expect(page.getByText(/no bookings|bookings yet|empty/i)).toBeVisible();
  });
});
