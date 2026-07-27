import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly signinButton: Locator;
  readonly authModal: Locator;
  readonly registerTab: Locator;
  readonly loginTab: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly passwordValidationError: Locator;
  readonly authErrorMessage: Locator;
  readonly userProfileButton: Locator;
  readonly heroHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signinButton = page.locator('[data-testid="signin-button"]');
    this.authModal = page.locator('[data-testid="auth-modal"]');
    this.registerTab = page.locator('[data-testid="auth-mode-register"]');
    this.loginTab = page.locator('[data-testid="auth-mode-login"]');
    this.fullNameInput = page.locator('[data-testid="full-name-input"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.submitButton = page.locator('[data-testid="auth-submit-button"]');
    this.passwordValidationError = page.locator('[data-testid="password-validation-error"]');
    this.authErrorMessage = page.locator('[data-testid="auth-error-message"]');
    this.userProfileButton = page.locator('[data-testid="user-profile-button"]');
    this.heroHeading = page.locator('h1');
    this.signinButton = page.locator('[data-testid="signin-button"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openAuthModal() {
    await expect(this.signinButton).toBeVisible();
    await this.signinButton.click();
    await expect(this.authModal).toBeVisible();
  }

  async switchToRegister() {
    await this.registerTab.click();
  }

  async fillSignupForm(name: string, email: string, pass: string) {
    await this.fullNameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
  }

  async submit() {
    await this.submitButton.click();
  }

  async assertPasswordValidationError(messageSubstr: string) {
    await expect(this.passwordValidationError).toBeVisible();
    await expect(this.passwordValidationError).toContainText(messageSubstr);
  }

  async assertAuthError(messageSubstr: string) {
    await expect(this.authErrorMessage).toBeVisible();
    await expect(this.authErrorMessage).toContainText(messageSubstr);
  }
  async assertLoggedIn() {
    // Check if onboarding wizard is visible and bypass it
    const wizard = this.page.locator('[data-testid="onboarding-wizard"]');
    try {
      await wizard.waitFor({ state: 'visible', timeout: 5000 });
      await this.page.waitForTimeout(500); // wait for enter animation

      // Step 0
      await this.page.locator('[data-testid="discovery-search"]').click();
      await this.page.locator('[data-testid="profession-job_seeker"]').click();
      await this.page.locator('button:has-text("Continue")').click();

      // Step 1
      await this.page.locator('h3:has-text("Upload your resume")').waitFor({ state: 'visible' });
      await this.page.waitForTimeout(500);
      await this.page.locator('button:has-text("Continue")').click();

      // Step 2
      const finishBtn = this.page.locator('button:has-text("Finish Setup")');
      await finishBtn.waitFor({ state: 'visible' });
      await this.page.waitForTimeout(500);
      await finishBtn.click();

      // Step 3
      const exploreBtn = this.page.locator('[data-testid="onboarding-finish"]');
      await exploreBtn.waitFor({ state: 'visible' });
      await this.page.waitForTimeout(500);
      await exploreBtn.click();
      await wizard.waitFor({ state: 'hidden', timeout: 5000 });
    } catch (e) {
      console.log("BYPASS LOGIC FAILED:", e);
    }
    
    await expect(this.userProfileButton).toBeVisible({ timeout: 10000 });
    await expect(this.authModal).toBeHidden();
  }
}
