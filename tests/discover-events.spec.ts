import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { EventsPage } from '../pages/EventsPage';
import { createTestAccount, testPassword } from './test-account';

test.describe('Core End-User Workflows', () => {
  test('Discover events using search and filters', async ({ page }) => {
    const login = new LoginPage(page);
    const events = new EventsPage(page);
    const email = await createTestAccount(page);

    // 1. Sign in and open Events.
    await login.goto();
    await login.signIn(email, testPassword);
    await events.goto();
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
    await expect(page.getByRole('article').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book Now' }).first()).toBeVisible();

    // 2. Search for a distinctive event and a non-matching term.
    await events.search('World Tech Summit');
    await expect(page.getByRole('heading', { name: 'World Tech Summit' })).toBeVisible();
    await events.search('No Such Event 999');
    await expect(page.getByRole('heading', { name: 'World Tech Summit' })).toHaveCount(0);

    // 3. Apply category and city filters.
    await events.search('');
    await events.filter('🎙 Conference', 'Hyderabad');
    await expect(page.getByRole('heading', { name: 'World Tech Summit' })).toBeVisible();

    // 4. Open the event details.
    await events.openEvent('World Tech Summit');
    await expect(page).toHaveURL(/\/events\/1$/);
    await expect(page.getByRole('heading', { name: 'Book Tickets' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Full Name*' })).toBeVisible();
  });
});
