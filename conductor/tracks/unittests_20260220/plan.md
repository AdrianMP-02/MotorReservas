# Track Plan: Unit Testing

Status: completed

## Phase 1: Setup and Configurations
- [x] Task 1.1: Verify `package.json` scripts and structure (`"test"`, `"test:watch"`, `"test:cov"`).
- [x] Task 1.2: Check if any default generated `*.spec.ts` files are failing and delete/fix them.

## Phase 2: Core Services Testing
- [x] Task 2.1: Write tests for `inventory.service.ts` focusing on exceptions and successful retrievals.
- [x] Task 2.2: Write tests for `booking.service.ts` focusing on distributed lock simulation and successful bookings.

## Phase 3: Consumer Testing
- [x] Task 3.1: Write a basic test for `booking.processor.ts` resolving mocked `bullmq` jobs.
- [x] Task 3.2: Run `npm run test:cov` to gather coverage data and review.
