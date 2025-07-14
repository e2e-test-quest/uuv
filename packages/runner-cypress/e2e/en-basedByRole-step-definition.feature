Feature: enriched by role step definition

  Background:
    Given I visit path "https://e2e-test-quest.github.io/simple-webapp/"

  Rule: role, name or content
    Scenario: key.then.element.withRoleAndName
      And I should see a title named "Grouping Form Data with Fieldset"

    Scenario: key.then.element.not.withRoleAndName
      And I should not see a title named "[NOT] Grouping Form Data with Fieldset"

    Scenario: key.then.element.withRoleAndNameAndContent
      And I should see a button named "titleButton" and containing "save"

    Scenario: key.then.element.withRoleAndNameAndContentDisabled
      And I should see a text box named "First name" and containing "John" disabled

    Scenario: key.then.element.withRoleAndNameDisabled
      And I should see a text box named "First name" disabled

    Scenario: key.then.element.withRoleAndNameAndContentEnabled
      And I should see a text box named "Last name" and containing "Doe" enabled

    Scenario: key.then.element.withRoleAndNameEnabled
      And I should see a text box named "Last name" enabled

  Rule: Attributes
    Scenario: key.then.attributes.withValues
      And within a text box named "First name"
      And I should see these attributes with values
        | class | fname-class |
