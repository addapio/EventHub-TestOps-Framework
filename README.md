# EventHub TestOps Framework

End-to-end test automation for the [EventHub demo application](https://eventhub.rahulshettyacademy.com/login), built with Playwright and TypeScript. Follows the Page Object Model, runs in Docker, and integrates Playwright Test Agents / MCP for test planning and maintenance.

📊 **[View Test Reports](https://github.com/addapio/EventHub-TestOps-Framework/actions)** — download the latest `playwright-report` artifact from a workflow run

## Highlights

* End-to-end UI automation using Playwright
* TypeScript-based test implementation
* Page Object Model (POM) architecture
* Coverage of core EventHub user workflows
* Playwright Test Agents and MCP integration
* Dockerized test execution
* Automated CI execution with GitHub Actions

## Tech Stack

| Technology | Purpose |
|---|---|
| Playwright | End-to-end browser automation and testing |
| TypeScript | Test and Page Object implementation |
| Docker | Containerized, reproducible test execution |
| GitHub Actions | Continuous integration and automated test execution |
| Playwright Test Agents / MCP | Test planning, generation, and healing support |

## Test Coverage

| Test Area | Spec File |
|---|---|
| Account Registration | `tests/register-account.spec.ts` |
| Authentication & Session | `tests/authenticate-session.spec.ts` |
| Event Discovery | `tests/discover-events.spec.ts` |
| Ticket Booking | `tests/book-event.spec.ts` |
| Booking Management | `tests/manage-booking.spec.ts` |

Full step-by-step scenarios are documented in [`specs/eventhub-core-user-operations.plan.md`](./specs/eventhub-core-user-operations.plan.md).

## Project Structure

```text
EventHub-TestOps-Framework/
├── .github/
│   ├── agents/
│   └── workflows/
├── .playwright-mcp/
├── .vscode/
│   └── mcp.json
├── pages/
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── EventsPage.ts
│   ├── EventDetailsPage.ts
│   ├── BookingsPage.ts
│   └── BookingDetailsPage.ts
├── specs/
│   └── eventhub-core-user-operations.plan.md
├── tests/
│   ├── register-account.spec.ts
│   ├── authenticate-session.spec.ts
│   ├── discover-events.spec.ts
│   ├── book-event.spec.ts
│   └── manage-booking.spec.ts
├── Dockerfile
├── package.json
└── playwright.config.ts
```

## Running Tests

```bash
# Build the test image
docker build -t eventhub-tests .

# Run the full suite
docker run --rm eventhub-tests

# Run a single scenario
docker run --rm eventhub-tests npx playwright test tests/book-event.spec.ts

# Copy the HTML report out of the container
docker cp <container_id>:/app/playwright-report ./playwright-report
```

## CI/CD

Tests run automatically via GitHub Actions on push/PR (`.github/workflows/`). Each run installs dependencies, executes the full Playwright suite, and uploads the `playwright-report` as a workflow artifact — see the **Actions** tab.

## Test Agents & MCP

Playwright Test Agents (planner, generator, healer) live in `.github/agents/`, and MCP browser-interaction config is in `.vscode/mcp.json`, supporting test planning, generation, and maintenance alongside the core automation suite.
