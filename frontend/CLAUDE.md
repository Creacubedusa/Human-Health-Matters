# Human Health Matters (HHM) — Claude Code Context

## What This App Is

AI-native telehealth mobile app. Three user roles: **Patient**, **Doctor**, **Donor**.
Patients get AI triage → funding check (insurance + donor pool) → doctor consultation → prescription.
Doctors onboard with NPI/Tax ID, accept consultations, generate notes and prescriptions.
Donors add funds to a central pool that is automatically allocated to patients who cannot pay.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54, Expo Router (file-based) |
| Language | TypeScript (strict) |
| Styling | NativeWind 4 / Tailwind 3.4 — **className only, no StyleSheet, no inline styles** |
| Animation | React Native Reanimated |
| State | Zustand 5 — one store per feature |
| Server state | TanStack Query + Axios + Zod |
| i18n | i18next + react-i18next + expo-localization |
| Storage | expo-secure-store |
| Components | expo-image, expo-font, expo-splash-screen, expo-notifications |
| Docs | Storybook 10 |
| Path aliases | `@features/*`, `@shared/*`, `@design/*` |

## Directory Layout

```
app/                        ← Expo Router entry (file = route)
  _layout.tsx               ← Root layout (providers)
  index.tsx                 ← Redirect based on auth state
  (auth)/                   ← Unauthenticated screens
  (patient)/                ← Patient tab group
  (doctor)/                 ← Doctor tab group
  (donor)/                  ← Donor tab group

src/
  features/
    patient/  doctor/  donor/
      components/  screens/  hooks/  services/  store/  types/
  shared/
    components/ui/  components/layout/  components/feedback/
    api/  hooks/  i18n/locales/  store/  types/  utils/
  design/
    tokens.ts               ← Single source for all design tokens
```

## Architecture Rules — Non-Negotiable

### Styling
- **Only NativeWind `className`**. Never `StyleSheet.create`, never inline `style={}`, never hardcoded hex/px values.
- All colors, spacing, and typography come from `src/design/tokens.ts` and `tailwind.config.js`.

### Text / i18n
- **No hardcoded strings in components**. Every visible string must be an i18n key via `useTranslation()`.
- Locale files live in `src/shared/i18n/locales/`.

### Layer Separation
```
UI component → custom hook → service → shared/api
```
- UI components only call hooks; hooks call services; services call the API layer.
- API calls never appear inside a component or a Zustand store action directly.

### State
- Each feature owns its Zustand store in `src/features/<role>/store/`.
- Global shared state (auth session, theme) lives in `src/shared/store/`.
- Do not mix patient/doctor/donor state.

### Role Isolation
- Each role has its own Expo Router group: `(patient)`, `(doctor)`, `(donor)`.
- No cross-feature imports. Features may only import from `@shared/*` or `@design/*`.

### UI State
Every screen must handle all four states — never ship a screen without them:
1. **Loading** — skeleton or spinner
2. **Error** — message + retry action
3. **Empty** — contextual empty state illustration/message
4. **Success** — the actual content

### Edge Cases
- Block patient progression if funding is unavailable.
- Block doctor access if not onboarded (NPI + Tax ID + bank details incomplete).
- Flag AI triage output when confidence is below threshold.

## Forbidden Patterns

- `StyleSheet.create` or `style={{}}` anywhere
- Hardcoded strings (`"Submit"`, `"Error"`, etc.) in components
- Direct `axios` / `fetch` calls inside a component or screen
- Importing from `@features/patient` inside `@features/doctor` (or any cross-feature import)
- Over-engineering: no abstractions beyond what the current task requires

## Figma

Figma is the single source of truth for UI. When a Figma URL is provided:
- Implement layouts exactly — do not reinterpret spacing, hierarchy, or structure.
- Map Figma design tokens to the project's `tailwind.config.js` equivalents.
- Use `get_design_context` first, then adapt output to this stack (not raw React+Tailwind).

## Component Rules

- Build every UI element as a reusable component in `src/shared/components/`.
- Components must be stateless where possible; lift state to hooks.
- Document every shared component in Storybook.

## File Naming

- Components: `PascalCase.tsx`
- Hooks: `useFeatureName.ts`
- Services: `featureName.service.ts`
- Stores: `featureName.store.ts`
- Types: `featureName.types.ts`
- i18n files: `en.json`, `fr.json`, etc.

## Out of Scope — Do Not Implement

- Insurance claim submission
- Payment reconciliation
- Pharmacy integration
- Crowdfunding campaigns
- Full EHR integration

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.