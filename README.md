# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a6bae859-bda9-499a-bdb3-a6216e88582d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a6bae859-bda9-499a-bdb3-a6216e88582d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (auth, database, realtime)
- React Query (data fetching)

## Project Structure

The calendar feature is organized as a feature-based module under `src/modules/calendar/`:

```
src/modules/calendar/
├── pages/
│   └── CalendarPage.tsx          # Main calendar page component
├── components/
│   ├── WeeklyCalendar.tsx        # Weekly calendar grid
│   ├── CalendarHeader.tsx        # Navigation and date selector
│   ├── BookingDialog.tsx         # Create event dialog
│   ├── EventDetailsDialog.tsx    # Edit/delete event dialog
│   ├── BookingSlotForm.tsx       # Event form
│   ├── MonthSelector.tsx         # Month picker
│   ├── TimeSlot.tsx              # Individual time slot
│   └── TimeSlotOverlay.tsx       # Time slot overlay
├── domain/
│   ├── types.ts                  # TypeScript interfaces
│   └── validators.ts             # Event validation logic
├── data/
│   └── eventRepository.ts        # Supabase queries
├── hooks/
│   └── useEvents.ts              # React Query hooks
└── utils/
    └── calendarUtils.ts          # Utility functions
```

## Running Tests

### Unit Tests

Run unit tests for validation and domain logic:

```sh
npm run test
```

Run tests in watch mode:

```sh
npm run test:watch
```

### E2E Tests

To run end-to-end tests (requires Playwright):

```sh
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test

# Run with UI
npx playwright test --ui
```

**Note:** E2E tests require:
- A running development server (`npm run dev`)
- Valid Supabase credentials
- Test user authentication

## Backend (Supabase)

This project uses Supabase for:
- **Authentication:** User sign-up/sign-in with RLS
- **Database:** PostgreSQL with the `events` table
- **Realtime:** Live updates for collaborative calendars

### Database Schema

The `events` table includes:
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `title` (text)
- `type` (text)
- `family_member` (text)
- `start_time` (text)
- `end_time` (text)
- `date` (date)
- `notes` (text, optional)
- `created_at` / `updated_at` (timestamps)

Row-Level Security (RLS) ensures users can only access their own events.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a6bae859-bda9-499a-bdb3-a6216e88582d) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
