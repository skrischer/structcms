# Admin Dashboard (StructCMS)

## 1. Overview

The Admin Dashboard is the default entry screen of the StructCMS Admin UI.  
It provides editors with a high-level overview of content and quick access to core actions.

This feature is part of the MVP scope but intentionally minimal in functionality.

---

## 2. Goals

- Provide orientation after entering the Admin UI
- Surface key content metrics
- Enable quick access to primary workflows
- Establish a scalable entry point for future admin features

---

## 3. Non‑Goals (Out of Scope for MVP)

The following are explicitly excluded from this iteration:

- Traffic or analytics data
- SEO scoring or audits
- Broken link detection
- Draft/publish status widgets
- Localization progress
- User activity tracking
- Role/permission insights

---

## 4. Users

### Primary User
- Content editors managing marketing site content

### Secondary User
- Developers verifying CMS content state

---

## 5. Functional Requirements

### 5.1 KPI Overview

Display high-level content metrics as cards.

**Metrics:**

| KPI | Source Endpoint |
|-----|-----------------|
| Total Pages | GET /api/cms/pages |
| Total Media Files | GET /api/cms/media |
| Navigation Sets | GET /api/cms/navigation |
| Sections | From registry (admin context) |

**Requirements:**

- Values displayed as simple Counts (sections with name)
- No charts or historical trends
- No filtering

---

### 5.2 Recent Pages

Display a list of recently updated pages.

**Fields:**

- Page title
- Slug
- Last updated timestamp

**Behavior:**

- Sorted by `updatedAt DESC`
- Max 10 entries
- Click → opens Page Editor

---

### 5.3 Quick Actions

Provide shortcuts to primary workflows.

**Actions:**

- Create New Page
- Upload Media

**Behavior:**

- Buttons navigate to existing routes
- No modal creation in MVP

---

## 6. UX Requirements

### Layout Structure

```
Dashboard
│
├─ KPI Cards Row
│
├─ Recent Pages List
│
└─ Quick Actions
```

### Placement

- Accessible at `/admin` or `/admin/dashboard`
- Default landing route
- Linked in sidebar navigation

---

## 7. Technical Requirements

### 7.1 File Structure

```
packages/admin/src/components/dashboard/
  dashboard-page.tsx
  kpi-cards.tsx
  recent-pages.tsx
  quick-actions.tsx
```

---

### 7.2 Data Fetching

Use existing API client:

- `useApiClient()` hook for API calls
- `useAdmin()` hook for registry access
- No new endpoints required

---

### 7.3 Error Handling & Loading States

**Requirements:**

- Skeleton loaders for all KPI cards during data fetching
- Error boundaries for each dashboard section
- Graceful fallbacks for failed API calls:
  - KPI cards: Show "Error loading" with retry button
  - Recent pages: Show "Unable to load recent pages"
  - Quick actions: Always available (no API dependency)
- Parallel fetching with `Promise.allSettled()` to prevent partial failures
- Toast notifications for retry actions

---

### 7.4 Dependencies

No new external dependencies.

Leverage existing stack:

- React
- Tailwind
- shadcn/ui
- Admin context

---

## 8. Technical Implementation Details

### 8.1 Data Fetching Strategy

```typescript
// Parallel fetching with error resilience
const dashboardData = await Promise.allSettled([
  apiClient.get('/api/cms/pages'),
  apiClient.get('/api/cms/media'), 
  apiClient.get('/api/cms/navigation'),
]);

// Handle partial failures gracefully
const pages = dashboardData[0].status === 'fulfilled' ? dashboardData[0].value : null;
const media = dashboardData[1].status === 'fulfilled' ? dashboardData[1].value : null;
const navigation = dashboardData[2].status === 'fulfilled' ? dashboardData[2].value : null;
```

### 8.2 Sections KPI Calculation

```typescript
// Sections count from registry
const { registry } = useAdmin();
const sectionsCount = registry.getAllSections().length;
```

### 8.3 Navigation Patterns

**QuickActions Component:**
```typescript
export interface QuickActionsProps {
  onCreatePage: () => void;
  onUploadMedia: () => void;
}

// Usage: Navigate to existing routes, no modals in MVP
<QuickActions
  onCreatePage={() => onNavigate('/pages/new')}
  onUploadMedia={() => onNavigate('/media')}
/>
```

**RecentPages Component:**
```typescript
export interface RecentPagesProps {
  onSelectPage: (page: PageSummary) => void;
}

// Usage: Follow PageList pattern
<RecentPages
  onSelectPage={(page) => onNavigate(`/pages/${page.id}`)}
/>
```

### 8.4 Recent Pages API Strategy

```typescript
// Client-side filtering (consistent with PageList)
const pages = await apiClient.get('/api/cms/pages');
const recentPages = pages
  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  .slice(0, 10);
```

---

## 9. Performance Requirements

- Dashboard must load < 1s on average datasets
- Parallel API fetching allowed
- No blocking render on media thumbnails

---

## 10. Security Considerations

- Respect existing CMS auth middleware
- No additional permission model required for MVP

---

## 11. Future Expansion Hooks

Dashboard must be extensible to support:

- Draft/publish widgets
- Localization status
- SEO alerts
- Scheduled publishing
- Content health scoring

Design components modular to allow widget injection.

---

## 12. Acceptance Criteria

- Dashboard route exists and is default admin entry
- KPI cards display correct counts
- Recent pages list loads and links correctly
- Quick actions navigate to proper flows
- Responsive layout works on tablet viewport
- Loading states show during data fetching
- Error states display gracefully with retry options
- Sections KPI derives from registry correctly

---

## 13. Effort Estimate

| Task | Estimate |
|------|----------|
| Page scaffold | 0.5d |
| KPI cards | 0.5d |
| Recent pages list | 0.5d |
| Quick actions | 0.5d |
| Styling & polish | 0.5d |

**Total:** ~2–2.5 days

---

## 14. Definition of Done

- Implemented in Admin package
- Integrated into sidebar navigation
- Documented in Admin README
- Covered by basic UI tests
