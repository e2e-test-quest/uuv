# @uuv/dictionary

[![npm version](https://badge.fury.io/js/%40uuv%2Fdictionary.svg)](https://badge.fury.io/js/%40uuv%2Fdictionary)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This package provides a built-in set of Cucumber sentences for writing end-to-end tests with UUV. It includes translations in English and French, along with accessibility role-based sentence generation.

## Features

- Built-in Cucumber sentences for E2E testing
- Support for multiple languages (English and French)
- Role-based sentence generation for accessibility
- Integration-ready with Cypress, Playwright, and Testing Library

## Installation

```bash
npm install @uuv/dictionary
```

## Usage

Import the dictionary in your test files:

```typescript
import { getDefinedDictionary } from '@uuv/dictionary';

const dictionary = getDefinedDictionary('en'); // or 'fr' for French
```

### Available Dictionaries

- English (`en`)
- French (`fr`)

## Structure

The package contains:

1. **Base Sentences**: General sentences for common actions
2. **Role-based Sentences**: Context-specific sentences based on accessibility roles
3. **Language Support**: Translations in English and French
4. **Accessibility Integration**: Role-based sentence generation

## Development

### Building

Run `nx build dictionary` to build the library.

### Running Unit Tests

Run `nx test dictionary` to execute the unit tests via [Jest](https://jestjs.io).

### Linting

Run `nx lint dictionary` to lint the codebase.
