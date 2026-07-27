import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly signinButton: Locator;
  readonly authModal: Locator;
  readonly loginTab: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly authErrorMessage: Locator;
  readonly userProfileButton: Locator;
  readonly profileModal: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signinButton = page.locator('[data-testid="signin-button"]');
    this.authModal = page.locator('[data-testid="auth-modal"]');
    this.loginTab = page.locator('[data-testid="auth-mode-login"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.submitButton = page.locator('[data-testid="auth-submit-button"]');
    this.authErrorMessage = page.locator('[data-testid="auth-error-message"]');
    this.userProfileButton = page.locator('[data-testid="user-profile-button"]');
    this.profileModal = page.locator('[data-testid="profile-modal"]');
    this.logoutButton = page.locator('[data-testid="profile-logout-button"]');
  }

  async openAuthModal() {
    await this.signinButton.click();
    await expect(this.authModal).toBeVisible();
  }

  async switchToLogin() {
    await this.loginTab.click();
  }

  async fillLoginForm(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
  }

  async submit() {
    await this.submitButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.userProfileButton).toBeVisible();
    await expect(this.authModal).toBeHidden();
  }

  async assertLoginFailure(messageSubstr: string) {
    await expect(this.authErrorMessage).toBeVisible();
    await expect(this.authErrorMessage).toContainText(messageSubstr);
  }

  async logout() {
    await this.userProfileButton.click();
    await expect(this.profileModal).toBeVisible();
    await this.logoutButton.click();
    await expect(this.signinButton).toBeVisible();
  }
}
