import { Page, Locator, expect } from '@playwright/test';

export class JobSearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly locationInput: Locator;
  readonly gridViewButton: Locator;
  readonly deckViewButton: Locator;
  readonly deckCard: Locator;
  readonly deckPassButton: Locator;
  readonly deckApplyButton: Locator;
  readonly deckUndoButton: Locator;
  readonly soundToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.locationInput = page.locator('[data-testid="location-input"]');
    this.gridViewButton = page.locator('[data-testid="view-mode-grid"]');
    this.deckViewButton = page.locator('[data-testid="view-mode-deck"]');
    this.deckCard = page.locator('[data-testid="deck-card"]');
    this.deckPassButton = page.locator('[data-testid="deck-pass-button"]');
    this.deckApplyButton = page.locator('[data-testid="deck-apply-button"]');
    this.deckUndoButton = page.locator('[data-testid="deck-undo-button"]');
    this.soundToggle = page.locator('[data-testid="sound-toggle"]');
  }

  async searchByKeyword(query: string) {
    await this.searchInput.fill(query);
  }

  async searchByLocation(loc: string) {
    await this.locationInput.fill(loc);
  }

  async selectSegment(segmentKey: 'all' | 'recommended' | 'saved') {
    await this.page.locator(`[data-testid="segment-${segmentKey}"]`).click();
  }

  async switchToDeckView() {
    await this.deckViewButton.click();
    await expect(this.deckCard).toBeVisible();
  }

  async switchToGridView() {
    await this.gridViewButton.click();
  }

  async clickJobCard(jobId: string | number) {
    await this.page.locator(`[data-testid="job-card-${jobId}"]`).click();
  }

  async passDeckJob() {
    await this.deckPassButton.click();
  }

  async applyDeckJob() {
    await this.deckApplyButton.click();
  }

  async toggleSound() {
    await this.soundToggle.click();
  }
}
