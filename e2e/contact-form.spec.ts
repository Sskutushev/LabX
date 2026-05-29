import { test, expect } from "@playwright/test";

test("submits contact form and shows success", async ({ page }) => {
  await page.goto("/");
  await page.fill("input[name='name']", "Sergey");
  await page.fill("input[name='phone']", "+7 999 111 22 33");
  await page.fill("input[name='email']", "user@example.com");
  await page.fill("textarea[name='comment']", "Тестовая заявка для проверки e2e сценария");
  await page.click("#submit-btn");
  await expect(page.locator("#form-status")).toContainText(/Успешно|Success/);
});
