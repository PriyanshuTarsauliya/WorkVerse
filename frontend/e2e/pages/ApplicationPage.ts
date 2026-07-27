import { Page, Locator, expect } from '@playwright/test';

export class ApplicationPage {
  readonly page: Page;
  readonly jobDetailModal: Locator;
  readonly jobDetailTitle: Locator;
  readonly jobDetailApplyButton: Locator;
  readonly jobDetailAppliedBadge: Locator;
  readonly applyModal: Locator;
  readonly applicantNameInput: Locator;
  readonly applicantEmailInput: Locator;
  readonly submitApplicationButton: Locator;
  readonly applySuccessContainer: Locator;
  readonly trackerBoard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jobDetailModal = page.locator('[data-testid="job-detail-modal"]');
    this.jobDetailTitle = page.locator('[data-testid="job-detail-title"]');
    this.jobDetailApplyButton = page.locator('[data-testid="job-detail-apply-button"]');
    this.jobDetailAppliedBadge = page.locator('[data-testid="job-detail-applied-badge"]');
    this.applyModal = page.locator('[data-testid="apply-modal"]');
    this.applicantNameInput = page.locator('[data-testid="applicant-name-input"]');
    this.applicantEmailInput = page.locator('[data-testid="applicant-email-input"]');
    this.submitApplicationButton = page.locator('[data-testid="apply-submit-button"]');
    this.applySuccessContainer = page.locator('[data-testid="apply-success-container"]');
    this.trackerBoard = page.locator('[data-testid="application-tracker-board"]');
  }

  async assertDetailModalOpen() {
    await expect(this.jobDetailModal).toBeVisible();
  }

  async openApplyModalFromDetail() {
    await this.jobDetailApplyButton.click();
    await expect(this.applyModal).toBeVisible();
  }

  async fillApplication(name: string, email: string) {
    await this.applicantNameInput.fill(name);
    await this.applicantEmailInput.fill(email);
    const resumeUrlInput = this.page.locator('input[placeholder*="github"]');
    if (await resumeUrlInput.isVisible()) {
      await resumeUrlInput.fill('https://github.com/alexmorgan');
    }
  }

  async submitApplication() {
    await this.submitApplicationButton.click();
  }

  async assertApplicationSuccess() {
    await expect(this.applySuccessContainer).toBeVisible();
    await this.page.locator('button:has-text("Done")').click();
  }

  async openTrackerBoard() {
    await this.page.locator('[data-testid="segment-saved"]').click();
    await expect(this.trackerBoard).toBeVisible();
  }

  async assertTrackerCardVisible(jobId: string | number) {
    const card = this.page.locator(`[data-testid="tracker-card-${jobId}"]`);
    await expect(card).toBeVisible();
  }

  async assertDuplicateApplyPrevented(jobId: string | number) {
    const badge = this.page.locator(`[data-testid="applied-badge-${jobId}"]`);
    await expect(badge).toBeVisible();
  }
}
