import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";

Given('My first custom step definition', () => {
    const myVar = 'foo';
    expect(myVar).to.eq('a foo');
});

Then('My second custom step definition', () => {
    // Your verification
    expect(true).to.eq(true);
});


When('My third custom step definition', () => {
    // Your verification
    expect(true).to.eq(true);
});
