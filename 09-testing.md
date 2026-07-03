# Verity — Testing Strategy & QA Documentation

**Version:** 1.0.0
**Status:** Implementation-Ready
**Last Updated:** 2026-07-03
**Owner:** Engineering Team
**Stakeholders:** QA, DevOps, Security, Product

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Testing Pyramid](#2-testing-pyramid)
3. [Unit Testing](#3-unit-testing)
4. [Integration Testing](#4-integration-testing)
5. [End-to-End (E2E) Testing](#5-end-to-end-e2e-testing)
6. [Accessibility Testing](#6-accessibility-testing)
7. [Performance Testing](#7-performance-testing)
8. [Security Testing](#8-security-testing)
9. [Visual Regression Testing](#9-visual-regression-testing)
10. [Database Testing](#10-database-testing)
11. [API Contract Testing](#11-api-contract-testing)
12. [Test Data Management](#12-test-data-management)
13. [Test Environments](#13-test-environments)
14. [CI/CD Test Pipeline](#14-cicd-test-pipeline)
15. [Test Matrix](#15-test-matrix)
16. [QA Checklist](#16-qa-checklist)
17. [Bug Severity Classification](#17-bug-severity-classification)
18. [Test Ownership & RACI](#18-test-ownership--raci)
19. [Metrics & Reporting](#19-metrics--reporting)
20. [Future Testing Evolution](#20-future-testing-evolution)

---

## 1. Testing Philosophy

Verity's testing strategy is built on a single principle: **confidence through automation**. Every feature that reaches production must be verifiable by an automated test. Manual testing is reserved for exploratory sessions, UX validation, and edge-case discovery—not for regression prevention.

### Core Tenets

| Tenet | Rationale |
|-------|-----------|
| **Shift Left** | Catch defects at the cheapest possible layer. Unit tests are cheaper than E2E tests; type safety is cheaper than unit tests. |
| **Determinism** | A test that flakes is worse than no test. Every test must produce the same result on every run. |
| **Isolation** | Tests must not depend on external state, network conditions, or execution order. |
| **Speed** | The full test suite must complete in under 10 minutes. Slow tests are skipped, not tolerated. |
| **Production Parity** | Test environments must mirror production architecture, not just code. |

### Testing Budget

| Layer | Target Coverage | Execution Time |
|-------|----------------|----------------|
| Static Analysis (TypeScript, ESLint) | 100% of files | < 30s |
| Unit Tests | > 80% logic branches | < 3 min |
| Integration Tests | All API contracts | < 4 min |
| E2E Tests | Critical user paths | < 3 min |
| **Total** | — | **< 10 min** |

---

## 2. Testing Pyramid

Verity follows the standard testing pyramid, weighted heavily toward the base:

```
        /\
       /  \     E2E Tests (5%)
      /----\
     /      \   Integration Tests (15%)
    /--------\
   /          \ Unit Tests + Static Analysis (80%)
  /------------\
```

### Why This Distribution?

- **Unit Tests (80%)**: Business logic, utilities, validation schemas, data transformations, and component behavior in isolation. Fast, cheap, and precise.
- **Integration Tests (15%)**: API route handlers, database queries, authentication flows, and service boundaries. Verify that units compose correctly.
- **E2E Tests (5%)**: Only the "happy path" of critical user journeys. Expensive to write and maintain; reserved for high-value flows that, if broken, would block releases.

---

## 3. Unit Testing

### 3.1 Framework & Tooling

| Tool | Purpose | Version |
|------|---------|---------|
| **Vitest** | Test runner | ^1.0 |
| **@testing-library/react** | Component testing | ^14.0 |
| **@testing-library/jest-dom** | Custom matchers | ^6.0 |
| **@testing-library/user-event** | User interaction simulation | ^14.0 |
| **msw** | Mock Service Worker for API mocking | ^2.0 |
| **faker-js** | Test data generation | ^8.0 |

**Rationale:** Vitest is chosen over Jest for native ESM support, faster cold starts, and seamless Vite integration (which aligns with Next.js's future direction). It provides identical APIs to Jest, minimizing migration friction.

### 3.2 Directory Structure

```
src/
├── lib/
│   ├── utils/
│   │   └── tests/           # Co-located tests
│   │       └── format-date.test.ts
│   └── validators/
│       └── tests/
│           └── company-schema.test.ts
├── components/
│   ├── ui/
│   │   └── tests/
│   │       └── button.test.tsx
│   └── company/
│       └── tests/
│           └── company-card.test.tsx
├── app/
│   └── (student)/
│       └── search/
│           └── tests/
│               └── search-filters.test.tsx
└── server/
    └── actions/
        └── tests/
            └── create-application.test.ts
```

**Naming Convention:** `*.test.ts` for utilities, `*.test.tsx` for React components, `*.spec.ts` for integration-style server tests.

### 3.3 Unit Test Standards

#### 3.3.1 The AAA Pattern

Every test must follow Arrange-Act-Assert:

```typescript
// ❌ Bad: Multiple assertions, unclear structure
it('handles companies', () => {
  const c = createCompany({ name: 'Stripe' });
  expect(c.name).toBe('Stripe');
  expect(c.slug).toBe('stripe');
  c.update({ name: 'Stripe, Inc.' });
  expect(c.name).toBe('Stripe, Inc.');
});

// ✅ Good: Single responsibility per test
describe('Company', () => {
  describe('create', () => {
    it('derives a URL-safe slug from the company name', () => {
      // Arrange
      const input = { name: 'Stripe' };

      // Act
      const company = createCompany(input);

      // Assert
      expect(company.slug).toBe('stripe');
    });
  });

  describe('update', () => {
    it('updates the company name and regenerates the slug', () => {
      const company = createCompany({ name: 'Stripe' });

      company.update({ name: 'Stripe, Inc.' });

      expect(company.name).toBe('Stripe, Inc.');
      expect(company.slug).toBe('stripe-inc');
    });
  });
});
```

#### 3.3.2 Test Data Factories

Never hardcode test data. Use factories:

```typescript
// factories/company-factory.ts
import { faker } from '@faker-js/faker';

export function createCompanyFactory(overrides?: Partial<Company>) {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()),
    description: faker.company.catchPhrase(),
    website: faker.internet.url(),
    logoUrl: faker.image.url(),
    employeeCount: faker.number.int({ min: 10, max: 10000 }),
    fundingStage: faker.helpers.arrayElement(['SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'IPO']),
    remotePolicy: faker.helpers.arrayElement(['REMOTE_FIRST', 'HYBRID', 'ONSITE']),
    visaSponsorship: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}
```

#### 3.3.3 Mocking Rules

| Layer | Mock? | How |
|-------|-------|-----|
| External API calls | Yes | `msw` or `vi.fn()` |
| Database (Prisma) | Yes | `jest-prisma` or manual mocks |
| `next/navigation` | Yes | `next-router-mock` |
| Clerk auth | Yes | `@clerk/testing` |
| Internal utilities | No | Test the real implementation |
| React hooks | No | `@testing-library/react` |

#### 3.3.4 Component Testing with Testing Library

```typescript
// components/company/__tests__/company-card.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompanyCard } from '../company-card';
import { createCompanyFactory } from '@/test/factories/company-factory';

describe('<CompanyCard />', () => {
  it('renders company name and funding stage', () => {
    const company = createCompanyFactory({ name: 'Linear' });
    render(<CompanyCard company={company} />);

    expect(screen.getByText('Linear')).toBeInTheDocument();
    expect(screen.getByText('Series B')).toBeInTheDocument();
  });

  it('navigates to company profile on click', async () => {
    const user = userEvent.setup();
    const company = createCompanyFactory({ slug: 'linear' });
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as any);

    render(<CompanyCard company={company} />);
    await user.click(screen.getByRole('link', { name: /view linear profile/i }));

    expect(push).toHaveBeenCalledWith('/companies/linear');
  });

  it('shows bookmark button when student is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as any);
    render(<CompanyCard company={createCompanyFactory()} />);

    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
  });

  it('hides bookmark button when student is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: false } as any);
    render(<CompanyCard company={createCompanyFactory()} />);

    expect(screen.queryByRole('button', { name: /bookmark/i })).not.toBeInTheDocument();
  });
});
```

#### 3.3.5 Server Action Testing

```typescript
// server/actions/__tests__/create-application.test.ts
import { createApplication } from '../create-application';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

vi.mock('@clerk/nextjs/server');
vi.mock('@/lib/prisma', () => ({
  prisma: {
    application: { create: vi.fn() },
    internship: { findUnique: vi.fn() },
  },
}));

describe('createApplication', () => {
  beforeEach(() => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' });
  });

  it('creates an application with valid data', async () => {
    vi.mocked(prisma.internship.findUnique).mockResolvedValue({
      id: 'intern_1',
      status: 'ACTIVE',
    });
    vi.mocked(prisma.application.create).mockResolvedValue({
      id: 'app_1',
      status: 'APPLIED',
    });

    const result = await createApplication({
      internshipId: 'intern_1',
      notes: 'Excited about this role',
    });

    expect(result.success).toBe(true);
    expect(prisma.application.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          internshipId: 'intern_1',
          studentId: 'user_123',
          status: 'APPLIED',
        }),
      })
    );
  });

  it('returns error when internship is not active', async () => {
    vi.mocked(prisma.internship.findUnique).mockResolvedValue({
      id: 'intern_1',
      status: 'ARCHIVED',
    });

    const result = await createApplication({ internshipId: 'intern_1' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('INTERNSHIP_NOT_AVAILABLE');
  });

  it('returns error when user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null);

    await expect(createApplication({ internshipId: 'intern_1' }))
      .rejects
      .toThrow('Unauthorized');
  });
});
```

### 3.4 Coverage Requirements

| Category | Minimum Coverage | Enforced? |
|----------|-------------------|-----------|
| Statements | 80% | Yes (CI gate) |
| Branches | 75% | Yes (CI gate) |
| Functions | 80% | Yes (CI gate) |
| Lines | 80% | Yes (CI gate) |
| UI Components (rendering) | 60% | Yes (CI gate) |
| Server Actions | 85% | Yes (CI gate) |

**Exclusions from coverage:**
- Generated files (Prisma client, API routes)
- Type definitions
- Third-party wrapper components
- `__tests__` directories themselves

### 3.5 Running Unit Tests

```bash
# Watch mode (development)
npm run test:unit

# Single run with coverage
npm run test:unit:coverage

# Specific file
npx vitest run src/lib/utils/__tests__/format-date.test.ts

# UI mode (debugging)
npx vitest --ui
```

---

## 4. Integration Testing

### 4.1 Scope

Integration tests verify that multiple units work together correctly. At Verity, this primarily means:

- API Route Handlers + Prisma + Database
- Server Actions + Database + Auth
- Middleware + Auth + Route Protection
- Search API + PostgreSQL Full-Text Search

### 4.2 Database Setup

Integration tests use a real PostgreSQL database running in Docker. We do not mock Prisma in integration tests.

#### 4.2.1 Test Database Lifecycle

```typescript
// test/setup/integration-setup.ts
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Ensure test database exists
  execSync('createdb verity_test --if-not-exists', { env: { ...process.env, PGPASSWORD: 'test' } });

  // Apply migrations
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  });
});

beforeEach(async () => {
  // Clean tables in dependency order
  await prisma.$transaction([
    prisma.application.deleteMany(),
    prisma.bookmark.deleteMany(),
    prisma.internship.deleteMany(),
    prisma.company.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

#### 4.2.2 Environment Configuration

```env
# .env.test
DATABASE_URL="postgresql://test:test@localhost:5433/verity_test"
TEST_DATABASE_URL="postgresql://test:test@localhost:5433/verity_test"
CLERK_SECRET_KEY="test_sk_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="test_pk_..."
```

### 4.3 API Route Testing

```typescript
// app/api/companies/__tests__/route.test.ts
import { GET } from '../route';
import { NextRequest } from 'next/server';
import { createCompanyFactory } from '@/test/factories/company-factory';

describe('GET /api/companies', () => {
  it('returns paginated companies with search', async () => {
    await prisma.company.createMany({
      data: [
        createCompanyFactory({ name: 'Stripe', slug: 'stripe' }),
        createCompanyFactory({ name: 'Linear', slug: 'linear' }),
      ],
    });

    const request = new NextRequest('http://localhost:3000/api/companies?search=stripe&page=1&limit=10');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toBe('Stripe');
    expect(body.meta.total).toBe(1);
    expect(body.meta.page).toBe(1);
  });

  it('applies category filters correctly', async () => {
    // Seed with categorized companies
    // Assert filter behavior
  });

  it('returns 400 for invalid pagination params', async () => {
    const request = new NextRequest('http://localhost:3000/api/companies?page=0');
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(
      expect.objectContaining({ error: 'Invalid pagination parameters' })
    );
  });
});
```

### 4.4 Server Action Integration Tests

```typescript
// app/(student)/search/__tests__/search-actions.test.ts
import { searchCompanies } from '../actions';
import { prisma } from '@/lib/prisma';

describe('searchCompanies integration', () => {
  it('full-text search ranks relevant results higher', async () => {
    await prisma.company.createMany({
      data: [
        { name: 'Stripe', description: 'Payments infrastructure', slug: 'stripe' },
        { name: 'Strapi', description: 'Open source CMS', slug: 'strapi' },
        { name: 'Linear', description: 'Issue tracking', slug: 'linear' },
      ],
    });

    const results = await searchCompanies({ query: 'payment' });

    expect(results[0].name).toBe('Stripe');
    expect(results.map(r => r.name)).not.toContain('Linear');
  });
});
```

### 4.5 Auth Integration

```typescript
// middleware/__tests__/auth-middleware.test.ts
import { middleware } from '../middleware';
import { NextRequest, NextResponse } from 'next/server';

describe('Auth Middleware', () => {
  it('redirects unauthenticated users from protected routes', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const res = await middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/sign-in');
  });

  it('allows authenticated users to access protected routes', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/dashboard'), {
      headers: { cookie: 'session=valid_session_token' },
    });

    const res = await middleware(req);
    expect(res).toBe(NextResponse.next());
  });
});
```

### 4.6 Running Integration Tests

```bash
# Start test database
docker compose -f docker-compose.test.yml up -d

# Run integration tests
npm run test:integration

# With coverage
npm run test:integration:coverage
```

---

## 5. End-to-End (E2E) Testing

### 5.1 Framework & Tooling

| Tool | Purpose | Version |
|------|---------|---------|
| Playwright | E2E test framework | ^1.40 |
| @playwright/test | Test runner | ^1.40 |

**Rationale:** Playwright is chosen over Cypress for:
- Native parallel execution
- Multi-browser support (Chromium, Firefox, WebKit)
- Superior handling of modern web apps (hydration, streaming)
- Built-in trace viewer and screenshot comparison
- Faster execution through browser context isolation

### 5.2 E2E Directory Structure

```
e2e/
├── fixtures/
│   ├── auth.ts                    # Authentication helpers
│   └── companies.ts               # Seed data helpers
├── pages/
│   ├── login-page.ts              # Page Object Model
│   ├── student-dashboard-page.ts
│   ├── company-profile-page.ts
│   └── admin-dashboard-page.ts
├── specs/
│   ├── auth/
│   │   ├── sign-up.spec.ts
│   │   └── sign-in.spec.ts
│   ├── student/
│   │   ├── search-companies.spec.ts
│   │   ├── bookmark-company.spec.ts
│   │   ├── apply-to-internship.spec.ts
│   │   └── track-applications.spec.ts
│   ├── company/
│   │   ├── create-profile.spec.ts
│   │   ├── post-internship.spec.ts
│   │   └── manage-team.spec.ts
│   └── admin/
│       ├── verify-company.spec.ts
│       └── moderate-content.spec.ts
├── utils/
│   ├── test-utils.ts
│   └── selectors.ts
└── playwright.config.ts
```

### 5.3 Page Object Model (POM)

```typescript
// e2e/pages/student-dashboard-page.ts
import { Page, Locator } from '@playwright/test';

export class StudentDashboardPage {
  readonly searchInput: Locator;
  readonly companyCards: Locator;
  readonly bookmarkButtons: Locator;
  readonly applicationTrackerLink: Locator;

  constructor(readonly page: Page) {
    this.searchInput = page.getByRole('searchbox', { name: /search companies/i });
    this.companyCards = page.getByTestId('company-card');
    this.bookmarkButtons = page.getByRole('button', { name: /bookmark/i });
    this.applicationTrackerLink = page.getByRole('link', { name: /application tracker/i });
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async searchCompanies(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await this.page.waitForResponse(resp => resp.url().includes('/api/companies'));
  }

  async bookmarkFirstCompany() {
    await this.bookmarkButtons.first().click();
  }

  async expectCompanyCardVisible(companyName: string) {
    await expect(this.page.getByText(companyName)).toBeVisible();
  }
}
```

### 5.4 Critical User Paths (CUPs)

E2E tests are reserved for the following critical paths. No E2E test should cover functionality adequately tested at lower layers.

**CUP-1: Student Discovery Flow**

```typescript
// e2e/specs/student/search-companies.spec.ts
import { test, expect } from '@playwright/test';
import { StudentDashboardPage } from '../../pages/student-dashboard-page';
import { createTestCompany } from '../../fixtures/companies';

test.describe('Student Discovery Flow', () => {
  test('student searches, bookmarks, and views a company', async ({ page }) => {
    const dashboard = new StudentDashboardPage(page);
    await createTestCompany({ name: 'Vercel', slug: 'vercel' });

    await dashboard.goto();
    await dashboard.searchCompanies('Vercel');
    await dashboard.expectCompanyCardVisible('Vercel');

    await dashboard.bookmarkFirstCompany();

    // Verify bookmark persistence
    await page.reload();
    await expect(page.getByRole('button', { name: /bookmarked/i })).toBeVisible();
  });
});
```

**CUP-2: Application Submission Flow**

```typescript
// e2e/specs/student/apply-to-internship.spec.ts
test('student applies to an internship', async ({ page, context }) => {
  // Setup: Create company with active internship
  const company = await createTestCompany({ name: 'Figma' });
  const internship = await createTestInternship(company.id, { title: 'Product Design Intern' });

  // Authenticate as student
  await authenticateAsStudent(context, { email: 'student@example.com' });

  // Navigate and apply
  await page.goto(`/internships/${internship.id}`);
  await page.getByRole('button', { name: /apply now/i }).click();
  await page.getByLabel(/why are you interested/i).fill('I love design systems.');
  await page.getByRole('button', { name: /submit application/i }).click();

  // Assert success
  await expect(page.getByText(/application submitted/i)).toBeVisible();

  // Verify application appears in tracker
  await page.goto('/dashboard/applications');
  await expect(page.getByText('Product Design Intern')).toBeVisible();
});
```

**CUP-3: Company Onboarding Flow**

```typescript
// e2e/specs/company/create-profile.spec.ts
test('company creates and verifies profile', async ({ page, context }) => {
  await authenticateAsCompany(context, { email: 'founder@startup.com' });

  await page.goto('/company/onboarding');
  await page.getByLabel(/company name/i).fill('Acme Corp');
  await page.getByLabel(/website/i).fill('https://acme.com');
  await page.getByLabel(/description/i).fill('We build widgets.');
  await page.getByRole('button', { name: /create profile/i }).click();

  await expect(page).toHaveURL(/\/company\/dashboard/);
  await expect(page.getByText('Acme Corp')).toBeVisible();

  // Submit for verification
  await page.getByRole('button', { name: /request verification/i }).click();
  await expect(page.getByText(/verification pending/i)).toBeVisible();
});
```

**CUP-4: Admin Moderation Flow**

```typescript
// e2e/specs/admin/verify-company.spec.ts
test('admin approves pending company verification', async ({ page, context }) => {
  const company = await createTestCompany({ name: 'PendingCo', status: 'PENDING_VERIFICATION' });
  await authenticateAsAdmin(context, { email: 'admin@verity.com' });

  await page.goto('/admin/verification-queue');
  await page.getByText('PendingCo').locator('..').getByRole('button', { name: /verify/i }).click();

  await expect(page.getByText(/company verified/i)).toBeVisible();

  // Verify company is visible to students
  const studentPage = await context.newPage();
  await studentPage.goto('/companies');
  await expect(studentPage.getByText('PendingCo')).toBeVisible();
});
```

### 5.5 Authentication in E2E

```typescript
// e2e/fixtures/auth.ts
import { BrowserContext, Page } from '@playwright/test';

export async function authenticateAsStudent(
  context: BrowserContext,
  user: { email: string; userId?: string }
) {
  // Programmatically set Clerk session cookie
  await context.addCookies([
    {
      name: '__session',
      value: await generateTestSession(user),
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}

export async function authenticateAsAdmin(context: BrowserContext, user: { email: string }) {
  await authenticateAsStudent(context, user);
  // Set admin role in session metadata
  await context.addCookies([
    {
      name: '__role',
      value: 'admin',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
    },
  ]);
}
```

### 5.6 Test Isolation & Parallelization

Playwright runs tests in parallel by default. To prevent data collisions:

1. **Unique Data Per Test:** Every test creates uniquely named entities.
2. **Test-scoped Database:** Each worker process gets its own database schema.
3. **Global Setup/Teardown:** Clean up all test data after each run.

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'e2e-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.7 Visual Regression Testing

Playwright's screenshot comparison is used for critical UI components:

```typescript
// e2e/specs/visual/company-profile-visual.spec.ts
test.describe('Company Profile Visual Regression', () => {
  test('matches baseline for verified company', async ({ page }) => {
    await createTestCompany({ name: 'BaselineCo', status: 'VERIFIED' });
    await page.goto('/companies/baselineco');

    await expect(page).toHaveScreenshot('company-profile-verified.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });
});
```

Baseline screenshots are stored in `e2e/specs/visual/**/*.snapshots/` and committed to Git.

---

## 6. Accessibility Testing

### 6.1 Philosophy

Accessibility is not a feature—it is a requirement. Verity must be usable by everyone, including users relying on screen readers, keyboard navigation, and assistive technologies.

### 6.2 Automated Accessibility Testing

| Tool | Purpose | Integration |
|------|---------|--------------|
| axe-core | Accessibility rule engine | Jest + Testing Library |
| @axe-core/playwright | E2E accessibility scans | Playwright |
| eslint-plugin-jsx-a11y | Static JSX analysis | ESLint |
| storybook-addon-a11y | Component-level checks | Storybook |

### 6.3 Unit-Level Accessibility Tests

```typescript
// components/ui/__tests__/button.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('has no violations with default props', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no violations when disabled', async () => {
    const { container } = render(<Button disabled>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('associates label with aria-describedby when loading', async () => {
    const { getByRole } = render(<Button loading>Submit</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-describedby');
  });
});
```

### 6.4 E2E Accessibility Scans

```typescript
// e2e/specs/a11y/critical-pages.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Critical Page Accessibility', () => {
  const criticalPaths = [
    '/',
    '/sign-in',
    '/sign-up',
    '/dashboard',
    '/companies',
    '/internships',
    '/company/dashboard',
    '/admin/dashboard',
  ];

  for (const path of criticalPaths) {
    test(`page ${path} has no detectable a11y violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .exclude('[data-testid="marketing-animation"]') // Decorative content
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
```

### 6.5 Keyboard Navigation Testing

```typescript
// e2e/specs/a11y/keyboard-navigation.spec.ts
test('student dashboard is fully navigable by keyboard', async ({ page }) => {
  await page.goto('/dashboard');

  // Tab through all interactive elements
  const focusedElements: string[] = [];
  let previousFocus = '';

  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => document.activeElement?.tagName);
    const ariaLabel = await page.evaluate(() =>
      document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent
    );

    if (active === previousFocus) break; // Cycle complete
    previousFocus = active;
    focusedElements.push(`${active}: ${ariaLabel}`);
  }

  // Assert no focus traps and all critical elements reachable
  expect(focusedElements).toContain('A: Search companies');
  expect(focusedElements).toContain('BUTTON: Bookmark');
});
```

### 6.6 Screen Reader Testing

Manual screen reader testing is performed quarterly with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)

Test scenarios:
- Student signs up and searches for companies
- Company creates profile and posts internship
- Admin verifies a company

### 6.7 Accessibility Standards

| Standard | Target | Enforcement |
|----------|--------|-------------|
| WCAG 2.1 Level AA | Full compliance | Automated + manual |
| WCAG 2.1 Level AAA | Partial (where feasible) | Manual review |
| Section 508 | Compliance | Legal requirement |
| ARIA 1.2 | Best practices | Automated linting |

---

## 7. Performance Testing

### 7.1 Performance Budgets

| Metric | Budget | Tool |
|--------|--------|------|
| First Contentful Paint (FCP) | < 1.2s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Total Blocking Time (TBT) | < 200ms | Lighthouse |
| First Input Delay (FID) | < 100ms | CrUX |
| Interaction to Next Paint (INP) | < 200ms | CrUX |
| API Response Time (p95) | < 200ms | k6 |
| API Response Time (p99) | < 500ms | k6 |
| Database Query (p95) | < 50ms | pg_stat_statements |

### 7.2 Lighthouse CI

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/companies',
        'http://localhost:3000/dashboard',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 7.3 Load Testing with k6

```javascript
// perf/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 100 },   // Steady state
    { duration: '2m', target: 200 },   // Spike
    { duration: '5m', target: 200 },   // Sustained load
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://api.verity.com/api/companies?page=1&limit=20');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'has companies array': (r) => JSON.parse(r.body).data.length > 0,
  });

  sleep(1);
}
```

### 7.4 Database Performance Testing

```typescript
// perf/db-query-test.ts
import { prisma } from '@/lib/prisma';

describe('Database Query Performance', () => {
  it('company search completes under 50ms', async () => {
    const start = performance.now();

    await prisma.company.findMany({
      where: {
        OR: [
          { name: { search: 'Stripe' } },
          { description: { search: 'Stripe' } },
        ],
      },
      take: 20,
    });

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(50);
  });
});
```

### 7.5 Bundle Size Monitoring

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ...existing config
});
```

**Bundle Budgets:**
- Initial JS (shared): < 150 KB gzipped
- Student dashboard page: < 100 KB gzipped
- Company profile page: < 80 KB gzipped
- Admin dashboard: < 120 KB gzipped

---

## 8. Security Testing

### 8.1 Static Application Security Testing (SAST)

| Tool | Scope | Integration |
|------|-------|--------------|
| Semgrep | Custom security rules | CI pipeline |
| CodeQL | GitHub-native analysis | GitHub Actions |
| npm audit | Dependency vulnerabilities | CI pipeline |
| Snyk | Dependency + container scanning | CI + nightly |

### 8.2 Dynamic Application Security Testing (DAST)

| Tool | Scope | Frequency |
|------|-------|-----------|
| OWASP ZAP | Running application | Weekly |
| Burp Suite | Manual penetration testing | Quarterly |

### 8.3 Security Test Cases

#### 8.3.1 Authentication & Authorization

```typescript
// e2e/specs/security/rbac.spec.ts
test.describe('RBAC Security', () => {
  test('student cannot access company dashboard', async ({ page, context }) => {
    await authenticateAsStudent(context, { email: 'student@test.com' });
    await page.goto('/company/dashboard');
    expect(page.status()).toBe(403);
  });

  test('student cannot access admin endpoints', async ({ request }) => {
    const resp = await request.get('/api/admin/companies', {
      headers: { Cookie: 'session=student_session' },
    });
    expect(resp.status()).toBe(403);
  });

  test('company cannot edit another company profile', async ({ page, context }) => {
    await authenticateAsCompany(context, { email: 'company1@test.com', companyId: 'comp_1' });

    await page.goto('/company/comp_2/edit');
    expect(page.status()).toBe(403);
  });

  test('unauthenticated user is redirected from all protected routes', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/company/dashboard', '/admin/dashboard'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      expect(page.url()).toContain('/sign-in');
    }
  });
});
```

#### 8.3.2 Input Validation & Injection

```typescript
// e2e/specs/security/input-validation.spec.ts
test('SQL injection attempt is sanitized', async ({ request }) => {
  const resp = await request.get('/api/companies?search=\' OR \'1\'=\'1');
  expect(resp.status()).toBe(200);

  const body = await resp.json();
  // Should return empty results or standard results, not all records
  expect(body.data).toBeDefined();
});

test('XSS payload is escaped in company description', async ({ page }) => {
  const maliciousDescription = '<script>alert("xss")</script>';
  // Admin creates company with malicious description (simulated)

  await page.goto('/companies/malicious-co');
  const content = await page.content();

  // Script tag should not be rendered
  expect(content).not.toContain('<script>alert("xss")</script>');
  expect(content).toContain('&lt;script&gt;'); // Escaped
});
```

#### 8.3.3 Rate Limiting

```typescript
// e2e/specs/security/rate-limit.spec.ts
test('API rate limiting blocks excessive requests', async ({ request }) => {
  const requests = Array(150).fill(null).map(() =>
    request.get('/api/companies')
  );

  const responses = await Promise.all(requests);
  const tooManyRequests = responses.filter(r => r.status() === 429);

  expect(tooManyRequests.length).toBeGreaterThan(0);
});
```

### 8.4 Dependency Vulnerability Management

```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Daily

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/cwe-top-25
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      - name: Upload to Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 8.5 Secrets Scanning

```yaml
# .github/workflows/secrets.yml
name: Secret Detection
on: [push, pull_request]

jobs:
  detect-secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          extra_args: --debug --only-verified
```

---

## 9. Visual Regression Testing

### 9.1 Scope

Visual regression testing ensures that UI changes do not introduce unintended visual side effects. It is applied to:
- Design system components (Storybook + Chromatic)
- Critical user-facing pages (Playwright screenshots)
- Responsive breakpoints

### 9.2 Storybook + Chromatic

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    chromatic: {
      viewports: [320, 768, 1280, 1920],
      delay: 300, // Wait for animations
    },
  },
};

export default preview;
```

### 9.3 Playwright Screenshot Testing

Baseline screenshots are captured on `main` and stored in Git LFS. PRs trigger comparison jobs.

```yaml
# .github/workflows/visual-regression.yml
name: Visual Regression
on: [pull_request]

jobs:
  visual:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e:visual
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: visual-diff
          path: e2e/test-results/
```

---

## 10. Database Testing

### 10.1 Migration Testing

Every migration must be tested in three scenarios:
1. **Fresh install:** `prisma migrate deploy` on empty database
2. **Upgrade path:** `prisma migrate deploy` from previous version
3. **Rollback:** `prisma migrate resolve` to previous version

```typescript
// test/migrations/migration-test.ts
describe('Database Migrations', () => {
  it('applies all migrations successfully', () => {
    const result = execSync('npx prisma migrate deploy', { encoding: 'utf-8' });
    expect(result).toContain('All migrations have been successfully applied');
  });

  it('migration is idempotent', () => {
    // Run twice
    execSync('npx prisma migrate deploy');
    const second = execSync('npx prisma migrate deploy', { encoding: 'utf-8' });
    expect(second).toContain('No pending migrations');
  });
});
```

### 10.2 Seed Data Validation

```typescript
// test/seed/seed-validation.ts
describe('Seed Data', () => {
  it('creates valid companies with all required fields', async () => {
    const companies = await prisma.company.findMany();

    for (const company of companies) {
      expect(company.name).toBeTruthy();
      expect(company.slug).toMatch(/^[a-z0-9-]+$/);
      expect(company.status).toBeOneOf(['PENDING', 'VERIFIED', 'REJECTED']);
    }
  });
});
```

---

## 11. API Contract Testing

### 11.1 OpenAPI Schema Validation

Every API response must conform to the OpenAPI specification.

```typescript
// test/api/contract-test.ts
import { validateResponse } from 'openapi-validator';
import spec from '../../openapi.json';

describe('API Contract Compliance', () => {
  it('GET /api/companies matches OpenAPI schema', async () => {
    const response = await fetch('/api/companies?page=1&limit=10');
    const body = await response.json();

    const valid = validateResponse(spec, '/api/companies', 'get', 200, body);
    expect(valid.errors).toBeUndefined();
  });
});
```

### 11.2 Backward Compatibility

Breaking API changes are detected using `openapi-diff`:

```bash
npx openapi-diff openapi.prod.json openapi.pr.json --fail-on-incompatible
```

---

## 12. Test Data Management

### 12.1 Principles

- Never use production data in test environments.
- Factories over fixtures: Dynamic generation preferred over static files.
- Deterministic seeds: Faker uses a fixed seed in CI for reproducibility.
- Cleanup guarantee: Every test cleans up its data, even on failure.

### 12.2 Factory Architecture

```typescript
// test/factories/index.ts
export * from './company-factory';
export * from './internship-factory';
export * from './user-factory';
export * from './application-factory';

// test/factories/base-factory.ts
import { faker } from '@faker-js/faker';

export class BaseFactory<T> {
  constructor(private generator: (overrides?: Partial<T>) => T) {}

  create(overrides?: Partial<T>): T {
    return this.generator(overrides);
  }

  createMany(count: number, overrides?: Partial<T>): T[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
```

### 12.3 Database Seeding for E2E

```typescript
// e2e/global-setup.ts
import { prisma } from '@/lib/prisma';

async function globalSetup() {
  // Ensure clean test database
  await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS public CASCADE;');
  await prisma.$executeRawUnsafe('CREATE SCHEMA public;');
  await execSync('npx prisma migrate deploy');

  // Seed reference data
  await prisma.category.createMany({
    data: [
      { name: 'Fintech', slug: 'fintech' },
      { name: 'AI/ML', slug: 'ai-ml' },
      { name: 'DevTools', slug: 'devtools' },
    ],
  });
}

export default globalSetup;
```

---

## 13. Test Environments

### 13.1 Environment Matrix

| Environment | Purpose | Data | Database | URL |
|-------------|---------|------|----------|-----|
| Local | Development | Generated | Docker (local) | localhost:3000 |
| Test (CI) | Automated tests | Fresh per run | Docker (CI) | localhost:3000 |
| Staging | QA / Pre-prod | Snapshot of prod (anonymized) | RDS (staging) | staging.verity.com |
| Production | Live users | Real | RDS (production) | verity.com |

### 13.2 Environment Isolation Rules

- Test environments never share databases.
- API keys for third-party services use sandbox/test credentials in non-production.
- Clerk uses a separate test instance for staging.
- Cloudinary uses a separate test cloud.

---

## 14. CI/CD Test Pipeline

### 14.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run format:check

  unit-tests:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests

  integration-tests:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: verity_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5433:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5433/verity_test
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5433/verity_test
          CLERK_SECRET_KEY: ${{ secrets.CLERK_TEST_SECRET_KEY }}

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build:test
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  performance-tests:
    runs-on: ubuntu-latest
    needs: e2e-tests
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:perf

  security-scan:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=moderate
      - uses: returntocorp/semgrep-action@v1
        with:
          config: p/security-audit

  lighthouse:
    runs-on: ubuntu-latest
    needs: e2e-tests
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run lighthouse:ci
```

### 14.2 Pipeline Gates

| Stage | Gate | Failure Action |
|-------|------|-----------------|
| Lint & Typecheck | Zero errors | Block PR |
| Unit Tests | >80% coverage, all pass | Block PR |
| Integration Tests | All pass | Block PR |
| E2E Tests | Critical paths pass | Block PR |
| Security Scan | No high/critical vulnerabilities | Block PR |
| Performance | Lighthouse >90 | Warn, don't block |
| Accessibility | Lighthouse a11y = 100 | Block PR |

---

## 15. Test Matrix

### 15.1 Feature × Test Type Matrix

| Feature | Unit | Integration | E2E | A11y | Perf | Security |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| Authentication | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Student Sign Up | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Company Sign Up | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| **Student Portal** | | | | | | |
| Search Companies | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Filter by Category | ✅ | ✅ | ✅ | ✅ | — | — |
| View Company Profile | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Bookmark Company | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Bookmark Internship | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Apply to Internship | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Track Applications | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Edit Profile | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| **Company Portal** | | | | | | |
| Create Profile | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Edit Profile | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Post Internship | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Manage Internships | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Archive Internship | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| View Analytics | ✅ | ✅ | — | ✅ | ✅ | — |
| Manage Team | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Request Verification | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| **Admin Portal** | | | | | | |
| User Management | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Company Verification | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Moderate Content | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Manage Categories | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Manage Technologies | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| View Analytics | ✅ | ✅ | — | ✅ | ✅ | — |
| Handle Reports | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| **Search** | | | | | | |
| Full-text Search | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Autocomplete | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Filtering | ✅ | ✅ | ✅ | ✅ | — | — |
| Sorting | ✅ | ✅ | ✅ | ✅ | — | — |
| Pagination | ✅ | ✅ | ✅ | ✅ | — | — |
| **API** | | | | | | |
| Rate Limiting | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Pagination | ✅ | ✅ | — | — | — | — |
| Error Handling | ✅ | ✅ | ✅ | — | — | ✅ |
| **Infrastructure** | | | | | | |
| Database Migrations | — | ✅ | — | — | — | — |
| CDN Caching | — | ✅ | — | — | ✅ | — |
| Edge Functions | ✅ | ✅ | — | — | ✅ | — |

### 15.2 Browser × Device Matrix

| Browser | Desktop | Tablet | Mobile | Priority |
|---------|:---:|:---:|:---:|:---:|
| Chrome (latest) | ✅ | ✅ | ✅ | P0 |
| Firefox (latest) | ✅ | ✅ | — | P1 |
| Safari (latest) | ✅ | ✅ | ✅ | P0 |
| Edge (latest) | ✅ | — | — | P2 |
| Chrome (latest-1) | ✅ | — | — | P1 |
| Safari iOS | — | — | ✅ | P0 |
| Chrome Android | — | — | ✅ | P1 |

---

## 16. QA Checklist

### 16.1 Pre-Release QA Checklist

This checklist must be completed before any production deployment.

**Authentication & Onboarding**
- [ ] Student can sign up with email
- [ ] Student can sign in with existing account
- [ ] Student can reset password
- [ ] Company can sign up and create profile
- [ ] Company onboarding flow completes without errors
- [ ] Admin can access admin dashboard
- [ ] Unauthenticated users are redirected appropriately
- [ ] Session persists across page refreshes
- [ ] Logout clears session and redirects to home

**Student Experience**
- [ ] Search returns relevant results
- [ ] Search handles empty states gracefully
- [ ] Filters apply correctly (category, location, remote, visa)
- [ ] Company profile loads all sections
- [ ] Company profile displays correct data
- [ ] Bookmarking works and persists
- [ ] Bookmark list loads correctly
- [ ] Internship details page loads
- [ ] Application submission succeeds
- [ ] Application appears in tracker
- [ ] Application status updates reflect correctly
- [ ] Profile editing saves changes
- [ ] Profile image upload works (future)

**Company Experience**
- [ ] Company profile creation validates all fields
- [ ] Slug generation works correctly
- [ ] Profile editing updates all fields
- [ ] Internship posting validates required fields
- [ ] Internship appears in search after approval
- [ ] Internship archiving removes from active search
- [ ] Team member invitation works
- [ ] Team member permissions are enforced
- [ ] Analytics dashboard loads data
- [ ] Verification request submits correctly
- [ ] Company updates publish correctly

**Admin Experience**
- [ ] Verification queue displays pending companies
- [ ] Admin can approve company verification
- [ ] Admin can reject company verification
- [ ] Admin can edit any company profile
- [ ] Admin can edit any internship
- [ ] Admin can suspend user accounts
- [ ] Admin can manage categories
- [ ] Admin can manage technologies
- [ ] Reports page loads and functions
- [ ] Analytics display correctly

**Search & Discovery**
- [ ] Full-text search handles special characters
- [ ] Search results are ranked by relevance
- [ ] Autocomplete suggests relevant companies
- [ ] Empty search state is helpful
- [ ] No results state provides guidance
- [ ] Pagination works correctly
- [ ] URL reflects search state (shareable)

**Cross-Cutting Concerns**
- [ ] All pages have valid HTML
- [ ] No console errors in production build
- [ ] No 404s on critical paths
- [ ] Loading states are present for all async operations
- [ ] Error boundaries catch errors gracefully
- [ ] 404 page works for unknown routes
- [ ] 500 page displays for server errors
- [ ] All images have alt text
- [ ] Focus management works in modals
- [ ] Keyboard navigation is complete
- [ ] Color contrast meets WCAG AA
- [ ] Responsive design works on all breakpoints
- [ ] Touch targets are minimum 44x44px on mobile

**Performance**
- [ ] Lighthouse score > 90 on all critical pages
- [ ] LCP < 2.5s on 3G simulation
- [ ] API p95 response time < 200ms
- [ ] Database queries complete < 50ms
- [ ] No memory leaks in long-running sessions

**Security**
- [ ] No secrets in client-side bundles
- [ ] API endpoints validate all inputs
- [ ] RBAC prevents unauthorized access
- [ ] Rate limiting is active
- [ ] XSS payloads are escaped
- [ ] SQL injection attempts fail safely
- [ ] CSRF tokens present on forms
- [ ] Secure headers are set (CSP, HSTS, X-Frame-Options)

### 16.2 Regression Checklist (Per Sprint)

- [ ] All critical user paths (CUPs) pass in E2E
- [ ] Unit test coverage maintained > 80%
- [ ] No new accessibility violations
- [ ] No new security vulnerabilities
- [ ] Performance budgets maintained
- [ ] Database migrations are reversible
- [ ] API contracts remain backward-compatible

---

## 17. Bug Severity Classification

| Severity | Definition | Response Time | Resolution Target |
|----------|------------|----------------|---------------------|
| P0 - Critical | Production outage, data loss, security breach, complete feature failure | Immediate | 2 hours |
| P1 - High | Major feature broken, significant user impact, workaround exists | 4 hours | 24 hours |
| P2 - Medium | Feature partially broken, minor user impact, clear workaround | 24 hours | 1 week |
| P3 - Low | Cosmetic issue, edge case, negligible user impact | 1 week | Next sprint |

**Bug Report Template**

```markdown
**Severity:** P1
**Environment:** Staging
**Browser:** Chrome 120, macOS

**Steps to Reproduce:**
1. Navigate to /companies
2. Apply "Remote First" filter
3. Click on any company card

**Expected Result:**
Company profile loads with correct remote policy displayed.

**Actual Result:**
Page throws 500 error. Error in logs: "Cannot read property 'policy' of undefined".

**Screenshots:**
[attached]

**Console Errors:**
TypeError: Cannot read property 'policy' of undefined
at CompanyProfile (company-profile.tsx:45)

**Test Case ID:** E2E-COMPANY-003
```

---

## 18. Test Ownership & RACI

| Activity | QA Engineer | Software Engineer | Product Manager | DevOps |
|----------|:---:|:---:|:---:|:---:|
| Unit Test Writing | C | R/A | I | I |
| Integration Test Writing | C | R/A | I | I |
| E2E Test Writing | R/A | C | I | I |
| Accessibility Testing | R/A | C | I | I |
| Performance Testing | C | C | I | R/A |
| Security Testing | C | C | I | R/A |
| Test Environment Setup | C | C | I | R/A |
| CI/CD Pipeline Maintenance | C | C | I | R/A |
| Bug Triage | R/A | C | C | I |
| Release Sign-off | A | C | R | I |

**Legend:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 19. Metrics & Reporting

### 19.1 Quality Metrics Dashboard

The following metrics are tracked in Grafana/DataDog and reviewed weekly:

| Metric | Target | Alert Threshold |
|--------|--------|-------------------|
| Test Coverage (overall) | > 80% | < 75% |
| Unit Test Pass Rate | 100% | < 98% |
| Integration Test Pass Rate | 100% | < 95% |
| E2E Test Pass Rate | 100% | < 90% |
| Flaky Test Rate | < 1% | > 3% |
| Bug Escape Rate (bugs in prod) | < 2% per release | > 5% |
| Mean Time to Detect (MTTD) | < 1 hour | > 4 hours |
| Mean Time to Resolution (MTTR) | < 24 hours (P1) | > 48 hours |
| Accessibility Score | 100 | < 95 |
| Performance Score | > 90 | < 85 |

### 19.2 Test Reports

Automated reports are generated after every CI run:

```bash
# Generate combined report
npm run test:report

# Outputs:
# - coverage/
#   - lcov-report/
#   - html-report/
# - e2e/
#   - playwright-report/
#   - trace-viewer/
# - perf/
#   - k6-report/
# - a11y/
#   - axe-report/
```

---

## 20. Future Testing Evolution

### 20.1 AI Feature Testing (V2)

When AI features are introduced, the testing strategy will expand:

| Feature | Testing Approach |
|---------|--------------------|
| AI Resume Analysis | Golden dataset evaluation, bias testing, adversarial testing |
| Resume Matching | Precision/recall metrics, A/B testing framework |
| Cold Email Generation | Content safety filters, tone consistency checks, hallucination detection |
| Company Recommendation | Recommendation quality metrics, diversity metrics |

### 20.2 Scraper Testing (V2)

| Component | Testing Approach |
|-----------|--------------------|
| Scrapers | Mock HTML fixtures, rate limit compliance, error recovery |
| Data Pipeline | Schema validation, deduplication tests, freshness checks |

### 20.3 Chaos Engineering (V3+)

- Randomly terminate API instances
- Simulate database failover
- Test CDN edge failures
- Verify graceful degradation

---

## Appendix A: Test Commands Reference

```bash
# Development
npm run test:unit              # Unit tests (watch)
npm run test:unit:coverage     # Unit tests with coverage
npm run test:integration       # Integration tests
npm run test:e2e               # E2E tests (headless)
npm run test:e2e:ui            # E2E tests (UI mode)
npm run test:e2e:visual        # Visual regression
npm run test:perf              # Performance tests
npm run test:a11y              # Accessibility tests
npm run test:security          # Security scan
npm run test:all               # Full suite (CI)

# Utilities
npm run test:clean             # Clean test databases
npm run test:seed              # Seed test data
npm run test:report            # Generate combined report
```

## Appendix B: File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Unit test | `*.test.ts` | `format-date.test.ts` |
| Component test | `*.test.tsx` | `button.test.tsx` |
| Integration test | `*.spec.ts` | `companies-route.spec.ts` |
| E2E test | `*.spec.ts` | `search-companies.spec.ts` |
| Visual test | `*.visual.spec.ts` | `company-profile.visual.spec.ts` |
| A11y test | `*.a11y.test.ts` | `button.a11y.test.ts` |
| Performance test | `*.perf.ts` | `search-load.perf.ts` |
| Factory | `*-factory.ts` | `company-factory.ts` |
| Page Object | `*-page.ts` | `student-dashboard-page.ts` |
| Fixture | `*.ts` (in `fixtures/`) | `auth.ts` |

---

**Document Version:** 1.0.0
**Next Review Date:** 2026-08-03
