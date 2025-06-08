import { Page, TestInfo } from "@playwright/test";
import { createBdd, test as base } from "playwright-bdd";

export class World {
  constructor(public page: Page, public testInfo: TestInfo) {}

  get context() {
    return this.page.context();
  }

  get browser() {
    return this.page.context().browser();
  }

  get request() {
    return this.page.request;
  }
}

export const test = base.extend<{ world: World }>({
  world: async ({ page, $testInfo }, use) => {
    const world: World = new World(page, $testInfo);
    await use(world);
  },
});

export const { Given, When, Then } = createBdd(test, {
  worldFixture: "world"
});
