/**
 * Software Name : UUV
 *
 * SPDX-License-Identifier: MIT
 *
 * This software is distributed under the MIT License,
 * see the "LICENSE" file for more details
 *
 * Authors: NJAKO MOLOM Louis Fredice & SERVICAL Stanley
 * Software description: Make test writing fast, understandable by any human
 * understanding English or French.
 */

import { World } from "../../preprocessor/run/world";
import { Cookie, expect, Locator as LocatorTest } from "@playwright/test";
import { DEFAULT_TIMEOUT } from "@uuv/runner-commons";
import { EN_ROLES } from "@uuv/dictionary";
import { Locator, Page } from "playwright";

export type AccessibleRole = (typeof EN_ROLES)[number]["id"];

export enum COOKIE_NAME {
    TIMEOUT = "uuv.timeout",
    SELECTED_ELEMENT = "uuv.withinFocusedElement",
    MOCK_URL = "uuv.mockUrl",
}

export enum COOKIE_VALUE {
    NOT_EXIST = "notExist",
}

export enum FILTER_TYPE {
    SELECTOR = "bySelector",
    ROLE = "byRole",
    TEXT = "byText",
    ARIA_LABEL = "byAriaLabel",
    TEST_ID = "byTestId",
    SELECTOR_PARENT = "bySelectorParent",
}

export type CustomCookieValue = { name: string };

export class CustomCookie implements Cookie {
    public name = `${COOKIE_VALUE.NOT_EXIST.toString()}`;
    public value = "[]";
    domain = ".github.com";
    expires = -1;
    httpOnly = false;
    path = "/";
    sameSite: "Strict" | "Lax" | "None" = "Lax";
    secure = false;

    isValid() {
        return !this.name.includes(COOKIE_VALUE.NOT_EXIST.toString());
    }
}

export class MockCookie implements CustomCookieValue {
    public isConsumed = false;

    constructor(
        public name: string,
        public url: string,
        public verb: string
    ) {
        this.isConsumed = false;
    }
}

export class SelectedElementCookie implements CustomCookieValue {
    constructor(
        public name: string,
        public value: string
    ) {}
}

export class TimeoutCookie implements CustomCookieValue {
    constructor(
        public name: string,
        public value: number
    ) {}
}

export type FilterType = { name: FILTER_TYPE; value: any };

/**
 * Retrieves the current page or element based on the selected element cookie filters.
 * Applies all filters from the cookie to locate the specific element or page.
 * @param world - The Cucumber world object containing context and test info
 * @returns A Promise that resolves to either a Locator or Page instance
 */
export async function getPageOrElement(world: World): Promise<Locator | Page> {
    let pointer: Locator | Page = world.page as Page;
    const cookie = await getCookie(world, COOKIE_NAME.SELECTED_ELEMENT);
    // console.debug("cookieGetPageOrElement", cookie);
    if (cookie.isValid()) {
        const filters: FilterType[] = JSON.parse(cookie.value);
        // console.debug("filters",filters);
        for (const filter of filters) {
            switch (filter.name) {
                case FILTER_TYPE.SELECTOR:
                    pointer = pointer.locator(filter.value);
                    break;
                case FILTER_TYPE.ARIA_LABEL:
                    pointer = pointer.getByLabel(filter.value, { exact: true });
                    break;
                case FILTER_TYPE.ROLE:
                    pointer = pointer.getByRole(filter.value, { exact: true });
                    break;
                case FILTER_TYPE.TEST_ID:
                    pointer = pointer.getByTestId(filter.value);
                    break;
                case FILTER_TYPE.TEXT:
                    pointer = pointer.getByText(filter.value, { exact: true });
                    break;
                case FILTER_TYPE.SELECTOR_PARENT:
                    pointer = pointer.locator(filter.value);
                    break;
                default:
                    break;
            }
            // console.debug("locatorGetPageOrElement", pointer, filter)
            await expect(pointer as LocatorTest).toHaveCount(1);
        }
    }
    return pointer;
}

/**
 * Adds a cookie to the browser context with a test-specific name.
 * Handles different cookie types: MOCK_URL (with consumption tracking), SELECTED_ELEMENT, and TIMEOUT.
 * @param world - The Cucumber world object containing context
 * @param cookieName - The type of cookie to add (from COOKIE_NAME enum)
 * @param newCookie - The cookie value object to add
 */
export async function addCookie(world: World, cookieName: COOKIE_NAME, newCookie: CustomCookieValue) {
    // console.debug("value", value)
    const cookieNameStr = `${cookieName.toString()}_${world.testInfo.testId}`;
    const cookie = await getCookie(world, cookieName);
    let cookieValue: CustomCookieValue[] = JSON.parse(cookie.value);
    const mockCookie = cookieValue.find(cookie => cookie.name === newCookie.name);
    switch (cookieName) {
        case COOKIE_NAME.MOCK_URL:
            if (mockCookie) {
                cookieValue.filter(cookie => cookie.name === newCookie.name).map(cookie => ((cookie as MockCookie).isConsumed = true));
            } else {
                cookieValue = [];
                cookieValue.push(newCookie);
            }
            // console.debug("cookieValueJSON", JSON.stringify(cookieValue));
            break;
        case COOKIE_NAME.SELECTED_ELEMENT:
            cookieValue.push(newCookie);
            break;
        case COOKIE_NAME.TIMEOUT:
            cookieValue.push(newCookie);
            break;
    }
    await world.context.addCookies([{ name: cookieNameStr, value: JSON.stringify(cookieValue), path: "/", domain: ".github.com" }]);
}

/**
 * Retrieves a cookie from the browser context by name.
 * Returns a CustomCookie instance with the cookie data or a default empty cookie if not found.
 * @param world - The Cucumber world object containing context
 * @param cookieName - The name of the cookie to retrieve (from COOKIE_NAME enum)
 * @returns A Promise that resolves to the CustomCookie instance
 */
export async function getCookie(world: World, cookieName: COOKIE_NAME): Promise<CustomCookie> {
    const cookieNameStr = `${cookieName.toString()}_${world.testInfo.testId}`;
    const cookies = await world.context.cookies();
    if (cookies) {
        const cookieInContext = cookies.filter(cookie => cookie.name === cookieNameStr)[0];
        // console.debug("selector", cookieInContext)

        if (cookieInContext) {
            return Object.assign(new CustomCookie(), cookieInContext);
        }
    }
    return new CustomCookie();
}

/**
 * Deletes a cookie by setting its expiration date to 0.
 * @param world - The Cucumber world object containing context
 * @param cookieName - The name of the cookie to delete (from COOKIE_NAME enum)
 */
export async function deleteCookieByName(world: World, cookieName: COOKIE_NAME) {
    const cookieToDelete = await getCookie(world, cookieName);
    await world.context.addCookies([
        {
            ...cookieToDelete,
            expires: 0,
        },
    ]);
}

/**
 * Finds exactly one element by role and name.
 * @param world - The Cucumber world object containing context
 * @param role - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @param otherRoleOptions - Additional role options to pass to Playwright
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndName(world: World, role: string, name: string, otherRoleOptions = {}): Promise<any> {
    return await findWithRoleAndNameAndContent(world, role, name, undefined, otherRoleOptions);
}

/**
 * Locates an element within a specific role and name, then saves it as the selected element cookie.
 * Subsequent operations will be relative to this element until cleared.
 * @param world - The Cucumber world object containing context
 * @param role - The accessible role to search for
 * @param name - The accessible name of the element to find
 */
export async function withinRoleAndName(world: World, role: string, name: string) {
    await findWithRoleAndNameAndContent(world, role, name, undefined);
    await addCookie(world, COOKIE_NAME.SELECTED_ELEMENT, new SelectedElementCookie(FILTER_TYPE.SELECTOR, `role=${role}[name="${name}"]`));
}

/**
 * Locates an element by CSS selector and saves it as the selected element cookie.
 * Subsequent operations will be relative to this element until cleared.
 * @param world - The Cucumber world object containing context
 * @param selector - The CSS selector string to find the element
 * @returns A Promise that resolves when the element is found and cookie is set
 */
export async function withinSelector(world: World, selector: string) {
    return await findWithSelector(world, selector).then(async () => {
        await addCookie(world, COOKIE_NAME.SELECTED_ELEMENT, new SelectedElementCookie(FILTER_TYPE.SELECTOR, selector));
    });
}

/**
 * Finds an element by role and name, verifying it does NOT exist (count should be 0).
 * @param world - The Cucumber world object containing context
 * @param role - The accessible role to search for
 * @param name - The accessible name of the element to verify doesn't exist
 */
export async function notFoundWithRoleAndName(world: World, role: string, name: string) {
    role = encodeURIComponent(role);
    await expect(
        (await getPageOrElement(world)).getByRole(role as any, {
            name: name,
            exact: true,
        })
    ).toHaveCount(0, { timeout: await getTimeout(world) });
}

/**
 * Finds exactly one element by CSS selector relative to the current selected element or page.
 * Verifies the element exists and focuses it.
 * @param world - The Cucumber world object containing context
 * @param selector - The CSS selector string to find the element
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithSelector(world: World, selector: string): Promise<LocatorTest> {
    const locator = (await getPageOrElement(world)).locator(selector);
    await expect(locator).toHaveCount(1, { timeout: await getTimeout(world) });
    await locator.focus({ timeout: await getTimeout(world) });
    return locator;
}

/**
 * Gets all elements matching the text content relative to the current selected element or page.
 * Use this when you expect multiple matching elements.
 * @param world - The Cucumber world object containing context
 * @param textContent - The text content to search for
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function getWithContent(world: World, textContent: string): Promise<LocatorTest> {
    return (await getPageOrElement(world)).getByText(textContent);
}

/**
 * Gets all elements matching the test ID relative to the current selected element or page.
 * Use this when you expect multiple matching elements.
 * @param world - The Cucumber world object containing context
 * @param testId - The test ID attribute value to search for
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function getwithTestId(world: World, testId: string): Promise<LocatorTest> {
    return (await getPageOrElement(world)).getByTestId(testId);
}

/**
 * Finds exactly one element by test ID relative to the current selected element or page.
 * Verifies the element exists and returns its locator.
 * @param world - The Cucumber world object containing context
 * @param testId - The test ID attribute value to search for
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithTestId(world: World, testId: string): Promise<LocatorTest> {
    const locator = await getwithTestId(world, testId);
    await expect(locator).toHaveCount(1, { timeout: await getTimeout(world) });
    return locator;
}

/**
 * Gets all elements matching the ARIA label relative to the current selected element or page.
 * Use this when you expect multiple matching elements.
 * @param world - The Cucumber world object containing context
 * @param expectedAriaLabel - The ARIA label to search for
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function getwithAriaLabel(world: World, expectedAriaLabel: string): Promise<LocatorTest> {
    return (await getPageOrElement(world)).getByLabel(expectedAriaLabel, { exact: true });
}

/**
 * Finds exactly one element by ARIA label relative to the current selected element or page.
 * Verifies the element exists and returns its locator.
 * @param world - The Cucumber world object containing context
 * @param expectedAriaLabel - The ARIA label to search for
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithAriaLabel(world: World, expectedAriaLabel: string): Promise<LocatorTest> {
    const locator = await getwithAriaLabel(world, expectedAriaLabel);
    await expect(locator).toHaveCount(1, { timeout: await getTimeout(world) });
    return locator;
}

/**
 * Finds exactly one element by role and name, with optional text content match.
 * Verifies the element count is 1, optionally checks text content, and focuses the element.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @param expectedTextContent - Optional text content to verify
 * @param otherRoleOptions - Additional role options to pass to Playwright
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameAndContent(
    world: World,
    expectedRole: string,
    name: string,
    expectedTextContent: string | undefined = undefined,
    otherRoleOptions = {}
): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true, ...otherRoleOptions });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    if (expectedTextContent !== undefined) {
        await checkTextContentLocator(byRole, expectedTextContent);
    }
    await byRole.focus({ timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Finds exactly one element by role and name that is currently focused.
 * Verifies the element exists and is focused.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameFocused(world: World, expectedRole: string, name: string): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).toBeFocused({ timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Finds exactly one element by role and name that is currently checked (e.g., checkbox/radio).
 * Verifies the element exists and is checked.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameAndChecked(world: World, expectedRole: string, name: string): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).toBeChecked({ timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Finds exactly one element by role and name that is currently unchecked (e.g., checkbox/radio).
 * Verifies the element exists and is unchecked.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameAndUnchecked(world: World, expectedRole: string, name: string): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).not.toBeChecked({ timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Finds exactly one element by role and name with specific text content that is disabled.
 * Verifies the element exists, has the specified text content, and is disabled.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @param expectedTextContent - The expected text content to verify
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameAndContentDisabled(
    world: World,
    expectedRole: string,
    name: string,
    expectedTextContent: string
): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await checkTextContentLocator(byRole, expectedTextContent);
    await expect(byRole).toBeDisabled({ timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Finds exactly one element by role and name that is disabled.
 * Verifies the element exists and is disabled.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameDisabled(world: World, expectedRole: string, name: string): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).toBeDisabled({ timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Finds exactly one element by role and name with specific text content that is enabled.
 * Verifies the element exists, has the specified text content, and is enabled.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @param expectedTextContent - The expected text content to verify
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameAndContentEnabled(
    world: World,
    expectedRole: string,
    name: string,
    expectedTextContent: string
): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await checkTextContentLocator(byRole, expectedTextContent);
    await expect(byRole).toBeEnabled({ timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Finds exactly one element by role and name that is enabled.
 * Verifies the element exists and is enabled.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameEnabled(world: World, expectedRole: string, name: string): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).toBeEnabled({ timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Finds exactly one element by role and name that has a specific value.
 * Verifies the element exists and has the expected value attribute.
 * @param world - The Cucumber world object containing context
 * @param expectedRole - The accessible role to search for
 * @param name - The accessible name of the element to find
 * @param expectedValue - The expected value attribute to verify
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function findWithRoleAndNameAndValue(world: World, expectedRole: string, name: string, expectedValue: string): Promise<LocatorTest> {
    expectedRole = encodeURIComponent(expectedRole);
    const byRole = (await getPageOrElement(world)).getByRole(expectedRole as any, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).toHaveValue(expectedValue, { timeout: await getTimeout(world) });
    return byRole;
}

/**
 * Displays all attribute names and values of a DOM element for debugging purposes.
 * Logs the attributes to the console.
 * @param element - The Playwright Locator element to inspect
 */
export async function showAttributesInLocator(element) {
    const attributes = await element.evaluateHandle(aElement => {
        const attributeNames = aElement.getAttributeNames();
        const result = {};
        attributeNames.forEach(name => {
            result[name] = aElement.getAttribute(name);
        });
        return result;
    });

    console.debug("attributes of ", element, await attributes.jsonValue());
}

/**
 * Checks if a locator has the expected text content by trying multiple methods.
 * Tries value, attribute value, checked state, and text content in sequence.
 * @param locator - The Playwright Locator to check
 * @param expectedTextContent - The expected text content to verify
 * @returns A Promise that resolves when the check is complete
 */
export async function checkTextContentLocator(locator: Locator, expectedTextContent: string): Promise<void> {
    // await showAttributesInLocator(locator);
    try {
        await expect(locator as LocatorTest).toHaveValue(expectedTextContent);
    } catch (err) {
        console.error("No value found for locator: ", locator);
        try {
            await expect(locator).toHaveAttribute("value", expectedTextContent);
        } catch (err) {
            console.error("No attribute value found for locator: ", locator);
            try {
                if (expectedTextContent === "true") {
                    await expect(locator as LocatorTest).toBeChecked();
                } else {
                    await expect(locator as LocatorTest).not.toBeChecked();
                }
            } catch (err) {
                console.error("Can't verify check for locator: ", locator);
                try {
                    await expect(locator as LocatorTest).toHaveText(expectedTextContent);
                } catch (err) {
                    console.error("No text found for locator: ", locator);
                    throw new Error(`Content '${expectedTextContent}' isn't present in locator '${locator}'`);
                }
            }
        }
    }
}

/**
 * Clicks on an element by role and name, then clears the selected element cookie.
 * @param world - The Cucumber world object containing context
 * @param role - The accessible role of the element to click
 * @param name - The accessible name of the element to click
 */
export async function click(world: World, role: any, name: string): Promise<LocatorTest> {
  const byRole = (await getPageOrElement(world)).getByRole(role, { name: name, exact: true });
  await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
  byRole.click({ timeout: await getTimeout(world) });
  await deleteCookieByName(world, COOKIE_NAME.SELECTED_ELEMENT);
  return byRole;
}

/**
 * Clicks on the currently focused element in the browser.
 * Uses the :focus selector to identify the active element and clicks it.
 * If no element is focused, clicks on the current page/selected element.
 * @param world - The Cucumber world object containing context
 */
export async function clickFocusedElement(world: World): Promise<void> {
  const keyBoardFocusTargetObj = keyBoardFocusTarget(world);
  if ((await keyBoardFocusTargetObj.count()) === 1) {
      await keyBoardFocusTargetObj.click({ timeout: await getTimeout(world) });
  } else {
      ((await getPageOrElement(world)) as Locator).click({ timeout: await getTimeout(world) });
  }
}

/**
 * Types text into an element by role and name, then clears the selected element cookie.
 * @param world - The Cucumber world object containing context
 * @param role - The accessible role of the element to type into
 * @param name - The accessible name of the element to type into
 * @param textToType - The text to type into the element
 * @returns A Promise that resolves to the LocatorTest instance
 */
export async function type(world: World, role: any, name: string, textToType: string): Promise<LocatorTest> {
    const byRole = (await getPageOrElement(world)).getByRole(role, { name: name, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    byRole.type(textToType, { timeout: await getTimeout(world) });
    await deleteCookieByName(world, COOKIE_NAME.SELECTED_ELEMENT);
    return byRole;
}

/**
 * Types text into the currently focused element.
 * If no element is focused, focuses the current page/selected element first.
 * @param world - The Cucumber world object containing context
 * @param textToType - The text to type into the focused element
 */
export async function typeFocusedElement(world: World, textToType: string): Promise<void> {
    const keyBoardFocusTargetObj = keyBoardFocusTarget(world);
    if ((await keyBoardFocusTargetObj.count()) === 1) {
        await keyBoardFocusTargetObj.type(textToType);
    } else {
        const selector = (await getPageOrElement(world)) as Locator;
        selector.focus({ timeout: await getTimeout(world) });
        selector.type(textToType);
    }
}

export function keyBoardFocusTarget(world: World) {
    return world.page.locator(":focus");
}

/**
 * Gets the current timeout value from the TIMEOUT cookie, or returns the default timeout.
 * @param world - The Cucumber world object containing context
 * @returns A Promise that resolves to the timeout value in milliseconds
 */
export async function getTimeout(world: World): Promise<number> {
    const cookieTimeout = await getCookie(world, COOKIE_NAME.TIMEOUT);
    if (cookieTimeout?.isValid()) {
        const timeoutCookies: TimeoutCookie[] = JSON.parse(cookieTimeout.value);
        if (timeoutCookies.length > 0) {
            return timeoutCookies[0].value;
        }
    }
    return DEFAULT_TIMEOUT;
}

/**
 * Sets a new timeout value by storing it in the TIMEOUT cookie.
 * @param world - The Cucumber world object containing context
 * @param newTimeout - The new timeout value in milliseconds
 */
export async function setTimeout(world: World, newTimeout: number) {
    await addCookie(world, COOKIE_NAME.TIMEOUT, new TimeoutCookie("timeout", newTimeout));
}
