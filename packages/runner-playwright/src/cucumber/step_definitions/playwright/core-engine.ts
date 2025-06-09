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
import { Locator, Page } from "playwright";

export enum COOKIE_NAME {
  TIMEOUT = "uuv.timeout",
  SELECTED_ELEMENT = "uuv.withinFocusedElement",
  MOCK_URL = "uuv.mockUrl"
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
  SELECTOR_PARENT = "bySelectorParent"
}

export type CustomCookieValue = { name: string }

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

  constructor(public name: string, public url: string, public verb: string) {
    this.isConsumed = false;
  }
}

export class SelectedElementCookie implements CustomCookieValue {
  constructor(public name: string, public value: string) {
  }
}

export class TimeoutCookie implements CustomCookieValue {
  constructor(public name: string, public value: number) {
  }
}

export type FilterType = { name: FILTER_TYPE, value: any }

export async function getPageOrElement(world: World): Promise<any> {
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
          pointer = pointer.getByRole(filter.value, { includeHidden: true, exact: true });
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

export async function addCookie(world: World, cookieName: COOKIE_NAME, newCookie: CustomCookieValue) {
  // console.debug("value", value)
  const cookieNameStr = `${cookieName.toString()}_${world.testInfo.testId}`;
  const cookie = await getCookie(world, cookieName);
  let cookieValue: CustomCookieValue[] = JSON.parse(cookie.value);
  const mockCookie = cookieValue.find((cookie => cookie.name === newCookie.name));
  switch (cookieName) {
    case COOKIE_NAME.MOCK_URL:
      if (mockCookie) {
        cookieValue
         .filter((cookie => cookie.name === newCookie.name))
         .map((cookie => (cookie as MockCookie).isConsumed = true));
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

export async function deleteCookieByName(world: World, cookieName: COOKIE_NAME) {
  const cookieToDelete = await getCookie(world, cookieName);
  await world.context.addCookies([
    {
      ...cookieToDelete,
      expires: 0,
    },
  ]);
}

export async function findWithRoleAndName(world: World, role: string, name: string): Promise<any> {
  await findWithRoleAndNameAndContent(world, role, name);
}

export async function withinRoleAndName(world: World, role: string, name: string) {
  await findWithRoleAndNameAndContent(world, role, name, undefined, true);
  await addCookie(world, COOKIE_NAME.SELECTED_ELEMENT, new SelectedElementCookie(FILTER_TYPE.SELECTOR, `role=${role}[name="${name}"]`));

}

export async function notFoundWithRoleAndName(world: World, role: string, name: string) {
  role = encodeURIComponent(role);
  await getPageOrElement(world).then(async (element) => await expect(element.getByRole(role, {
    name: name,
    includeHidden: true,
    exact: true
  })).toHaveCount(0, { timeout: await getTimeout(world) }));

}

export async function findWithRoleAndNameAndContent(world: World, expectedRole: string, name: string, expectedTextContent: string | undefined = undefined, setFocus = false): Promise<any> {
  expectedRole = encodeURIComponent(expectedRole);
  await getPageOrElement(world).then(async (element) => {
    const byRole = await element.getByRole(expectedRole, { name: name, includeHidden: true, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    if (expectedTextContent !== undefined) {
      await checkTextContentLocator(byRole, expectedTextContent);
    }
    await byRole.focus({ timeout: 10000 });
  });
}

export async function findWithRoleAndNameFocused(world: World, expectedRole: string, name: string): Promise<any> {
  expectedRole = encodeURIComponent(expectedRole);
  await getPageOrElement(world).then(async (element) => {
    // console.log("final:",expectedRole,name)
    const byRole = await element.getByRole(expectedRole, { name: name, includeHidden: true, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).toBeFocused();
  });
}

export async function findWithRoleAndNameAndChecked(world: World, expectedRole: string, name: string): Promise<any> {
  expectedRole = encodeURIComponent(expectedRole);
  await getPageOrElement(world).then(async (element) => {
    const byRole = await element.getByRole(expectedRole, { name: name, includeHidden: true, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).toBeChecked();
  });
}

export async function findWithRoleAndNameAndUnchecked(world: World, expectedRole: string, name: string): Promise<any> {
  expectedRole = encodeURIComponent(expectedRole);
  await getPageOrElement(world).then(async (element) => {
    const byRole = await element.getByRole(expectedRole, { name: name, includeHidden: true, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await expect(byRole).not.toBeChecked();
  });
}

export async function findWithRoleAndNameAndContentDisable(world: World, expectedRole: string, name: string, expectedTextContent: string) {
  expectedRole = encodeURIComponent(expectedRole);
  await getPageOrElement(world).then(async (element) => {
    const byRole = await element.getByRole(expectedRole, { name: name, includeHidden: true, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await checkTextContentLocator(byRole, expectedTextContent);
    await expect(byRole).toBeDisabled();
  });
}

export async function findWithRoleAndNameAndContentEnable(world: World, expectedRole: string, name: string, expectedTextContent: string) {
  expectedRole = encodeURIComponent(expectedRole);
  await getPageOrElement(world).then(async (element) => {
    const byRole = element.getByRole(expectedRole, { name: name, includeHidden: true, exact: true });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await checkTextContentLocator(byRole, expectedTextContent);
    await expect(byRole).toBeEnabled();
  });
}

export async function showAttributesInLocator(element) {
  const attributes = await element.evaluateHandle((aElement) => {
    const attributeNames = aElement.getAttributeNames();
    const result = {};
    attributeNames.forEach((name) => {
      result[name] = aElement.getAttribute(name);
    });
    return result;
  });

  console.debug("attributes of ", element, await attributes.jsonValue());
}

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

export async function click(world: World, role: any, name: string) {
  await getPageOrElement(world).then(async (element) => {
    const byRole = element.getByRole(role, {
      name: name,
      exact: true
    });
    await expect(byRole).toHaveCount(1, { timeout: await getTimeout(world) });
    await byRole.click();
    await deleteCookieByName(world, COOKIE_NAME.SELECTED_ELEMENT);
  });
}

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
