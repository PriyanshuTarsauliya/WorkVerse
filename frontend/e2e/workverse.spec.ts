import { test, expect } from '@playwright/test';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { JobSearchPage } from './pages/JobSearchPage';
import { ApplicationPage } from './pages/ApplicationPage';

test.describe('WorkVerse E2E QA Test Suite', () => {
  let signupPage: SignupPage;
  let loginPage: LoginPage;
  let profilePage: ProfilePage;
  let jobSearchPage: JobSearchPage;
  let applicationPage: ApplicationPage;

  const registeredUser = {
    name: 'QA Test Candidate',
    email: 'qa.registered.user@example.com',
    password: 'Password123',
    wrongPassword: 'WrongPassword999',
  };

  const newUser = {
    name: 'New QA Candidate',
    email: 'new.qa.candidate@example.com',
    password: 'Password123',
    shortPassword: '123',
  };

  /** Helper: seed a pre-registered user into localStorage and reload so React picks it up */
  async function seedUserAndReload(page: any) {
    await page.evaluate((user: any) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('workverse_users', JSON.stringify([{
        name: user.name,
        email: user.email,
        password: user.password,
        role: 'seeker',
        avatarInitials: user.name.substring(0, 2).toUpperCase(),
      }]));
    }, registeredUser);
    await page.reload();
    await page.waitForSelector('[data-testid="signin-button"], [data-testid="user-profile-button"]', { timeout: 10000 });
  }

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);
    jobSearchPage = new JobSearchPage(page);
    applicationPage = new ApplicationPage(page);
  });

  test('TEST 1 — First-Time User: Sign Up & Edge Cases', async ({ page }) => {
    // Navigate and seed pre-registered user
    await page.goto('/');
    await seedUserAndReload(page);

    // 2. Open auth modal & switch to Register
    await signupPage.openAuthModal();
    await signupPage.switchToRegister();

    // Edge Case 1: Short / invalid password validation
    await signupPage.fillSignupForm(newUser.name, newUser.email, newUser.shortPassword);
    await signupPage.submit();
    await signupPage.assertPasswordValidationError('Password must be at least 6 characters');

    // 3. Fill valid registration details & submit
    await signupPage.fillSignupForm(newUser.name, newUser.email, newUser.password);
    await signupPage.submit();

    // Assert logged-in state
    await signupPage.assertLoggedIn();

    // Edge Case 2: Duplicate email registration prevention
    await loginPage.logout();
    await signupPage.openAuthModal();
    await signupPage.switchToRegister();
    await signupPage.fillSignupForm('Another User', registeredUser.email, registeredUser.password);
    await signupPage.submit();
    await signupPage.assertAuthError('An account with this email already exists');
  });

  test('TEST 2 — Returning User: Login & Authentication Edge Cases', async ({ page }) => {
    await page.goto('/');
    await seedUserAndReload(page);

    // Open Login Modal
    await loginPage.openAuthModal();
    await loginPage.switchToLogin();

    // Edge Case 1: Wrong password
    await loginPage.fillLoginForm(registeredUser.email, registeredUser.wrongPassword);
    await loginPage.submit();
    await loginPage.assertLoginFailure('Invalid email or password');

    // Successful login with correct credentials
    await loginPage.fillLoginForm(registeredUser.email, registeredUser.password);
    await loginPage.submit();
    await loginPage.assertLoginSuccess();
  });

  test('TEST 3 — Profile Completion & Validation Edge Cases', async ({ page }) => {
    await page.goto('/');
    await seedUserAndReload(page);

    // Login first
    await loginPage.openAuthModal();
    await loginPage.switchToLogin();
    await loginPage.fillLoginForm(registeredUser.email, registeredUser.password);
    await loginPage.submit();
    await loginPage.assertLoginSuccess();

    // Open profile modal
    await profilePage.openModal();

    // Record initial completion percentage
    const initialCompletion = await profilePage.getCompletionPercentage();

    // Edge Case: Empty required field submission
    await profilePage.fillProfileForm('', '');
    await profilePage.saveProfile();
    await profilePage.assertSaveError('Full name and location are required fields');

    // Fill valid profile details & add skill
    await profilePage.fillProfileForm(registeredUser.name, 'Bengaluru, KA', '5');
    await profilePage.addSkill('GraphQL');
    await profilePage.saveProfile();

    // Assert success feedback message
    await profilePage.assertSaveSuccess();

    // Assert score strictly increased
    const updatedCompletion = await profilePage.getCompletionPercentage();
    expect(updatedCompletion).toBeGreaterThan(initialCompletion);
  });

  test('TEST 4 — Job Search, Grid & Deck View, and Application Tracking', async ({ page }) => {
    await page.goto('/');
    await seedUserAndReload(page);

    // 1. Search jobs by keyword & location
    await jobSearchPage.searchByKeyword('React');
    await jobSearchPage.searchByLocation('Bengaluru');

    // 2. Open first job details
    await jobSearchPage.clickJobCard(1);
    await applicationPage.assertDetailModalOpen();

    // 3. Apply for job
    await applicationPage.openApplyModalFromDetail();
    await applicationPage.fillApplication(registeredUser.name, registeredUser.email);
    await applicationPage.submitApplication();
    await applicationPage.assertApplicationSuccess();

    // 4. Verify in Application Tracker Board
    await applicationPage.openTrackerBoard();
    await applicationPage.assertTrackerCardVisible(1);

    // Edge Case: Duplicate application prevention
    await jobSearchPage.selectSegment('all');
    await applicationPage.assertDuplicateApplyPrevented(1);

    // 5. Test Deck Mode Swiping & Controls
    await jobSearchPage.searchByKeyword('');
    await jobSearchPage.searchByLocation('');
    await jobSearchPage.switchToDeckView();
    await jobSearchPage.passDeckJob();
    await jobSearchPage.applyDeckJob();
  });

  test('TEST 5 — Non-Functional Checks (Theme, Sound, Reduced Motion & Accessibility)', async ({ page }) => {
    await page.goto('/');
    await seedUserAndReload(page);

    // 1. Dark/Light Theme Toggle
    const themeButton = page.locator('[data-testid="theme-toggle"]');
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    await page.waitForTimeout(300);
    await themeButton.click();

    // 2. Sound Toggle in Deck View
    await jobSearchPage.switchToDeckView();
    await jobSearchPage.toggleSound();
    await jobSearchPage.toggleSound();

    // 3. Emulate prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('[data-testid="hero-heading"]')).toBeVisible();

    // 4. Keyboard Navigation (Tab + Enter)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  });
});
