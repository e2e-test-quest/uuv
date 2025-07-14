Feature: English Test Step Definition

  Background:
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/"

  Scenario: key.then.element.withAriaLabel - 1/2
    Then I should see an element with aria-label "flegend"

  Scenario: key.then.element.withAriaLabel - 2/2
    And within the element with aria-label "flegend"

  Scenario: key.then.element.not.withAriaLabel
    Then I should not see an element with aria-label "[NOT] flegend"

  Scenario: key.then.element.withAriaLabelAndContent
    Then I should see an element with aria-label "flegend" and content "Personalia"

  Scenario: key.then.element.withContent
    Then I should see an element with content "The fieldset element is used to group related data in a form, and the legend element defines a caption for the"

  Scenario: key.then.element.not.withContent
    Then I should not see an element with content "[NOT] The fieldset element is used to group related data in a form, and the legend element defines a caption for the"

  Scenario: key.then.element.withTestId
    Then I should see an element with testId "fieldset"

  Scenario: key.then.element.not.withTestId
    Then I should not see an element with testId "[NOT] fieldset"

  Scenario: key.then.element.withRoleAndName
    Then I should see an element with role "heading" and name "Grouping Form Data with Fieldset"

  Scenario: key.then.element.not.withRoleAndName
    Then I should not see an element with role "heading" and name "[NOT] Grouping Form Data with Fieldset"
    Then I should not see an element with role "[NOT] heading" and name "Grouping Form Data with Fieldset"

  Scenario: key.then.element.withRoleAndNameAndContent
    Then I should see an element with role "button" and name "Reset" and content "Reset"

  Scenario: key.then.element.withRoleAndNameAndContentDisabled
    Then I should see an element with role "textbox" and name "First name" and content "John" disabled

  Scenario: key.then.element.withRoleAndNameAndContentEnabled
    Then I should see an element with role "textbox" and name "Last name" and content "Doe" enabled

  Scenario: key.then.list.withNameAndContent
    Then I should see a list named "test-list" and containing
      | a |
      | b |
      | c |

  Scenario: key.then.attributes.withValues
    When within the element with role "textbox" and name "First name"
    And I should see these attributes with values
      | class | fname-class |

  Scenario: key.then.element.key.when.click.withContext
    And within the element with testId "fieldset"
    And within the element with role "button" and name "Submit"
    When I click
    And I reset context
    Then I should see a title named "404"

  Scenario: key.then.element.key.when.click.button without context
    When I click on button named "Reset"
    Then I should not see a title named "404"

  Scenario: key.then.element.key.when.click.button with context
    When within the element with testId "fieldset"
    And I click on button named "Submit"
    Then I should see a title named "404"

  Scenario: key.then.element.key.when.click.withRole
    And within the element with testId "fieldset"
    When I click on element with role "button" and name "Submit"
    Then I should see a title named "404"

  Scenario: key.then.element.key.when.type
    And within the element with testId "fieldset"
    And within the element with role "textbox" and name "Last name"
    When I type the sentence "Toto"
     And I reset context
    Then I should see an element with role "textbox" and name "Last name" and content "DoeToto"

  Scenario: key.given.within.selector
    Then within the element with selector '[data-testid="fieldset"]'
    And within the element with selector '#fname'
    And I should see these attributes with values
    | class | fname-class |
    And I reset context
