import { test, expect } from "@playwright/test";

/**
 * E2E: the demo form embed contract.
 * Verifies iframe embedding, height postMessage, form validation, and submit.
 */

test.describe("demo form embed", () => {
  test("demo page renders the iframe embed", async ({ page }) => {
    await page.goto("/demo");
    const iframe = page.frameLocator('iframe[title="Schedule a demo with Holistic AI"]');
    await expect(iframe.locator("h1")).toHaveText("Schedule a demo with Holistic AI");
  });

  test("form validates required fields before submit", async ({ page }) => {
    await page.goto("/demo");
    const iframe = page.frameLocator('iframe[title="Schedule a demo with Holistic AI"]');
    // Submit button is disabled until all required fields are valid.
    const submit = iframe.locator('button[type="submit"]');
    await expect(submit).toBeDisabled();
    // Fill everything.
    await iframe.locator('input[type="text"]').fill("Jane Doe");
    await iframe.locator('input[type="email"]').fill("jane@company.com");
    await iframe.locator("select").selectOption({ index: 1 });
    await iframe.locator("textarea").fill("Looking for shadow AI discovery and red teaming.");
    await expect(submit).toBeEnabled();
  });

  test("textarea counter enforces 10–200 chars", async ({ page }) => {
    await page.goto("/demo");
    const iframe = page.frameLocator('iframe[title="Schedule a demo with Holistic AI"]');
    const textarea = iframe.locator("textarea");
    await textarea.fill("short");
    await expect(iframe.locator(".nf-count")).toContainText("At least 5 more characters");
    await textarea.fill("A sufficiently long message about AI governance needs.");
    await expect(iframe.locator(".nf-count")).toContainText("/200");
  });

  test("invalid email is rejected", async ({ page }) => {
    await page.goto("/demo");
    const iframe = page.frameLocator('iframe[title="Schedule a demo with Holistic AI"]');
    await iframe.locator('input[type="text"]').fill("Jane");
    await iframe.locator('input[type="email"]').fill("not-an-email");
    await iframe.locator("select").selectOption({ index: 1 });
    await iframe.locator("textarea").fill("A valid message about governance.");
    await expect(iframe.locator('button[type="submit"]')).toBeDisabled();
  });
});

test.describe("embed protocol", () => {
  test("form reports its height to the parent via postMessage", async ({ page }) => {
    await page.goto("/demo");
    // Collect hai-form-height messages from the iframe.
    const heights: number[] = [];
    page.on("console", (msg) => {
      const t = msg.text();
      if (t.startsWith("HEIGHT:")) heights.push(Number(t.slice(7)));
    });
    await page.evaluate(() => {
      window.addEventListener("message", (e) => {
        if (e.data?.type === "hai-form-height") console.log("HEIGHT:" + e.data.height);
      });
    });
    // Reload so the listener is in place when the form boots.
    await page.reload();
    await page.waitForTimeout(1500);
    expect(heights.length).toBeGreaterThan(0);
    expect(heights[0]).toBeGreaterThan(100);
  });
});
