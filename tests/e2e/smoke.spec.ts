// tests/e2e/smoke.spec.ts
import { expect, test } from "@playwright/test";

test.describe("EventMap smoke routes", () => {
  test("home opens and has EventMap content", async ({ page }) => {
    const response = await page.goto("/en");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("body")).toContainText("EventMap");
    await expect(page.getByRole("heading", { name: /Discover Live Events/i })).toBeVisible();
  });

  test("ru home opens", async ({ page }) => {
    const response = await page.goto("/ru");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/ru$/);
    await expect(page.locator("body")).toContainText("EventMap");
  });

  test("search landing opens", async ({ page }) => {
    const response = await page.goto("/en/search");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/en\/search$/);
    await expect(page.locator("body")).toContainText(/All Events|Search/i);
  });

  test("music search opens", async ({ page }) => {
    const response = await page.goto("/en/search/music");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/en\/search\/music$/);
    await expect(page.locator("body")).toContainText(/Music|Events/i);
  });

  test("detail page opens for london-music-night", async ({ page }) => {
    const response = await page.goto("/en/events/london-music-night");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/en\/events\/london-music-night$/);
    await expect(page.locator("body")).toContainText(/London Music Night|London/i);
  });

  test("favorites opens and shows favorites page or empty state", async ({ page }) => {
    const response = await page.goto("/en/favorites");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/en\/favorites$/);
    await expect(page.locator("body")).toContainText(/Favorites|No favorite events yet|Loading favorite events/i);
  });
  test("final architecture demo opens", async ({ page }) => {
    const response = await page.goto("/en/demo/final-architecture");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/en\/demo\/final-architecture$/);
    await expect(page.locator("body")).toContainText(/Final architecture|Server\/client boundary|EventMap/i);
  });

  test("login opens and shows Supabase Auth or login controls", async ({ page }) => {
    const response = await page.goto("/en/login");

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(/\/en\/login$/);
    await expect(page.locator("body")).toContainText(/Supabase Auth|Send Magic Link|Google OAuth/i);
  });

});
