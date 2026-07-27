import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly userProfileButton: Locator;
  readonly profileModal: Locator;
  readonly completionPercentageText: Locator;
  readonly nameInput: Locator;
  readonly locationInput: Locator;
  readonly experienceSelect: Locator;
  readonly skillsInput: Locator;
  readonly addSkillButton: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userProfileButton = page.locator('[data-testid="user-profile-button"]');
    this.profileModal = page.locator('[data-testid="profile-modal"]');
    this.completionPercentageText = page.locator('[data-testid="profile-completion-percentage"]');
    this.nameInput = page.locator('[data-testid="profile-name-input"]');
    this.locationInput = page.locator('[data-testid="profile-location-input"]');
    this.experienceSelect = page.locator('[data-testid="profile-experience-select"]');
    this.skillsInput = page.locator('[data-testid="profile-skills-input"]');
    this.addSkillButton = page.locator('[data-testid="profile-add-skill-button"]');
    this.saveButton = page.locator('[data-testid="profile-save-button"]');
    this.successMessage = page.locator('[data-testid="profile-success-message"]');
    this.errorMessage = page.locator('[data-testid="profile-error-message"]');
    this.closeButton = page.locator('[data-testid="profile-close-button"]');
  }

  async openModal() {
    await this.userProfileButton.click();
    await expect(this.profileModal).toBeVisible();
  }

  async getCompletionPercentage(): Promise<number> {
    const text = await this.completionPercentageText.innerText();
    const match = text.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async fillProfileForm(name: string, location: string, expYears?: string) {
    await this.nameInput.fill(name);
    await this.locationInput.fill(location);
    if (expYears) {
      await this.experienceSelect.selectOption(expYears);
    }
  }

  async addSkill(skill: string) {
    await this.skillsInput.fill(skill);
    await this.addSkillButton.click();
  }

  async saveProfile() {
    await this.saveButton.click();
  }

  async assertSaveSuccess() {
    await expect(this.successMessage).toBeVisible();
  }

  async assertSaveError(messageSubstr: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(messageSubstr);
  }

  async closeModal() {
    await this.closeButton.click();
    await expect(this.profileModal).toBeHidden();
  }
}
