
Feature: Onezae Admin login page
  As an admin user
  I want to see the login controls
  So that I can identify where to enter my credentials
@Regression @LOGIN-001 @Login
  Scenario: Display the required login controls
    Given the application URL is configured
    When I open the admin login page
    Then the Email/Username* textbox should be visible
    And the Password* textbox should be visible
    And the Log In button should be visible

  @SupplementalUsability @LOGIN-002
  Scenario: Reject blank credentials with visible validation
    Given the application URL is configured
    When I open the admin login page
    And I submit the login form with blank credentials once
    Then the admin login page should remain visible
    And visible required-field validation feedback should be shown

  @Regression @LOGIN-003 @Login
  Scenario: Authenticate with a valid QA email and password
    Given the application URL is configured
    And QA email credentials are configured
    When I open the admin login page
    And I authenticate with the QA email and password once
    Then the configured admin dashboard should be visible
    And authenticated navigation should be visible
    And the login form should no longer be visible

  @Regression @LOGIN-004 @Login
  Scenario: Reject a known QA email or username with an incorrect password
    Given the application URL is configured
    When I open the admin login page
    And I submit the known QA email or username with an intentionally incorrect password once
    Then the admin login page should remain visible
    And visible authentication failure feedback should be shown
    And authenticated dashboard navigation should not be visible

  @Regression @LOGIN-005 @Login
  Scenario: Reject an unregistered synthetic identifier
    Given the application URL is configured
    When I open the admin login page
    And I submit a reserved synthetic unregistered identifier and password once
    Then the admin login page should remain visible
    And visible authentication failure feedback should be shown
    And authenticated dashboard navigation should not be visible

  