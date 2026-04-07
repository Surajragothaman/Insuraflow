---
name: enterprise-ux
description: UX/UI guidelines for enterprise SaaS applications — layout patterns, component rules, data-testid conventions, and design tone
metadata:
  filePattern:
    - "frontend/**/*.tsx"
    - "frontend/**/*.ts"
    - "app/**/*.tsx"
    - "components/**/*.tsx"
    - "src/**/*.tsx"
  bashPattern: []
  priority: 80
---

# Enterprise SaaS UX/UI Guidelines

These rules govern all UI generation for enterprise operations platforms. They apply to any internal tool, BPO platform, finance system, admin panel, or data-heavy SaaS application.

---

## 1. Core Principle

Enterprise platforms prioritize **clarity, auditability, data density, and workflow efficiency** over aesthetics.

Reference products for design patterns:
- Stripe Dashboard
- Linear
- GitHub
- Jira
- Retool
- Notion admin panels

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js (App Router) | Server Components by default, `'use client'` only when needed |
| UI Library | shadcn/ui | Source-copied components, never modified in `components/ui/` |
| Styling | Tailwind CSS | Utility-first, no custom CSS files |
| Icons | lucide-react | Consistent, tree-shakeable |
| Forms | react-hook-form + zod | Type-safe validation |
| Data Fetching | TanStack Query | Server state management |
| Notifications | sonner | Lightweight toast notifications |
| URL State | nuqs | Type-safe URL query parameters |
| Dates | date-fns | Tree-shakeable, immutable |

---

## 3. shadcn/ui Theme

This project uses shadcn/ui with oklch colors, custom fonts, and tuned spacing. When generating UI, always use semantic token classes — never hardcode color values.

### Color System (oklch)

Use **only** Tailwind semantic classes. Never write raw oklch values in components.

| Token | Light | Dark | Tailwind Class |
|-------|-------|------|----------------|
| background | `oklch(0.984 0.003 248)` — near-white blue-gray | `oklch(0.129 0.041 265)` — deep blue-black | `bg-background` |
| foreground | `oklch(0.208 0.040 266)` — dark navy | `oklch(0.984 0.003 248)` — near-white | `text-foreground` |
| card | `oklch(1.0 0 0)` — pure white | `oklch(0.129 0.041 265)` — same as bg | `bg-card` |
| primary | `oklch(0.546 0.215 263)` — vivid blue | `oklch(0.623 0.188 260)` — lighter blue | `bg-primary`, `text-primary` |
| secondary | `oklch(0.968 0.007 248)` — faint blue-gray | `oklch(0.208 0.040 266)` — dark | `bg-secondary` |
| muted | `oklch(0.968 0.007 248)` — faint blue-gray | `oklch(0.208 0.040 266)` — dark | `bg-muted`, `text-muted-foreground` |
| accent | `oklch(0.942 0.028 256)` — light blue tint | `oklch(0.280 0.037 260)` — dark blue | `bg-accent` |
| destructive | `oklch(0.577 0.215 27)` — red | `oklch(0.637 0.208 25)` — lighter red | `bg-destructive`, `text-destructive` |
| border | `oklch(0.929 0.013 256)` — subtle blue-gray | `oklch(0.280 0.037 260)` — dark blue | `border-border` |

### Fonts

| Token | Font Family | Use For |
|-------|-------------|---------|
| `--font-sans` | **Plus Jakarta Sans** | All UI text — labels, headings, body |
| `--font-mono` | **IBM Plex Mono** | Codes, IDs, amounts, timestamps, invoice numbers, GL codes |
| `--font-serif` | **Lora** | Reserved (rarely used) |

Tailwind: `font-sans` (default), `font-mono`, `font-serif`

### Spacing & Radius

| Token | Value | Notes |
|-------|-------|-------|
| `--spacing` | `0.27rem` | Base spacing unit — compact enterprise density |
| `--radius` | `1.4rem` | Large radius — gives soft, modern card edges |
| `--letter-spacing` | `-0.025em` | Tight tracking — dense, professional feel |

### Shadows

Light mode uses subtle `0.16` opacity shadows. Dark mode uses heavier `0.35` opacity with wider blur (`12px` vs `3px`). Always use Tailwind `shadow-sm`, `shadow`, `shadow-md` etc. — never hardcode.

### Dark Mode

- Toggled via `className="dark"` on `<html>`
- Use `@custom-variant dark (&:is(.dark *))` pattern
- All colors auto-switch — never use conditional color classes

### Usage Rules

```tsx
// CORRECT — semantic tokens
<div className="bg-card text-card-foreground border rounded-lg shadow-sm">
<span className="text-muted-foreground text-sm">Helper text</span>
<code className="font-mono text-xs">INV-2026-001</code>
<Badge className="bg-primary text-primary-foreground">Active</Badge>

// WRONG — hardcoded values
<div style={{ background: "oklch(1.0 0 0)" }}>
<span className="text-gray-500">
<div className="rounded-[1.4rem]">
```

---

## 4. Page vs Modal Decision

### Use FULL PAGES for:
- Entity management (users, projects, customers)
- Configuration and settings
- Complex forms (3+ fields or multiple sections)
- Workflow screens (review, approval, reconciliation)
- Data tables with filters
- Multi-step processes

**Rule:** If a screen has more than 4 fields OR multiple sections, it MUST be a page.

### Use MODALS (Dialog/AlertDialog) only for:
- Quick actions: add, rename, confirm delete
- Single-field edits
- File upload
- Quick comment
- Destructive action confirmation

**Modal constraints:**
- Max 3-4 fields
- No tabs inside modals
- No modal-within-modal
- No scrolling long forms

### Use SHEETS (Drawer) for:
- Side panels showing detail without leaving context
- Mobile navigation
- Quick filters on narrow screens

---

## 5. Navigation

Always use **left sidebar navigation** with collapsible groups.

```
Top Level:
  Dashboard
  Invoices (grouped sub-items)
  Review
  Reports
  Admin (users, customers, projects, settings)

Entity Detail Pages:
  Overview tab
  Related data tabs
  Settings tab
```

**Rules:**
- Every page must be reachable via URL (deep-linkable)
- Breadcrumbs on detail pages
- Never hide important functionality inside modals

---

## 6. Settings Pattern

Settings use **tabbed pages**, each with its own URL segment.

```
/projects/{uuid}/settings          — General
/projects/{uuid}/settings/users    — Users
/projects/{uuid}/settings/roles    — Roles & Permissions
/projects/{uuid}/connectors        — Data Connectors
```

**Rules:**
- Each section = its own URL
- Deep-linkable
- Never inside modals

---

## 7. Table UX

Data tables are the primary interaction pattern. Every table MUST support:

- **Sorting** — Click column header to sort
- **Filtering** — Server-side filtering via URL params
- **Pagination** — Server-side, show total count
- **Empty state** — Clear message when no data
- **Loading state** — Skeleton rows or spinner
- **Row actions** — Dropdown menu or inline buttons

### Table component pattern:
```tsx
// Use shadcn Table component
<Table>
  <TableHeader>...</TableHeader>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id}>
        <TableCell>...</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Rules:**
- Assume 100k+ rows — always paginate server-side
- Never load all data client-side
- Use `nuqs` for filter/sort state in URL
- Critical workflows must NOT open inside tiny modals from table rows

---

## 8. Form Layout

All forms follow this structure:

```
Page Header (title + description)
——— Section 1: Group Label
|   ——— Field (label above input)
|   ——— Field
|   ——— Helper text if needed
——— Section 2: Group Label
|   ——— Field
|   ——— Field
——— Actions (sticky footer or bottom of form)
    ——— Primary: "Save Changes" / "Create"
    ——— Secondary: "Cancel"
```

**Rules:**
- Max width: 720-900px for form content
- Labels above inputs (never inline/left-aligned)
- Grouped sections with clear headings
- Helper text below fields when needed
- Use `react-hook-form` + `zod` for validation
- Show inline validation errors below each field
- Disable submit button while submitting, show spinner

---

## 9. Workflow Screens

Operational workflows (review, approval, reconciliation) are **full-screen task environments**.

Must include:
- Document/data viewer (left or top panel)
- Editable fields with validation
- Status indicators (badges, timeline)
- Action buttons (approve, reject, flag, submit)
- Keyboard shortcuts for power users

**Never** place workflow UI inside modals.

---

## 10. Status Visibility

Every entity with a lifecycle must show status clearly:

- **Status badges** — Colored pills using shadcn Badge
- **Color coding** — Consistent across the app:
  - Green: success, completed, approved
  - Yellow/amber: warning, pending, in progress
  - Red: error, failed, disputed, overdue
  - Blue: informational, extracted, received
  - Gray: inactive, closed, archived
- **Timeline/history** — Chronological event log on detail pages

---

## 11. Design Tone

### DO:
- Calm, neutral, professional
- Minimal, data-first
- Neutral grays with subtle accent colors
- Clear typography hierarchy
- Consistent spacing (use Tailwind scale)
- White/light card backgrounds on subtle gray page background

### DON'T:
- Bright gradients or glassmorphism
- Consumer-style animations or playful UI
- Heavy shadows or 3D effects
- Decorative illustrations in operational views
- Emoji in UI labels (unless user explicitly requests)

### Typography:
- Sans-serif for UI text (system or configured font)
- Monospace for: codes, IDs, amounts, timestamps, technical values
- Clear size hierarchy: page title > section header > field label > body text > helper text

### Color palette:
- Background: neutral gray (`bg-muted/50` or page background token)
- Cards: white (`bg-card`)
- Text: high contrast (`text-foreground`, `text-muted-foreground`)
- Accent: single primary color, used sparingly
- Status colors: semantic (green/yellow/red/blue)

---

## 12. Component Selection Guide

### PREFER:
| Need | Component |
|------|-----------|
| Data lists | Table (shadcn) |
| Side detail | Sheet/Drawer |
| Grouped settings | Tabs |
| Form sections | Card with heading |
| Search/select | Command (cmdk) |
| Navigation | Sidebar |
| Context menu | DropdownMenu |
| Confirmations | AlertDialog |
| Notifications | sonner toast |

### AVOID:
- Nested modals (modal inside modal)
- Floating panels
- Hidden hover-only interactions
- Custom scrollbars
- Accordion for forms (use sections instead)

---

## 13. data-testid Conventions

Test IDs are a **public contract** for QA automation. Follow these rules strictly.

### Where ALLOWED:
- Page-level components (`app/**/page.tsx`)
- Feature/domain components (`components/<domain>/*`)
- Business-intent composites

### Where FORBIDDEN:
- `components/ui/*` (shadcn primitives)
- Generic layout wrappers
- Icons, decorations, animations

### Naming format: `<domain>-<intent>-<element>`

**Valid examples:**
```
invoice-create-submit
invoice-vendor-input
tracker-status-filter
review-approve-button
publish-entity-select
login-email-input
user-role-select
```

**Invalid examples:**
```
button              (no domain)
submit-btn          (implementation word)
primary             (styling word)
input-1             (positional)
modal-confirm       (implementation word)
```

### Rules:
- kebab-case only
- No styling words (primary, secondary, red, large)
- No positional words (left, right, first, top)
- No implementation words (btn, div, span, modal, wrapper)
- Dynamic IDs only for list rows: `<domain>-row-<id>`
- Never remove/rename existing IDs without reason
- Every `data-testid` must represent a user action or visible element

---

## 14. Accessibility

All UI must support:
- Full keyboard navigation
- Visible focus states (never `outline-none` without replacement)
- Accessible labels on all interactive elements
- WCAG AA contrast ratios
- Screen reader support via semantic HTML and ARIA
- Focus trap in modals and sheets

---

## 15. Performance UX

- **Pagination required** — Never render unbounded lists
- **Server-side filtering** — Don't load all data to filter client-side
- **Skeleton loading** — Show content shape during loading
- **Optimistic updates** — For quick actions (comments, toggles)
- **Debounced search** — 300ms debounce on search inputs
- **Virtualization** — For lists >100 visible items

---

## 16. CRUD Consistency

All entities follow the same navigation pattern:

```
List Page (table with filters, pagination)
  → Detail Page (read view with tabs, timeline, related data)
  → Edit (inline or separate page depending on complexity)
  → Create (modal if <4 fields, page if more)
```

Never invent unique patterns per entity. Consistency reduces cognitive load.

---

## 17. Error & Empty States

Every data view must handle:

- **Loading** — Skeleton or spinner with context text
- **Empty** — Clear message + action ("No invoices yet. Upload one.")
- **Error** — Friendly message + retry button
- **Forbidden** — "You don't have access" with navigation back

Never show raw error messages or stack traces to users.

---

## 18. Anti-Patterns (NEVER generate)

- Modal inside modal
- Settings inside popup
- Configuration wizards in dialogs
- Scrolling modals with long forms
- Important data behind hover-only interactions
- Inline editing without clear save/cancel
- Tabs inside modals
- Full-page loading spinners (use skeleton instead)
- Generic "something went wrong" without context
- Hardcoded colors instead of theme tokens
