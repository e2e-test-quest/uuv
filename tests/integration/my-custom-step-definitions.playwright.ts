import { expect } from "@playwright/test";
import { World, Given, Then, getTimeout, setTimeout } from "@uuv/playwright";

Given('My first custom step definition', async function () {
    const myVar = 'foo';
    expect(myVar).toBe('a foo');
});

Then('My second custom step definition', async function (this: World) {
    // Your verification
    expect(this.page.getByRole('heading', { name: 'Welcome to Weather App' })).toBeVisible();
});

Then('My third custom step definition', async function (this: World) {
    const newTimeout = 150000;
    await setTimeout(this, newTimeout);
    expect(await getTimeout(this)).toEqual(newTimeout);
});

