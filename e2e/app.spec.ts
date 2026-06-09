import { test, expect } from '@playwright/test';

test.describe('HealthAI Coach Frontend E2E Flow', () => {

  test('should navigate from splash screen to welcome page', async ({ page }) => {
    // Navigate to splash screen
    await page.goto('/');

    // Check that splash screen contents are visible (logo or text)
    const brandName = page.locator('.brand-name');
    await expect(brandName).toBeVisible();
    await expect(brandName).toContainText('HealthAI');

    // Splash screen has a 2.5s timer before redirecting to /welcome
    await expect(page).toHaveURL(/\/welcome/, { timeout: 5000 });
    
    // Verify welcome page contents
    const welcomeTitle = page.locator('.welcome-title');
    await expect(welcomeTitle).toBeVisible();
    await expect(welcomeTitle).toContainText('Ton coach bien-être personnel');
  });

  test('should navigate to "Qui sommes-nous" page and back to login', async ({ page }) => {
    await page.goto('/welcome');

    // Click on "Qui sommes-nous ?"
    const aboutLink = page.locator('text=Qui sommes-nous ?');
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    // Verify home url and content
    await expect(page).toHaveURL(/\/home/);
    
    // Go back to welcome
    await page.goto('/welcome');

    // Click "Continuer" to go to login
    const continueBtn = page.locator('text=Continuer →');
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();

    await expect(page).toHaveURL(/\/login/);
  });

  test('should show validation error on incorrect credentials', async ({ page }) => {
    await page.goto('/login');

    // Find input fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    // Input wrong credentials
    await emailInput.fill('invalid-user@healthai.com');
    await passwordInput.fill('wrongpassword');

    // Click submit
    await submitBtn.click();

    // Verify that the error message is displayed
    const errorAlert = page.locator('#login-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Email ou mot de passe incorrect.');
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/login');

    // Click "Pas encore de compte ? S'inscrire"
    const registerLink = page.locator('text=Pas encore de compte ?');
    await registerLink.click();

    await expect(page).toHaveURL(/\/register/);
  });

  test('should successfully log in and show user dashboard (mocked)', async ({ page }) => {
    // Intercept login request
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'header.eyJpZCI6MTIzLCJlbWFpbCI6InRlc3RAaGVhbHRoYWkuY29tIn0.signature' // base64 of {"id":123,"email":"test@healthai.com"}
        }),
      });
    });

    // Intercept user profile query
    await page.route('**/api/users/123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user_id: 123,
          user_email: 'test@healthai.com',
          user_firstname: 'Jean',
          user_lastname: 'Dupont',
          user_role: 'user',
          user_weight: 75,
          user_size: 180,
          user_gender: 'male',
          user_birth: '1990-01-01'
        }),
      });
    });

    // Go to login page
    await page.goto('/login');

    // Fill credentials
    await page.locator('input[type="email"]').fill('test@healthai.com');
    await page.locator('input[name="password"]').fill('secretpwd123');

    // Submit
    await page.locator('button[type="submit"]').click();

    // Verify redirected to user home page
    await expect(page).toHaveURL(/\/user\/home/, { timeout: 10000 });

    // Verify dashboard features exist on the dashboard
    const heroSub = page.locator('.hero-sub');
    await expect(heroSub).toBeVisible();
    await expect(heroSub).toContainText("Votre assistant santé, nutrition et fitness propulsé par l'IA");

    const premiumLabel = page.locator('.banner-label');
    await expect(premiumLabel).toBeVisible();
    await expect(premiumLabel).toContainText('Offre premium');

    // Verify sidebar structure is loaded
    const sidebar = page.locator('.sidenav');
    await expect(sidebar).toBeVisible();
    await expect(sidebar).toContainText('Recettes');
    await expect(sidebar).toContainText('Programmes Sportifs');
  });

});
