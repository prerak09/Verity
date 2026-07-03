# Verity — Deployment, Infrastructure & Operations Guide

**Version:** 1.0.0  
**Status:** Implementation-Ready  
**Last Updated:** 2026-07-03  
**Owner:** Platform / DevOps Team  
**Stakeholders:** Engineering, Security, Product, Leadership

---

## Table of Contents

1. [Deployment Philosophy](#1-deployment-philosophy)
2. [Local Development Setup](#2-local-development-setup)
3. [Environment Variables](#3-environment-variables)
4. [Docker Configuration](#4-docker-configuration)
5. [Database Operations](#5-database-operations)
6. [Vercel Deployment](#6-vercel-deployment)
7. [Cloudinary Configuration](#7-cloudinary-configuration)
8. [Clerk Configuration](#8-clerk-configuration)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Monitoring & Observability](#10-monitoring--observability)
11. [Logging](#11-logging)
12. [Backups & Disaster Recovery](#12-backups--disaster-recovery)
13. [Secrets Management](#13-secrets-management)
14. [Rollback Strategy](#14-rollback-strategy)
15. [Scaling Strategy](#15-scaling-strategy)
16. [Security Hardening](#16-security-hardening)
17. [Cost Optimization](#17-cost-optimization)
18. [Incident Response](#18-incident-response)
19. [Runbooks](#19-runbooks)
20. [Appendices](#20-appendices)

---

## 1. Deployment Philosophy

Verity follows a **"deploy early, deploy often, deploy safely"** philosophy. Every merge to `main` should be production-ready. We optimize for:

- **Reliability:** Production changes must be reversible within 5 minutes.
- **Observability:** Every deployment is tracked, measured, and alerted.
- **Automation:** No manual steps in the deployment process except explicit human approval gates.
- **Isolation:** Preview environments for every pull request; staging mirrors production.

### Deployment Principles

| Principle | Implementation |
|-----------|---------------|
| **Immutable Infrastructure** | Vercel deployments are atomic; no SSH into servers |
| **Infrastructure as Code** | Terraform for AWS resources; Vercel CLI for edge config |
| **GitOps** | Git is the single source of truth for all environments |
| **Zero-Downtime Deployments** | Blue/green via Vercel's atomic deploys |
| **Defense in Depth** | Multiple layers of validation before production |

---

## 2. Local Development Setup

### 2.1 Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| npm | 10.x | Package manager |
| PostgreSQL | 15.x | Database |
| Docker | 24.x | Containerization |
| Docker Compose | 2.x | Multi-container orchestration |
| Git | 2.40+ | Version control |

### 2.2 Repository Setup

```bash
# Clone the repository
git clone git@github.com:verity-platform/verity.git
cd verity

# Install dependencies
npm install

# Verify Node version
node -v  # Expected: v20.x.x

# Setup Git hooks
npx simple-git-hooks
```

### 2.3 Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values (see Section 3)

# Initialize database
docker compose up -d postgres
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

### 2.4 Development Services (Docker Compose)

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: verity-postgres
    environment:
      POSTGRES_USER: verity
      POSTGRES_PASSWORD: verity
      POSTGRES_DB: verity_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U verity"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: verity-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  mailpit:
    image: axllent/mailpit:latest
    container_name: verity-mailpit
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI
    volumes:
      - mailpit_data:/data

volumes:
  postgres_data:
  redis_data:
  mailpit_data:
```

```bash
# Start all development services
docker compose -f docker-compose.dev.yml up -d

# Verify health
docker compose -f docker-compose.dev.yml ps

# View logs
docker compose -f docker-compose.dev.yml logs -f postgres
```

### 2.5 Local Development URLs

| Service | URL | Credentials |
|---------|-----|--------------|
| Next.js App | http://localhost:3000 | — |
| Prisma Studio | http://localhost:5555 | — |
| Mailpit (Email) | http://localhost:8025 | — |
| PostgreSQL | localhost:5432 | verity/verity |

---

## 3. Environment Variables

### 3.1 Variable Classification

| Classification | Prefix | Storage | Example |
|-----------------|--------|---------|---------|
| Public | `NEXT_PUBLIC_` | Client + Server | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| Server-only | (none) | Server only | `DATABASE_URL` |
| Secret | (none) | Encrypted vault | `CLERK_SECRET_KEY` |

### 3.2 Required Environment Variables

**Application Core**

```env
# .env.example
# =============================================================================
# APPLICATION
# =============================================================================
NODE_ENV=development
VERITY_APP_URL=http://localhost:3000
VERITY_API_URL=http://localhost:3000/api

# =============================================================================
# DATABASE
# =============================================================================
DATABASE_URL="postgresql://verity:verity@localhost:5432/verity_dev"
# For connection pooling (production)
DATABASE_URL_DIRECT="postgresql://..."
DATABASE_URL_POOLED="postgresql://..."

# =============================================================================
# AUTHENTICATION (Clerk)
# =============================================================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# =============================================================================
# STORAGE (Cloudinary)
# =============================================================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=verity-uploads
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=verity/dev

# =============================================================================
# SEARCH
# =============================================================================
# PostgreSQL full-text search is built-in; no additional config required
# Future: Elasticsearch/OpenSearch
# SEARCH_PROVIDER=postgresql
# ELASTICSEARCH_URL=...

# =============================================================================
# MONITORING
# =============================================================================
# Sentry (future)
# SENTRY_DSN=https://...
# SENTRY_ORG=verity
# SENTRY_PROJECT=web

# Logtail (future)
# LOGTAIL_SOURCE_TOKEN=...

# =============================================================================
# FEATURE FLAGS
# =============================================================================
# Future: LaunchDarkly or Unleash
# FEATURE_FLAG_PROVIDER=launchdarkly
# LAUNCHDARKLY_SDK_KEY=...

# =============================================================================
# SECURITY
# =============================================================================
# Generate with: openssl rand -base64 32
VERITY_ENCRYPTION_KEY=...
VERITY_SESSION_SECRET=...

# Rate limiting (future Redis)
# UPSTASH_REDIS_REST_URL=...
# UPSTASH_REDIS_REST_TOKEN=...

# =============================================================================
# THIRD-PARTY INTEGRATIONS
# =============================================================================
# Future: SendGrid, Twilio, etc.
# SENDGRID_API_KEY=...
```

### 3.3 Environment-Specific Values

| Variable | Development | Staging | Production |
|----------|--------------|---------|-------------|
| NODE_ENV | development | production | production |
| VERITY_APP_URL | http://localhost:3000 | https://staging.verity.com | https://verity.com |
| DATABASE_URL | Local Docker | RDS Staging | RDS Production |
| CLOUDINARY_FOLDER | verity/dev | verity/staging | verity/prod |
| CLERK_SECRET_KEY | Test instance | Staging instance | Production instance |
| LOG_LEVEL | debug | info | warn |

### 3.4 Validation

All environment variables are validated at build time using Zod:

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  CLERK_SECRET_KEY: z.string().startsWith('sk_'),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  VERITY_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

Build fails if any required variable is missing or invalid.

---

## 4. Docker Configuration

### 4.1 Production Dockerfile

```dockerfile
# Dockerfile
# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# =============================================================================
# Stage 3: Runner
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Rationale:** Multi-stage build minimizes attack surface and image size. The final image contains only the compiled standalone Next.js output, static assets, and Prisma client—no source code, no dev dependencies.

### 4.2 Docker Compose (Production Simulation)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: verity-app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  postgres:
    image: postgres:15-alpine
    container_name: verity-postgres-prod
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: verity
    volumes:
      - postgres_prod:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    container_name: verity-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app

volumes:
  postgres_prod:
```

### 4.3 Building & Running Locally

```bash
# Build production image
docker build -t verity:latest .

# Run production simulation
docker compose -f docker-compose.prod.yml up -d

# Verify
curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"2026-07-03T..."}
```

---

## 5. Database Operations

### 5.1 PostgreSQL Setup

**Local Development**

```bash
# Start PostgreSQL
docker compose up -d postgres

# Create database
createdb -h localhost -U verity verity_dev

# Run migrations
npx prisma migrate dev

# Seed data
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

**Production (AWS RDS)**

```bash
# Connect to production (via bastion or VPN)
psql $DATABASE_URL

# Or using AWS CLI
aws rds describe-db-instances --query 'DBInstances[?DBName==`verity`]'
```

### 5.2 Migration Strategy

**Migration Rules**

1. All migrations are forward-only. No down migrations in production.
2. Migrations must be idempotent. Running twice produces the same result.
3. Migrations run before application deploy. Database schema must be compatible with new code.
4. Backwards-compatible changes only. Add columns before removing them; add tables before dropping them.

**Migration Workflow**

```bash
# 1. Create migration during development
npx prisma migrate dev --name add_company_verified_at

# 2. Review generated SQL
cat prisma/migrations/20240703_add_company_verified_at/migration.sql

# 3. Apply in staging
npx prisma migrate deploy
# Environment: DATABASE_URL=staging_url

# 4. Verify in staging
npx prisma migrate status

# 5. Deploy to production (automated in CI/CD)
npx prisma migrate deploy
# Environment: DATABASE_URL=production_url
```

**Migration Safety Checklist**

Before any migration reaches production:

- [ ] Migration has been tested on a copy of production data
- [ ] Migration completes in under 30 seconds (or uses background strategy)
- [ ] Migration is backwards-compatible with currently deployed code
- [ ] Rollback plan exists (even if forward-only)
- [ ] Migration has been reviewed by second engineer
- [ ] No locks on large tables during peak hours

### 5.3 Connection Pooling

Production uses PgBouncer or AWS RDS Proxy for connection pooling:

```env
# Direct connection (for migrations)
DATABASE_URL_DIRECT="postgresql://user:pass@host:5432/verity"

# Pooled connection (for application)
DATABASE_URL_POOLED="postgresql://user:pass@pooler-host:5432/verity?pgbouncer=true"
```

Prisma configuration:

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_POOLED")
  directUrl = env("DATABASE_URL_DIRECT")
}
```

### 5.4 Database Monitoring

```sql
-- Monitor slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 20;

-- Monitor connections
SELECT count(*), state 
FROM pg_stat_activity 
GROUP BY state;

-- Monitor table bloat
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 6. Vercel Deployment

### 6.1 Vercel Project Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| Framework Preset | Next.js | Native support |
| Build Command | `prisma generate && next build` | Generate Prisma client before build |
| Output Directory | `.next` | Standard Next.js output |
| Install Command | `npm install` | Standard npm |
| Node.js Version | 20.x | LTS |
| Region | iad1 (US East) | Primary user base |

### 6.2 Environment Variables in Vercel

Configure via Vercel Dashboard or CLI:

```bash
# Add production environment variable
vercel env add DATABASE_URL production
vercel env add CLERK_SECRET_KEY production
vercel env add CLOUDINARY_API_SECRET production

# Pull environment variables locally
vercel env pull .env.production.local
```

### 6.3 Deployment Branches

| Branch | Vercel Environment | URL Pattern | Auto-deploy |
|--------|---------------------|-------------|--------------|
| `main` | Production | verity.com | Yes |
| `staging` | Staging | staging.verity.com | Yes |
| `feature/*` | Preview | *.vercel.app | Yes |
| PRs | Preview | *.vercel.app | Yes |

### 6.4 Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-dashboard",
      "destination": "/dashboard",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/health",
      "destination": "/api/health"
    }
  ],
  "crons": [
    {
      "path": "/api/cron/cleanup-expired",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### 6.5 Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 6.6 Deployment Checklist

Before any production deployment:

- [ ] All tests pass in CI
- [ ] Staging environment verified
- [ ] Database migrations applied and verified
- [ ] Environment variables synced
- [ ] Feature flags configured (if applicable)
- [ ] Rollback plan documented
- [ ] On-call engineer notified
- [ ] Deployment window approved (if applicable)

---

## 7. Cloudinary Configuration

### 7.1 Account Setup

1. Create Cloudinary account: https://cloudinary.com
2. Configure cloud name: `verity-uploads`
3. Enable automatic backup
4. Configure upload presets

### 7.2 Upload Presets

| Preset | Folder | Transformations | Access |
|--------|--------|-------------------|--------|
| `company_logos` | verity/companies/logos | c_fill,w_200,h_200 | Public |
| `company_banners` | verity/companies/banners | c_fill,w_1200,h_400 | Public |
| `student_avatars` | verity/students/avatars | c_fill,w_400,h_400 | Public |
| `resume_uploads` | verity/students/resumes | — | Private (future) |

### 7.3 Next.js Image Configuration

```typescript
// components/cloudinary-image.tsx
import { CldImage } from 'next-cloudinary';

export function CompanyLogo({ publicId, alt }: { publicId: string; alt: string }) {
  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={200}
      height={200}
      crop="fill"
      gravity="auto"
      sizes="(max-width: 768px) 100px, 200px"
      className="rounded-lg"
    />
  );
}
```

### 7.4 Security

- Unsigned uploads disabled in production
- Upload presets restrict file types (jpg, png, webp) and max size (5MB)
- Moderation enabled for all user-generated images
- Backup enabled for all uploaded assets

---

## 8. Clerk Configuration

### 8.1 Application Setup

1. Create Clerk application at https://dashboard.clerk.com
2. Configure OAuth providers (Google, GitHub - future)
3. Set up JWT templates for custom claims

### 8.2 JWT Claims (Custom)

```json
{
  "sub": "user_123",
  "role": "student",
  "metadata": {
    "onboardingComplete": true,
    "companyId": null
  }
}
```

### 8.3 Webhook Configuration

```env
CLERK_WEBHOOK_SECRET=whsec_...
```

Webhook endpoints:

| Event | Endpoint | Action |
|-------|----------|--------|
| `user.created` | `/api/webhooks/clerk/user-created` | Create user record in database |
| `user.updated` | `/api/webhooks/clerk/user-updated` | Sync user metadata |
| `user.deleted` | `/api/webhooks/clerk/user-deleted` | Soft delete user data |
| `session.created` | `/api/webhooks/clerk/session-created` | Log audit event |
| `session.revoked` | `/api/webhooks/clerk/session-revoked` | Invalidate caches |

### 8.4 Clerk Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isStudentRoute = createRouteMatcher(['/dashboard(.*)', '/applications(.*)']);
const isCompanyRoute = createRouteMatcher(['/company(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  if (!userId && (isStudentRoute(req) || isCompanyRoute(req) || isAdminRoute(req))) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  
  const role = sessionClaims?.metadata?.role;
  
  if (isAdminRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  if (isCompanyRoute(req) && role !== 'company' && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|api/webhooks).*)'],
};
```

---

## 9. CI/CD Pipeline

### 9.1 Git Workflow

```
main (production)
  ↑
develop (integration)
  ↑
feature/student-search
  ↑
feature/company-analytics
```

| Branch | Purpose | Merge Strategy |
|--------|---------|-----------------|
| `main` | Production code | Squash merge from develop |
| `develop` | Integration branch | Merge commit from features |
| `feature/*` | Individual features | Squash merge to develop |
| `hotfix/*` | Production fixes | Merge to main and develop |
| `release/*` | Release preparation | Merge to main |

### 9.2 GitHub Actions Workflows

**Main CI/CD Pipeline**

```yaml
# .github/workflows/main.yml
name: Main CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  validate:
    name: Validate
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

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit:coverage
      - run: npm run test:integration
      - uses: codecov/codecov-action@v3

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.verity.com
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
      - name: Deploy to Vercel (Staging)
        run: vercel --token=${{ secrets.VERCEL_TOKEN }} --yes
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
      - name: Run Migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_STAGING }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://verity.com
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
      - name: Deploy to Vercel (Production)
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }} --yes
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_PRODUCTION }}
      - name: Run Migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_PRODUCTION }}
      - name: Purge CDN Cache
        run: curl -X POST "https://api.vercel.com/v1/integrations/deploy/${{ secrets.VERCEL_DEPLOY_HOOK }}"
```

### 9.3 Deployment Gates

| Gate | Required For | Approver |
|------|----------------|----------|
| CI Pass | All environments | Automated |
| E2E Pass | Staging, Production | Automated |
| Security Scan | Production | Automated |
| Performance Budget | Production | Automated |
| Manual QA | Production | QA Lead |
| Engineering Review | Production | Tech Lead |
| Product Sign-off | Production | Product Manager |

### 9.4 Feature Flags (Future)

```typescript
// lib/features.ts
import { createClient } from '@vercel/edge-config';

const edgeConfig = createClient(process.env.EDGE_CONFIG);

export async function isFeatureEnabled(feature: string): Promise<boolean> {
  const features = await edgeConfig.get('features');
  return features?.[feature]?.enabled ?? false;
}

// Usage in component
const showAIRecommendations = await isFeatureEnabled('ai-recommendations');
```

---

## 10. Monitoring & Observability

### 10.1 Monitoring Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| APM | Vercel Analytics + Sentry | Performance monitoring, error tracking |
| Logs | Vercel Logs + Logtail | Centralized logging |
| Infrastructure | AWS CloudWatch | RDS, ALB metrics |
| Uptime | Pingdom / UptimeRobot | External health checks |
| Status Page | Statuspage.io | Public status communication |

### 10.2 Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
    version: process.env.VERITY_VERSION || 'unknown',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error('Health check failed:', error);
  }

  const status = checks.database ? 200 : 503;
  return NextResponse.json(checks, { status });
}
```

### 10.3 Alerting Rules

| Alert | Condition | Severity | Notification |
|-------|-----------|----------|----------------|
| High Error Rate | > 1% errors in 5 min | P1 | PagerDuty + Slack |
| API Latency | p95 > 500ms for 5 min | P1 | PagerDuty + Slack |
| Database Connections | > 80% of max | P1 | PagerDuty |
| 5xx Rate | > 0.1% in 5 min | P0 | PagerDuty + Phone |
| Disk Usage | > 85% | P2 | Slack |
| Memory Usage | > 90% | P2 | Slack |
| SSL Expiry | < 30 days | P2 | Email |

### 10.4 Dashboards

**Vercel Analytics Dashboard**
- Core Web Vitals (LCP, FID, CLS, INP)
- Page load distribution
- Geography breakdown
- Device breakdown

**Sentry Dashboard**
- Error rate by release
- Top issues
- Performance transactions
- User impact score

**Custom Grafana Dashboard**
- API request rate
- Database query performance
- Cache hit/miss ratio
- Active user sessions

---

## 11. Logging

### 11.1 Log Levels

| Level | Usage | Production Default |
|-------|-------|----------------------|
| `debug` | Development tracing | Off |
| `info` | Normal operations | On |
| `warn` | Recoverable issues | On |
| `error` | Failed operations | On |
| `fatal` | System-critical failures | On |

### 11.2 Structured Logging

```typescript
// lib/logger.ts
import { Logger } from 'next-axiom';

export const logger = new Logger({
  source: 'verity-web',
  metadata: {
    service: 'web',
    environment: process.env.NODE_ENV,
    version: process.env.VERITY_VERSION,
  },
});

// Usage
logger.info('Company profile viewed', {
  companyId: 'comp_123',
  userId: 'user_456',
  duration: 45,
});

logger.error('Database connection failed', {
  error: err.message,
  query: 'SELECT * FROM companies',
  retryCount: 3,
});
```

### 11.3 Log Retention

| Environment | Retention | Storage |
|--------------|-----------|---------|
| Development | 7 days | Local files |
| Staging | 30 days | CloudWatch |
| Production | 90 days | CloudWatch + S3 archive |

### 11.4 Sensitive Data Handling

Never log:
- Passwords
- API keys
- Session tokens
- Personal identifiable information (PII) without encryption
- Credit card numbers (future)

Redaction:

```typescript
// Automatically redact sensitive fields
logger.info('User updated profile', {
  userId: 'user_123',
  email: '[REDACTED]',
  password: '[REDACTED]',
  preferences: { theme: 'dark' },
});
```

---

## 12. Backups & Disaster Recovery

### 12.1 Backup Strategy

| Data | Frequency | Retention | Method |
|------|-----------|------------|--------|
| PostgreSQL | Continuous + Daily | 35 days | RDS automated backups + manual snapshots |
| PostgreSQL | Weekly | 1 year | Manual snapshot to S3 |
| Cloudinary | Real-time | Permanent | Cloudinary backup + S3 sync |
| Application Code | Every commit | Permanent | Git |
| Environment Config | On change | 1 year | Terraform state + S3 |

### 12.2 RDS Backup Configuration

```bash
# Automated backups
aws rds modify-db-instance \
  --db-instance-identifier verity-prod \
  --backup-retention-period 35 \
  --preferred-backup-window "03:00-04:00" \
  --apply-immediately

# Manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier verity-prod \
  --db-snapshot-identifier verity-prod-$(date +%Y%m%d)
```

### 12.3 Disaster Recovery Plan

**RTO/RPO Targets**

| Scenario | RTO | RPO |
|----------|-----|-----|
| Database corruption | 1 hour | 5 minutes |
| Region outage | 4 hours | 1 hour |
| Complete infrastructure loss | 8 hours | 1 hour |
| Data deletion (malicious) | 4 hours | 1 hour |

**Recovery Procedures**

*Scenario 1: Database Point-in-Time Recovery*

```bash
# 1. Identify recovery point
# 2. Restore to new instance
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier verity-prod \
  --target-db-instance-identifier verity-prod-recovery \
  --restore-time "2026-07-03T10:00:00Z"

# 3. Verify data integrity
# 4. Update application DATABASE_URL
# 5. Decommission old instance
```

*Scenario 2: Complete Environment Rebuild*

```bash
# 1. Provision new infrastructure
terraform apply -var="environment=recovery"

# 2. Restore database from latest snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier verity-recovery \
  --db-snapshot-identifier verity-prod-latest

# 3. Deploy application
vercel --prod

# 4. Verify health checks
curl https://verity.com/api/health

# 5. Update DNS
```

### 12.4 Backup Testing

Quarterly backup restoration tests are mandatory:

1. Restore latest backup to isolated environment
2. Verify application functionality
3. Run smoke tests
4. Document recovery time
5. Report gaps in RTO/RPO achievement

---

## 13. Secrets Management

### 13.1 Secret Classification

| Tier | Examples | Storage |
|------|----------|---------|
| Tier 1: Critical | Database passwords, Clerk secret keys, API master keys | AWS Secrets Manager + Vercel encrypted |
| Tier 2: Sensitive | OAuth client secrets, webhook signing secrets | Vercel encrypted env vars |
| Tier 3: Internal | Service URLs, non-prod API keys | Vercel env vars |
| Tier 4: Public | Publishable keys, feature flags | Client-side env vars |

### 13.2 AWS Secrets Manager

```bash
# Store secret
aws secretsmanager create-secret \
  --name verity/prod/database \
  --secret-string '{"username":"verity","password":"..."}'

# Retrieve in application
const secret = await secretsManager.getSecretValue({
  SecretId: 'verity/prod/database'
}).promise();
```

### 13.3 Rotation Policy

| Secret Type | Rotation Frequency | Method |
|--------------|----------------------|--------|
| Database passwords | 90 days | Automated (AWS Lambda) |
| API keys | 180 days | Manual |
| Clerk webhook secrets | 365 days | Manual |
| OAuth credentials | 180 days | Manual |

### 13.4 Secret Access Audit

All secret access is logged:

```json
{
  "event": "SECRET_ACCESS",
  "secretId": "verity/prod/database",
  "accessedBy": "arn:aws:iam::123456789012:role/verity-app",
  "timestamp": "2026-07-03T12:00:00Z",
  "sourceIp": "10.0.1.100"
}
```

---

## 14. Rollback Strategy

### 14.1 Vercel Rollback

```bash
# List recent deployments
vercel ls verity --meta

# Rollback to previous deployment
vercel --yes

# Or rollback to specific deployment
vercel rollback <deployment-id>
```

### 14.2 Database Rollback

Forward-only migrations. If a migration causes issues:

1. **Immediate:** Fix forward with new migration
2. **If data corruption:** Restore from backup to pre-migration state
3. **Never:** Run `prisma migrate down` in production

### 14.3 Rollback Decision Tree

```
Issue Detected
    │
    ├─ Critical (P0)?
    │   ├─ YES → Immediate Vercel rollback (1 click)
    │   │        → Assess database state
    │   │        → Fix forward or restore from backup
    │   └─ NO → Can fix with new deployment?
    │            ├─ YES → Deploy hotfix
    │            └─ NO → Rollback to last known good
    │
    └─ Data issue?
         ├─ YES → Stop writes immediately
         │        → Assess scope
         │        → Restore from backup if needed
         └─ NO → Standard rollback procedure
```

### 14.4 Rollback Checklist

- [ ] Identify last known good deployment
- [ ] Notify team via #incidents channel
- [ ] Execute Vercel rollback
- [ ] Verify rollback success (health checks)
- [ ] Assess database state
- [ ] If needed, restore database from backup
- [ ] Document incident timeline
- [ ] Schedule post-mortem

---

## 15. Scaling Strategy

### 15.1 Current Architecture (V1)

Vercel (Serverless) + RDS PostgreSQL (Single AZ)

### 15.2 Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| API requests/min | > 10,000 | Enable Vercel Edge Functions |
| Database CPU | > 70% | Scale RDS instance size |
| Database connections | > 80% | Enable RDS Proxy |
| API latency p95 | > 300ms | Enable caching layer |
| Storage requests | > 1,000/min | Cloudinary CDN optimization |

### 15.3 Scaling Roadmap

| Phase | Trigger | Architecture |
|-------|---------|----------------|
| V1 | 0-10K users | Vercel + RDS Single AZ |
| V2 | 10K-100K users | Vercel + RDS Multi-AZ + Read Replicas |
| V3 | 100K-1M users | Vercel + RDS Multi-AZ + ElastiCache Redis + CDN |
| V4 | 1M+ users | Microservices + Kubernetes + Multi-region |

### 15.4 Database Scaling

```bash
# Scale RDS instance
aws rds modify-db-instance \
  --db-instance-identifier verity-prod \
  --db-instance-class db.r6g.xlarge \
  --apply-immediately

# Add read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier verity-prod-replica-1 \
  --source-db-instance-identifier verity-prod

# Enable connection pooling
aws rds create-db-proxy \
  --db-proxy-name verity-proxy \
  --engine-family POSTGRESQL \
  --auth ProxyAuthentication \
  --role-arn arn:aws:iam::123456789012:role/verity-rds-proxy
```

---

## 16. Security Hardening

### 16.1 Security Headers

All security headers are configured in `vercel.json` and `next.config.js` (see Section 6.4).

### 16.2 Content Security Policy

```typescript
// middleware.ts (CSP addition)
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.verity.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://res.cloudinary.com https://img.clerk.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

export default clerkMiddleware(async (auth, req) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('Content-Security-Policy', cspHeader.replace(/\s+/g, ' ').trim());
  
  // ... rest of middleware
});
```

### 16.3 DDoS Protection

- **Vercel Edge Network:** Automatic DDoS mitigation
- **Rate Limiting:** 100 requests/minute per IP (API routes)
- **AWS Shield:** Standard protection for RDS

### 16.4 Penetration Testing

- **Quarterly:** External penetration test by third-party security firm
- **Annual:** SOC 2 Type II audit (future)
- **Continuous:** Automated SAST/DAST in CI

---

## 17. Cost Optimization

### 17.1 Cost Monitoring

| Service | Budget Alert | Optimization |
|---------|----------------|----------------|
| Vercel | $500/month | Use Edge Functions for high-traffic APIs |
| RDS | $300/month | Use Reserved Instances for baseline |
| Cloudinary | $100/month | Optimize image formats, use eager transforms |
| S3 (backups) | $50/month | Lifecycle policies to Glacier |
| Clerk | $200/month | Monitor MAU growth |

### 17.2 Cost-Saving Measures

- **Image Optimization:** Use `next/image` with Cloudinary for automatic format selection
- **Connection Pooling:** Prevent RDS connection exhaustion
- **Edge Caching:** Cache static assets at CDN edge
- **Serverless:** Pay only for compute used
- **Reserved Capacity:** Purchase Reserved Instances for predictable baseline

---

## 18. Incident Response

### 18.1 Severity Levels

| Level | Definition | Response Time | Communication |
|-------|-------------|----------------|-----------------|
| SEV-1 | Complete outage, data loss, security breach | 15 min | All hands + status page |
| SEV-2 | Major feature degraded, significant user impact | 1 hour | Engineering + support |
| SEV-3 | Minor feature issue, workaround exists | 4 hours | Engineering team |
| SEV-4 | Cosmetic, no user impact | 1 day | Backlog |

### 18.2 Incident Response Playbook

**Phase 1: Detection (0-5 min)**
1. Alert fires (PagerDuty/Slack)
2. On-call engineer acknowledges
3. Quick assessment: SEV level
4. Create incident channel: `#incident-YYYY-MM-DD-sev-X`

**Phase 2: Response (5-30 min)**
1. Gather context (logs, metrics, recent deployments)
2. Identify scope (affected users, regions, features)
3. If SEV-1 or SEV-2: Stop the bleeding
   - Rollback deployment if recent
   - Disable feature flag if applicable
   - Scale up resources if capacity issue

**Phase 3: Resolution (30 min - 4 hours)**
1. Implement fix or workaround
2. Verify fix with monitoring
3. Confirm user impact resolved

**Phase 4: Post-Incident (24-72 hours)**
1. Write incident report
2. Schedule post-mortem
3. Identify action items
4. Update runbooks

### 18.3 Communication Templates

**SEV-1 Initial Notice:**

```
🚨 SEV-1 Incident Declared
Time: 2026-07-03 14:00 UTC
Impact: Verity.com is unavailable
Status: Investigating
Engineer: @oncall
Channel: #incident-2026-07-03-sev-1
```

**Status Page Update:**

```
[Investigating] Verity Platform Outage
We are investigating reports of degraded performance on the Verity platform.
All teams have been notified and are working on resolution.
Updated: 2026-07-03 14:15 UTC
```

---

## 19. Runbooks

### 19.1 Runbook: Database Connection Exhaustion

**Symptoms:** API latency spikes, error logs show "too many connections"

**Steps:**
1. Check current connections: `SELECT count(*) FROM pg_stat_activity;`
2. Identify idle connections: `SELECT * FROM pg_stat_activity WHERE state = 'idle';`
3. If > 80% capacity:
   - Enable RDS Proxy if not already active
   - Restart application servers to clear connection pool
   - Scale RDS instance class if sustained load
4. Monitor for 15 minutes post-resolution

### 19.2 Runbook: High Error Rate

**Symptoms:** Sentry alerts firing, error rate > 1%

**Steps:**
1. Check Sentry for top error
2. Identify recent deployment: `vercel ls`
3. If error correlates with deployment:
   - Rollback immediately: `vercel --yes`
   - Verify rollback success
4. If not deployment-related:
   - Check database health
   - Check third-party service status (Clerk, Cloudinary)
   - Check for traffic anomaly (DDoS, viral content)

### 19.3 Runbook: SSL Certificate Expiry

**Symptoms:** Users report security warnings

**Steps:**
1. Vercel handles SSL automatically
2. If custom domain:
   - Check certificate status in Vercel dashboard
   - Force renewal if needed
3. Verify with SSL Labs test

### 19.4 Runbook: Clerk Authentication Down

**Symptoms:** Users cannot sign in, Clerk status page shows incident

**Steps:**
1. Check Clerk status page: https://status.clerk.com
2. If Clerk degraded:
   - Enable maintenance mode (feature flag)
   - Display user-friendly message
   - Monitor Clerk status
3. If Clerk down:
   - Implement emergency bypass (if architecturally safe)
   - Notify users via email/status page

---

## 20. Appendices

### Appendix A: Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server locally
npm run lint              # ESLint
npm run typecheck         # TypeScript check

# Database
npx prisma migrate dev    # Create/apply migrations
npx prisma migrate deploy # Apply migrations (production)
npx prisma db seed        # Seed database
npx prisma studio         # Open Prisma Studio
npx prisma generate       # Generate Prisma client

# Testing
npm run test:unit         # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e          # E2E tests
npm run test:all          # Full test suite

# Deployment
vercel                    # Deploy to preview
vercel --prod             # Deploy to production
vercel --yes              # Deploy without prompt
vercel ls                 # List deployments
vercel rollback           # Rollback to previous

# Docker
docker compose up -d      # Start services
docker compose down       # Stop services
docker compose logs -f    # Follow logs
docker build -t verity .  # Build production image

# AWS
aws rds describe-db-instances
aws s3 ls verity-backups
aws secretsmanager list-secrets
```

### Appendix B: Contact Information

| Role | Contact | Escalation |
|------|---------|-------------|
| On-Call Engineer | PagerDuty | CTO |
| Security Lead | security@verity.com | CTO |
| Infrastructure | platform@verity.com | CTO |
| Product Emergency | product@verity.com | CEO |

### Appendix C: External Resources

| Service | Status Page | Support |
|---------|--------------|---------|
| Vercel | https://www.vercel-status.com | support@vercel.com |
| Clerk | https://status.clerk.com | support@clerk.dev |
| Cloudinary | https://status.cloudinary.com | support@cloudinary.com |
| AWS | https://health.aws.amazon.com | AWS Support |
| PostgreSQL | N/A | Community |

### Appendix D: Infrastructure Diagram

```
User Browser
     │
Cloudflare DNS
     │
Vercel Edge Network
     │
Next.js Application ──── Clerk Auth
     │
RDS PostgreSQL      Cloudinary CDN
     │                     │
S3 Backups          Sentry / Vercel Analytics / CloudWatch (Monitoring)
```

---

**Document Version:** 1.0.0  
**Next Review Date:** 2026-08-03  
**Infrastructure Last Verified:** 2026-07-03
