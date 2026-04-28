---
name: figma-ui-replicator
description: Analyze a Figma design and generate production-ready React Native + NativeWind code that exactly replicates the layout. Enforces HHM architecture rules: NativeWind-only styling, i18n keys, feature-based folder placement, and four UI states per screen. Use when the user provides a Figma URL, screenshot, or describes a screen to implement for the Human Health Matters app.
---

# Figma UI Replicator

## Overview

To implement any HHM screen, retrieve the Figma design context, map its tokens to the project's design system, and generate a production-ready React Native component that enforces the project's architecture rules. The output is always a complete package: component file, i18n keys, exact file path, and a Storybook stub. Figma is the single source of truth — do not reinterpret layouts, spacing, or hierarchy.

## Skill Boundaries

- Use this skill when the deliverable is a `.tsx` component file in the HHM codebase.
- When a Figma URL is provided, this skill wraps and supersedes `figma-implement-design` with HHM-specific output rules. Do not use `figma-implement-design` directly on this project.
- For writing nodes back into the Figma canvas, use `figma-use` instead.

## Input Handling

Accept any of the following from the user:

| Input type | How to handle |
|---|---|
| Figma URL (`figma.com/design/:fileKey/...?node-id=X-Y`) | Extract `fileKey` + `nodeId`, proceed to Step 1 |
| Screenshot or exported image | Use visual analysis to infer layout; skip Step 1 retrieval |
| Verbal description | Ask one clarifying question about role (patient/doctor/donor) and screen name, then generate |

## Step 1: Retrieve Design (Figma URL path only)

1. Parse the URL: `fileKey` is the segment after `/design/`; `nodeId` is the `node-id` query param (convert `-` to `:` if needed).
2. Call `get_design_context(fileKey, nodeId)` — primary source for layout, typography, colors, spacing.
3. Call `get_screenshot(fileKey, nodeId)` — keep this image as the visual reference throughout.
4. If the response is truncated: call `get_metadata(fileKey, nodeId)` to get the node map, identify child node IDs, then call `get_design_context` on each child separately.
5. If Code Connect snippets appear in the response, use those mapped components directly instead of generating from scratch.

## Step 2: Map Design Tokens

Map every Figma color and spacing value to the HHM token system before writing any code.

**Color mapping:**

| Figma value | NativeWind className |
|---|---|
| `#0066CC` | `bg-primary` / `text-primary` |
| `#00A86B` | `bg-secondary` / `text-secondary` |
| `#D32F2F` | `bg-error` / `text-error` |
| `#F57C00` | `bg-warning` / `text-warning` |
| `#FFFFFF` | `bg-surface` |
| `#F5F5F5` | `bg-background` |

**Spacing mapping** (use `p-`, `m-`, `gap-` Tailwind utilities):

| Token | Value | Tailwind |
|---|---|---|
| xs | 4px | `p-1` / `gap-1` |
| sm | 8px | `p-2` / `gap-2` |
| md | 16px | `p-4` / `gap-4` |
| lg | 24px | `p-6` / `gap-6` |
| xl | 32px | `p-8` / `gap-8` |
| xxl | 48px | `p-12` / `gap-12` |

Never write raw hex values or pixel numbers in className strings. If a Figma value has no token equivalent, use the closest token and note the deviation.

## Step 3: Generate the Component

**File placement** — determine the correct path:
- Shared UI element (button, input, card): `src/shared/components/ui/ComponentName.tsx`
- Shared layout element: `src/shared/components/layout/ComponentName.tsx`
- Shared feedback (toast, spinner, error): `src/shared/components/feedback/ComponentName.tsx`
- Patient-specific screen: `src/features/patient/screens/ScreenName.tsx`
- Doctor-specific screen: `src/features/doctor/screens/ScreenName.tsx`
- Donor-specific screen: `src/features/donor/screens/ScreenName.tsx`
- Reusable component within a feature: `src/features/<role>/components/ComponentName.tsx`

**Component rules:**
- Export a named TypeScript props interface: `export interface ComponentNameProps { ... }` — no `any` types.
- Keep the component stateless. If state is needed, create a hook at `src/features/<role>/hooks/useComponentName.ts` and import it.
- Use only NativeWind `className` for styling — never `style={}`, `StyleSheet.create`, inline objects, or hardcoded hex/px.
- All visible strings must use `useTranslation()` with a namespaced key — never raw text literals in JSX.
- No direct API calls, Zustand imports, or Axios usage inside the component file.

## Step 4: Four UI States (required on every screen)

Every screen component must handle all four states. Stub them if the design only shows the success state.

```tsx
// Pattern to follow for each state:
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorState message={t('common.error')} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState message={t('screen.empty')} />;
// success state — the actual content
```

Components for `LoadingSkeleton`, `ErrorState`, and `EmptyState` go in `src/shared/components/feedback/`.

## Step 5: Output Package

Produce all four artifacts in a single response:

**1. Component file** — full `.tsx` source at the correct path.

**2. i18n keys** — JSON snippet to merge into `src/shared/i18n/locales/en.json`:
```json
{
  "screenName": {
    "title": "...",
    "subtitle": "...",
    "empty": "...",
    "error": "..."
  }
}
```

**3. Placement instruction** — exact absolute path where the file should be written.

**4. Storybook stub** — minimal story alongside the component:
```tsx
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = { title: 'Feature/ComponentName', component: ComponentName };
export default meta;
type Story = StoryObj<typeof ComponentName>;
export const Default: Story = {};
```

## Pre-output Checklist

Before outputting any code, verify all items pass:

- [ ] No `style={}` or `StyleSheet` anywhere in the component
- [ ] No hardcoded strings in JSX (every string goes through `t('key')`)
- [ ] Layout matches the Figma screenshot — no reinterpretation of spacing or hierarchy
- [ ] All four UI states are present (loading, error, empty, success)
- [ ] Props interface is exported with full TypeScript types (no `any`)
- [ ] Component is placed in the correct feature or shared folder
- [ ] i18n JSON keys are included in the output
- [ ] No API calls, store imports, or business logic inside the component

If any item fails, fix it before outputting.

## Reference

For full HHM architecture rules, forbidden patterns, layer separation, and file naming conventions, read:
`references/hhm-architecture.md`
