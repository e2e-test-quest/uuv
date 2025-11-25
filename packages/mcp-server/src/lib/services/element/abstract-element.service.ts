import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export abstract class AbstractElementService {
    public generateTestForElement(input: FindElementByRoleAndName | FindElementByDomSelector): string {
        if ((input as FindElementByRoleAndName).accessibleName && (input as FindElementByRoleAndName).accessibleRole) {
            return this.generateTestForAccessibleNameAndRole(input as FindElementByRoleAndName);
        } else if ((input as FindElementByDomSelector).domSelector) {
            return this.generateTestForDomSelector(input as FindElementByDomSelector);
        }
        return "";
    }

    protected abstract generateTestForAccessibleNameAndRole(input: FindElementByRoleAndName): string;

    protected abstract generateTestForDomSelector(input: FindElementByDomSelector): string;
}
