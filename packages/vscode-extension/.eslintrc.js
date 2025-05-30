module.exports = {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@nx/typescript"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "plugins": [
      "jest"
    ],
    "rules": {
      "no-negated-in-lhs": "error",
      "no-cond-assign": ["error", "except-parens"],
      "curly": ["error", "all"],
      "object-curly-spacing": ["error", "always"],
      "no-unused-expressions": "error",
      "no-sequences": "error",
      "no-nested-ternary": "error",
      "no-unreachable": "error",
      "wrap-iife": ["error", "inside"],
      "no-caller": "error",
      "quotes": ["error", "double"],
      "no-undef": "off",
      "no-unused-vars": "off",
      "comma-style": ["error", "last"],
      "camelcase": [
        "error",
        {
          "properties": "never"
        }
      ],
      "dot-notation": [
        "error",
        {
          "allowPattern": "^[a-z]+(_[a-z]+)+$"
        }
      ],
      "max-len": [
        "warn",
        {
          "code": 150,
          "ignoreComments": true,
          "ignoreUrls": true,
          "ignoreRegExpLiterals": true
        }
      ],
      "no-mixed-spaces-and-tabs": "error",
      "no-trailing-spaces": "error",
      "no-multi-str": "error",
      "comma-spacing": [
        "error",
        {
          "before": false,
          "after": true
        }
      ],
      "space-before-blocks": ["error", "always"],
      "space-in-parens": ["off"],
      "keyword-spacing": [2],
      "semi": ["error", "always"],
      "semi-spacing": [
        "error",
        {
          "after": true
        }
      ],
      "space-infix-ops": "error",
      "eol-last": "error",
      "linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
      "no-with": "error",
      "brace-style": "error",
      "space-before-function-paren": ["off"],
      "no-loop-func": "error",
      "key-spacing": [
        "error",
        {
          "beforeColon": false,
          "afterColon": true
        }
      ],
      "space-unary-ops": [
        "error",
        {
          "words": false,
          "nonwords": false
        }
      ],
      "no-multiple-empty-lines": 2
    }
};
  