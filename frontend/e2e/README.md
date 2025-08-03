# E2E Tests

## Setup
1. Make sure Docker and Docker Compose are installed
2. Install dependencies: `npm install`
3. Install Playwright browsers: `npx playwright install`

## Running Tests
- Run all e2e tests: `npm run test:e2e`
- Run tests with UI: `npm run test:e2e:ui`
- Run specific test: `npx playwright test login.spec.ts`

## Test Credentials
- Email: test@example.com
- Password: password

## Notes
- Tests automatically start the Docker Compose stack
- Database is seeded with test user via migration
- Tests run against real backend integration (not MSW mocks)
