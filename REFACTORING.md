# Calendar Module Refactoring - Phase 1

## Overview

This document describes the Phase 1 refactoring of the Panda Family Calendar into a feature-based vertical slice architecture under `src/modules/calendar/`.

## Goals Achieved

✅ Reorganized code into a modular, feature-based structure  
✅ Separated concerns: domain, data, UI, and presentation  
✅ Preserved all existing functionality and Supabase integration  
✅ Added basic unit tests for validation logic  
✅ Created E2E test structure (requires Playwright installation)  
✅ Updated documentation

## New Structure

```
src/modules/calendar/
├── pages/
│   └── CalendarPage.tsx          # Main page (formerly src/pages/Index.tsx)
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
│   ├── types.ts                  # TypeScript interfaces (Event, EventFormData, etc.)
│   └── validators.ts             # Event validation logic (validateEventData, hasTimeOverlap)
├── data/
│   └── eventRepository.ts        # Supabase queries (CRUD operations)
├── hooks/
│   └── useEvents.ts              # React Query hooks
├── utils/
│   └── calendarUtils.ts          # Utility functions (formatting, date helpers)
└── index.ts                      # Public module API
```

## Migration Details

### Moved Files

| Original Location | New Location |
|-------------------|--------------|
| `src/pages/Index.tsx` | `src/modules/calendar/pages/CalendarPage.tsx` |
| `src/hooks/useEvents.ts` | `src/modules/calendar/hooks/useEvents.ts` |
| `src/components/WeeklyCalendar.tsx` | `src/modules/calendar/components/WeeklyCalendar.tsx` |
| `src/components/CalendarHeader.tsx` | `src/modules/calendar/components/CalendarHeader.tsx` |
| `src/components/BookingDialog.tsx` | `src/modules/calendar/components/BookingDialog.tsx` |
| `src/components/EventDetailsDialog.tsx` | `src/modules/calendar/components/EventDetailsDialog.tsx` |
| `src/components/BookingSlotForm.tsx` | `src/modules/calendar/components/BookingSlotForm.tsx` |
| `src/components/MonthSelector.tsx` | `src/modules/calendar/components/MonthSelector.tsx` |
| `src/utils/calendarUtils.ts` | `src/modules/calendar/utils/calendarUtils.ts` |

### New Files Created

- `src/modules/calendar/domain/types.ts` - Domain type definitions
- `src/modules/calendar/domain/validators.ts` - Validation logic
- `src/modules/calendar/data/eventRepository.ts` - Data access layer
- `src/modules/calendar/index.ts` - Module public API
- `tests/unit/calendar/eventValidation.test.ts` - Unit tests
- `tests/e2e/calendar.spec.ts` - E2E test structure
- `tests/setup.ts` - Test configuration
- `vitest.config.ts` - Vitest configuration

### Routes Updated

The calendar is now available at both routes:
- `/` - Root route (default)
- `/calendar` - Explicit calendar route

Both routes use the same `CalendarPage` component wrapped in `ProtectedRoute`.

## Architecture Principles

### 1. Separation of Concerns

- **Domain Layer** (`domain/`): Pure business logic, types, and validation rules
- **Data Layer** (`data/`): Supabase integration, no business logic
- **Presentation Layer** (`components/`, `pages/`): UI components, no direct DB access
- **Application Layer** (`hooks/`): React Query integration, state management

### 2. Dependency Direction

```
Pages → Hooks → Data Repository → Supabase
  ↓       ↓
Components
  ↓
Domain (types, validators)
```

### 3. Module Boundaries

The calendar module exports a clean public API through `src/modules/calendar/index.ts`:

```typescript
// Import from the module
import { CalendarPage, useEvents, validateEventData } from '@/modules/calendar';
```

## Testing

### Unit Tests

Located in `tests/unit/calendar/`, covering:
- Event validation logic
- Time overlap detection
- Edge cases for form validation

Run with: `npm run test`

### E2E Tests

Located in `tests/e2e/calendar.spec.ts`, covering:
- Create event flow
- Edit event flow
- Delete event flow
- Filter by family member
- Search functionality

**Note:** Requires Playwright installation and authenticated test user.

Run with: `npx playwright test`

## Supabase Integration

### Preserved Functionality

✅ User authentication with RLS  
✅ Events table with proper Row-Level Security  
✅ Real-time updates (via React Query invalidation)  
✅ CRUD operations for events  
✅ User-scoped data access

### Database Schema

The `events` table remains unchanged:
- All RLS policies active
- Triggers for `updated_at` intact
- Foreign key relationships preserved

## What Did NOT Change

- ❌ Backend: Still using Supabase (no BFF)
- ❌ Authentication: Same auth flow
- ❌ UI: Same components and design
- ❌ Features: All existing features work identically
- ❌ Dependencies: Only added testing libraries

## Next Steps (Out of Scope for Phase 1)

### Potential Phase 2
- Add contract testing with Pact or similar
- Implement OpenAPI spec for calendar API
- Add visual regression tests
- Add recurring events support
- Implement event reminders

### Potential Phase 3
- Multi-calendar support
- Shared calendars with other users
- Calendar sync with external services (Google Calendar, etc.)
- Export/import functionality

## Development Workflow

### Running the App

```sh
npm run dev
```

The calendar is available at `http://localhost:5173/` or `http://localhost:5173/calendar`

### Running Tests

```sh
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests (requires Playwright)
npx playwright test
```

### Adding New Features

1. **New domain logic** → Add to `domain/`
2. **New Supabase queries** → Add to `data/eventRepository.ts`
3. **New UI components** → Add to `components/`
4. **New hooks** → Add to `hooks/`
5. **Update tests** → Add unit tests for domain logic, E2E for user flows

## Rollback Plan

If issues arise, you can:

1. Revert `src/App.tsx` to use the old `Index` import
2. Restore `src/pages/Index.tsx` and `src/hooks/useEvents.ts` from git history
3. Remove the `src/modules/calendar/` directory

The old components in `src/components/` are kept temporarily for backward compatibility and can be removed once the migration is verified.

## Summary

This Phase 1 refactoring establishes a solid foundation for the calendar feature while maintaining all existing functionality. The new structure improves:

- **Maintainability**: Clear separation of concerns
- **Testability**: Isolated domain logic and data access
- **Scalability**: Easy to add new features within the module
- **Developer Experience**: Intuitive organization and clear APIs

All changes are backward compatible and preserve the existing Supabase integration.
