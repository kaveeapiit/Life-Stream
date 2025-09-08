# Automated Testing Guide for Life Stream

## Overview

This document outlines the comprehensive automated testing strategy implemented for the Life Stream blood donation management system. Our testing approach includes unit tests, integration tests, end-to-end tests, and continuous integration.

## Testing Strategy

### 1. Testing Pyramid

```
    /\
   /E2E\     - End-to-End Tests (Playwright)
  /______\
 /        \   - Integration Tests (React Testing Library + Supertest)
/  UNIT    \  - Unit Tests (Vitest + Jest)
\__________/
```

### 2. Testing Types

#### Unit Tests

- **Frontend**: Component logic, utility functions, hooks
- **Backend**: Controllers, models, middleware, utilities
- **Coverage Target**: 80%+

#### Integration Tests

- **API Integration**: Route handlers with database
- **Component Integration**: React components with API calls
- **Authentication Flow**: Complete auth workflow

#### End-to-End Tests

- **User Journeys**: Complete user workflows
- **Cross-browser Testing**: Chrome, Firefox, Safari
- **Mobile Testing**: Responsive design validation

## Test Setup

### Prerequisites

```bash
# Install dependencies
npm install
cd backend && npm install

# Setup test database (PostgreSQL required)
createdb life_stream_test
psql -d life_stream_test -f complete-schema.sql
```

### Environment Configuration

Create test environment files:

**Frontend: `.env.test`**

```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_ENV=test
```

**Backend: `backend/.env.test`**

```bash
NODE_ENV=test
PORT=3001
DB_HOST=localhost
DB_USER=test_user
DB_PASSWORD=test_password
DB_NAME=life_stream_test
DB_PORT=5432
SESSION_SECRET=test-session-secret
JWT_SECRET=test-jwt-secret
```

## Running Tests

### All Tests

```bash
# Run all test suites
npm run test:all

# Run with coverage
npm run test:coverage
```

### Frontend Tests

```bash
# Run frontend unit tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

### Backend Tests

```bash
# Run backend tests
npm run test:backend

# Watch mode
cd backend && npm run test:watch

# Coverage report
cd backend && npm run test:coverage
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Interactive mode
npm run test:e2e:ui

# Specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

## Test Structure

### Frontend Tests Location

```
src/
├── test/
│   ├── setup.js                 # Test configuration
│   ├── components/              # Component tests
│   │   ├── Login.test.jsx
│   │   ├── DonationForm.test.jsx
│   │   └── ...
│   ├── integration/             # Integration tests
│   │   ├── App.test.jsx
│   │   └── ...
│   └── utils/                   # Utility tests
│       └── ...
```

### Backend Tests Location

```
backend/
├── tests/
│   ├── setup.js                 # Test configuration
│   ├── auth.test.js            # Authentication API tests
│   ├── donation.test.js        # Donation API tests
│   ├── authController.test.js  # Controller unit tests
│   └── ...
```

### E2E Tests Location

```
tests/
├── e2e/
│   ├── auth.spec.js            # Authentication flows
│   ├── donation.spec.js        # Donation workflows
│   ├── hospital.spec.js        # Hospital dashboard
│   └── ...
```

## Writing Tests

### Frontend Component Test Example

```javascript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginComponent from "../components/Login";

describe("Login Component", () => {
  it("should handle successful login", async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      data: { token: "mock-token", user: { id: 1 } },
    });

    render(<LoginComponent onLogin={mockLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
```

### Backend API Test Example

```javascript
import request from "supertest";
import app from "../app.js";

describe("POST /api/auth/login", () => {
  it("should login user with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body.user).not.toHaveProperty("password");
  });
});
```

### E2E Test Example

```javascript
import { test, expect } from "@playwright/test";

test("complete donation flow", async ({ page }) => {
  // Login
  await page.goto("/login");
  await page.fill('[placeholder="Email"]', "test@example.com");
  await page.fill('[placeholder="Password"]', "password123");
  await page.click("text=Login");

  // Navigate to donation form
  await page.click("text=Donate");

  // Fill and submit form
  await page.fill('[placeholder="Full Name"]', "John Doe");
  await page.selectOption('[name="bloodType"]', "O+");
  await page.fill('[placeholder="Location"]', "New York");

  await page.click("text=Submit Donation");

  // Verify success
  await expect(
    page.locator("text=Donation submitted successfully")
  ).toBeVisible();
});
```

## Test Data Management

### Test Database Setup

```sql
-- Create test-specific data
INSERT INTO users (name, email, password, blood_type)
VALUES ('Test User', 'test@example.com', '$2b$10$...', 'O+');

INSERT INTO hospitals (hospital_name, username, password)
VALUES ('Test Hospital', 'test_hospital', '$2b$10$...');
```

### Data Cleanup

```javascript
// Before each test
beforeEach(async () => {
  await pool.query("DELETE FROM donations WHERE email LIKE %test%");
  await pool.query("DELETE FROM users WHERE email LIKE %test%");
});
```

## Mock Strategies

### API Mocking

```javascript
// Mock API calls
vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
```

### Database Mocking

```javascript
// Mock database queries
vi.mock("../config/db", () => ({
  default: {
    query: vi.fn(),
  },
}));
```

## Performance Testing

### Load Testing with Artillery

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run tests/load/auth-load-test.yml
```

**Load Test Configuration**: `tests/load/auth-load-test.yml`

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Login flow"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
```

## Coverage Reports

### Frontend Coverage

```bash
npm run test:coverage
# Report: coverage/index.html
```

### Backend Coverage

```bash
cd backend && npm run test:coverage
# Report: backend/coverage/lcov-report/index.html
```

### Coverage Thresholds

**Frontend**: `vite.config.test.js`

```javascript
export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "html", "lcov"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

**Backend**: `jest.config.js`

```javascript
export default {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Continuous Integration

### GitHub Actions Workflow

Our CI/CD pipeline automatically:

1. **Code Quality Checks**

   - ESLint for code quality
   - Prettier for formatting
   - Type checking

2. **Test Execution**

   - Unit tests (Jest/Vitest)
   - Integration tests (Supertest)
   - E2E tests (Playwright)

3. **Coverage Analysis**

   - Generate coverage reports
   - Enforce coverage thresholds
   - Upload coverage to CodeCov

4. **Deployment**
   - Deploy to staging on develop branch
   - Deploy to production on main branch

### Test Reporting

- **Test Results**: Uploaded as GitHub Actions artifacts
- **Coverage Reports**: Available in CI logs and artifacts
- **E2E Videos**: Recorded on test failures
- **Screenshots**: Captured on failures

## Best Practices

### Test Organization

1. **Descriptive Test Names**: Use clear, behavior-driven names
2. **Test Independence**: Each test should be isolated
3. **Data Cleanup**: Clean up test data after each test
4. **Mock External Dependencies**: Use mocks for external APIs

### Performance

1. **Parallel Execution**: Run tests in parallel when possible
2. **Selective Testing**: Use watch mode for development
3. **Test Optimization**: Keep tests fast and focused

### Maintenance

1. **Regular Updates**: Keep testing dependencies updated
2. **Test Reviews**: Include tests in code reviews
3. **Documentation**: Document complex test scenarios
4. **Refactoring**: Refactor tests alongside production code

## Troubleshooting

### Common Issues

**Tests Timing Out**

```javascript
// Increase timeout for slow operations
test("slow operation", async () => {
  // Test code
}, 10000); // 10 second timeout
```

**Database Connection Issues**

```bash
# Check PostgreSQL service
brew services start postgresql

# Verify test database
psql -d life_stream_test -c "SELECT 1;"
```

**E2E Test Failures**

```bash
# Run in headed mode for debugging
npx playwright test --headed

# Generate trace
npx playwright test --trace on
```

### Debug Mode

**Frontend Tests**

```bash
npm run test:ui
# Opens interactive test UI
```

**Backend Tests**

```bash
cd backend && npm run test:watch
# Runs tests in watch mode
```

**E2E Tests**

```bash
npx playwright test --debug
# Opens Playwright inspector
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

---

_This testing strategy ensures high code quality, reliability, and maintainability for the Life Stream application while providing confidence in deployments and feature updates._
