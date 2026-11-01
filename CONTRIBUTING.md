# Contributing to Hulu-Bedeje

Thank you for contributing to Hulu-Bedeje, a web-based home-maintenance marketplace for urban Ethiopia.
Please follow this guide to keep our code consistent, high quality, and easy to work on together as a team.

---

# **1. Project Workflow Overview**

This project uses **GitHub Flow + Dev Branch**:

```
main        → stable code only (sprint releases)
dev         → integration branch for new work
feature/xyz → individual feature branches
bugfix/xyz  → bug fixes
hotfix/xyz  → urgent fixes to main
docs/xyz    → documentation changes
```

- **main**: Protected. Never commit directly. It only receives pull requests (PRs) from `dev` or `hotfix/` branches that have passed review and testing. At the end of each sprint, `dev` is merged into `main` and tagged (for example `v0.2-sprint2`).
- **dev**: Default branch for PRs. All work merges here first.
- **feature/**, **bugfix/**, **docs/**: Short-lived branches. Each one must be linked to a Jira ticket.

---

## Setting Up Your Environment

We all work in the shared team repository, so there is no need to fork it.

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your own local values
3. Install dependencies and run the app locally (see `README.md`)
4. Create a branch from **dev**

Example:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/hb-42-artisan-kyc-submission
```

**Tech stack:** Next.js (React) + Tailwind CSS on the frontend, Node.js + Express REST API on the backend, PostgreSQL with PostGIS for data, and Cloudinary (or similar) for file storage.

---

# **2. Technology stack**

Area Technology

---

Frontend Next.js and React
Styling Tailwind CSS
Backend Node.js and Express.js
Backend language JavaScript (ES modules)
Authentication and sessions Better Auth
Database PostgreSQL with PostGIS
File storage Cloudinary or approved equivalent
Unit testing Jest
API and integration testing Jest and Supertest
React component testing React Testing Library
End-to-end testing Playwright
Manual API testing Postman
Version control Git and GitHub

---

# **3. Branch Naming Rules**

Start the branch name with the Jira ticket key (in lowercase), then a short description.

| Type          | Format Example                             | Description       |
| ------------- | ------------------------------------------ | ----------------- |
| Feature       | `feature/hb-42-artisan-kyc-submission`     | New features      |
| Bug Fix       | `bugfix/hb-57-booking-status-not-updating` | Non-critical bugs |
| Hotfix        | `hotfix/hb-63-broken-auth-token`           | Critical fixes    |
| Documentation | `docs/hb-70-update-booking-api`            | Markdown edits    |

**Use lowercase + hyphens.**

---

# **4. Coding Standards**

### **General**

- Keep code modular and readable.
- Write clean and maintainable functions.
- Follow DRY, SOLID, and clean architecture principles.

### **Frontend (Next.js, React, Tailwind CSS)**

- Use modern ES6+ practices.
- Componentize the UI and reuse shared components.
- Use Tailwind utility classes and keep styles organized.
- Pages must work on desktop, tablet, and mobile browsers.
- Always handle loading and error states.
- Never rely on frontend route protection alone. Permissions are enforced on the backend.

### **Backend (Node.js, Express)**

- Use a controllers, services, repositories structure.
- Validate all incoming data on the server.
- Check authentication and the user's role (customer, artisan, administrator) on every protected endpoint.
- Booking status changes must follow the allowed lifecycle transitions, and each change must be recorded.
- Handle errors with proper status codes and a consistent JSON response, without exposing stack traces or database errors:

```json
{
  "success": false,
  "message": "Booking cannot be cancelled because the service is already in progress.",
  "code": "INVALID_BOOKING_STATE"
}
```

### **Authentication and authorization**

- Use Better Auth as the single authentication and session-management
  solution. Do not add a parallel custom JWT login system.
- Configure Better Auth on the backend and use its supported client
  integration in the frontend.
- Keep the Better Auth secret, database credentials, and Google OAuth
  client secret on the server.
- Configure trusted origins and credentialed CORS for the actual
  frontend origin.
- Use Better Auth to identify the user and validate sessions.
- Implement application-specific authorization in backend
  middleware/services. Authentication alone does not enforce booking
  ownership, artisan approval, or all business permissions.
- Application roles are `customer`, `artisan`, and `administrator`.
- Role assignment and changes must be controlled by trusted
  server-side operations, never by trusting a role sent by the
  browser.
- Artisan approval/KYC status is separate from the artisan role.
  Registration alone must not make an artisan discoverable.
- Authentication, authorization, session, OAuth, and role changes

### **Database**

- Use PostgreSQL with PostGIS.
- Change the application schema through reviewed migration files, not
  undocumented manual edits.
- Create Better Auth tables using the documented schema/migration
  workflow for the selected adapter. Commit and review those changes.
- Coordinate schema changes with the Technical Lead.
- Use fictional or anonymized data.
- Keep KYC documents private. Check authorization before granting file
  access and validate uploads on the server.

### **Testing**

- **Jest**: unit tests and test runner.
- **Supertest**: automated HTTP/API tests for Express.
- **React Testing Library**: React component behavior and user
  interactions.
- **Playwright**: end-to-end browser tests.
- **Postman**: manual API exploration when useful.

Cover: - Registration/login, KYC submission and review, booking
lifecycle, manual settlement, reviews, and disputes. - Data validation
and invalid input. - Authentication, sessions, and authorization. - Role
checks and resource ownership. - Access to bookings, messages, and
protected KYC documents. - Important error and boundary cases.

Testing levels: 1. Unit: individual functions and business rules. 2.
API: HTTP endpoints, status codes, and response bodies. 3. Integration:
interactions between components and the test database. 4. End-to-end:
complete workflows through the browser.

---

# **5. Commit Message Guidelines**

Follow **Conventional Commits**:

```
feat: add artisan KYC submission form
fix: correct booking status not updating after acceptance
docs: update booking API usage section
refactor: reorganize validation utils
test: add tests for booking status transitions
chore: update dependencies
```

Rules:

- Present tense
- Short title (< 60 chars)
- Optional body explaining the change
- Small, focused commits

---

# **6. Pull Request Guidelines (For Contributors)**

Before creating a PR:

✔️ Update your branch with the latest `dev`
✔️ Ensure your code builds and tests pass
✔️ Add or update documentation if needed
✔️ Make sure there are no console logs or debug code
✔️ Make sure no secrets or real personal data are included
✔️ Follow commit standards

Create a PR:

1. Push your branch:

```bash
git push -u origin feature/your-branch-name
```

2. Open a Pull Request **into `dev`**, NOT `main`.

3. PR Template Checklist:
   - Which Jira ticket does this cover? (for example `HB-42`)
   - What feature or fix does this add?
   - Screenshots or API samples (if applicable)
   - Steps to test the change
   - Any security considerations (roles, permissions, file access, personal data)

4. Assign:
   - **Reviewer**: at least one team member who did not write the code. Changes to authentication, authorization, or the database schema must also be reviewed by the **technical lead**.
   - **Labels** (feature, fix, hotfix, docs)

5. Merge only after at least one approval, passing checks, and resolved review comments.

---

# **7. Issue Tracking & Tickets (Jira)**

We use Jira for the product backlog and sprint boards. Every task should have:

- Title
- Description
- Acceptance criteria
- Screenshots (if UI)
- Priority (Must / Should / Could)
- Assignee
- Sprint

A task is **done** when:

- The acceptance criteria are met
- Tests pass and the code has been reviewed and merged into `dev`
- Role and permission checks are in place where relevant
- Any needed documentation is updated

Use the Jira key in the branch name, the PR title, and commits where useful. If a GitHub issue also exists, link it in the PR:

```
Closes #123
```

---

# **8. Communication Rules**

- Document all architectural decisions in `/docs/architecture/` and record scope or plan changes in the team decision log
- Large changes require a short Design Proposal
- Post a short stand-up update daily in the team Telegram group
- Discuss blockers immediately in Telegram, and tell the Scrum Master if a task will be more than two working days late
- Use GitHub Discussions for long-form decisions

---

# **9. Security & Sensitive Data Rules**

**Do NOT commit:**

- API keys (Cloudinary, map service, email or SMS providers)
- Database credentials, JWT or session secrets
- Environment variables
- Real personal information, such as real names, phone numbers, national ID numbers, or KYC documents, in sample or test data

Use `.env.example` instead of `.env`, and use fictional seed data for users, artisans, and bookings.

Passwords must always be hashed and must never be written to logs. KYC documents must only be reachable by authorized users.