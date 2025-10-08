# AGENTS.md

## Build/Lint/Test Commands

- `npx nx build <project>` - Build a specific project
- `npx nx lint <project>` - Lint a specific project
- `npx nx test <project>` - Run tests for a specific project
- `npx nx e2e-test:run <project>` - Run E2E tests in headless mode
- `npx nx run-many --all --target=test` - Run all tests across projects
- `npx nx run-many --all --target=lint` - Run linting across all projects
- `npx nx graph` - Display project dependency graph

## Code Style Guidelines

- Follow TypeScript/JavaScript best practices with ESLint and Prettier
- Use Nx workspace structure with strict module boundaries
- All commits must be signed-off with DCO (Developer Certificate of Origin)
- Commit messages follow semantic-release format: `type(scope): message #issue`
- Projects use consistent naming conventions for targets (build, test, lint, e2e-test:run, etc.)
- Use `npx nx <target> <project>` to execute commands on specific projects
- Code must be formatted using Prettier and validated with ESLint
- Follow Nx project structure where each package is in packages/ directory
- Unit tests are written in .spec.ts files
