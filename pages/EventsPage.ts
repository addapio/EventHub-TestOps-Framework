import { Locator, Page } from '@playwright/test';

export class EventsPage {
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly citySelect: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByRole('textbox', { name: 'Search events, venues…' });
    this.categorySelect = page.locator('select').nth(0);
    this.citySelect = page.locator('select').nth(1);
  }
  async goto(): Promise<void> {
    await this.page.goto('https://eventhub.rahulshettyacademy.com/events', { waitUntil: 'domcontentloaded' });
    await this.searchInput.waitFor({ state: 'visible' });
  }
  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.page.waitForURL((url) => url.searchParams.get('search') === (term || null));
  }
  async filter(category: string, city: string): Promise<void> {
    await this.categorySelect.selectOption({ label: category });
    await this.citySelect.selectOption({ label: city });
  }
  async openEvent(name: string): Promise<void> {
    await this.page.getByRole('article').filter({ hasText: name }).getByTestId('book-now-btn').dispatchEvent('click');
  }
}
