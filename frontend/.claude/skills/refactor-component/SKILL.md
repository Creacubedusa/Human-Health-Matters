---
name: refactor-component
description: Audit and refactor any HHM React Native component. Produces a prioritised issue report (critical / recommended / nice-to-have) with line numbers and fix examples, then outputs a production-ready refactored component + updated Storybook stories. Enforces NativeWind-only styling, TypeScript strict types, HHM architecture rules, and full story coverage.
---

# Refactor Component

## Overview

You are a senior React Native UI engineer with 10+ years of experience building scalable mobile applications. When invoked, read the target component, audit it across 8 categories, then produce a prioritised issue report followed by a fully refactored replacement and updated Storybook stories. The output must be production-ready — the same functionality and UI behaviour, cleaner implementation. Do not redesign; refactor.

## Skill Boundaries

- Use this skill when the deliverable is an improved version of an existing `.tsx` component.
- For implementing a brand-new component from a Figma URL, use `figma-ui-replicator` instead.
- This skill never changes public API (exported prop names/types) without flagging the breaking change explicitly.

---

## Input Handling

Accept any of the following:

| Input | Action |
|---|---|
| File path (e.g. `src/shared/components/ui/Button.tsx`) | Read the file automatically before auditing |
| IDE selection (highlighted code) | Use the selected code as the component source |
| Pasted code | Use directly as the component source |

Also read the companion `.stories.tsx` file at the same path if it exists — it is included in the audit.

---

## Step 1: Load Context

Before writing a single audit note, read these files:

1. `src/design/tokens.ts` — authoritative list of token names and exports
2. `tailwind.config.js` — every valid NativeWind className (color, spacing, typography, radius, shadow)
3. `CLAUDE.md` — HHM architecture rules, forbidden patterns, layer separation contract

Use the token list and config to validate every className in the component. Any class that is not in the Tailwind config or NativeWind defaults is flagged as a critical issue.

---

## Step 2: Audit

Scan the component systematically across all 8 categories below. For **every** issue found, output a block in this format:

```
### [CATEGORY] — [SHORT TITLE]
**Line(s):** 42–45
**Priority:** 🔴 CRITICAL | 🟡 RECOMMENDED | 🟢 NICE-TO-HAVE
**Problem:**
\`\`\`tsx
// the offending code exactly as it appears
\`\`\`
**Fix:**
\`\`\`tsx
// the corrected code
\`\`\`
**Reason:** One sentence explaining why this matters.
```

Priority levels:
- `🔴 CRITICAL` — violates a hard architecture rule: `style={}`, `StyleSheet.create`, hardcoded hex/px in className, hardcoded string literals in JSX, API/store calls inside component, cross-feature imports
- `🟡 RECOMMENDED` — degrades maintainability or type-safety: missing/`any` props, unexported interface, un-extracted business logic, re-render risk, missing story variants or sizes
- `🟢 NICE-TO-HAVE` — improves quality without urgency: accessibility attributes, `React.memo` for list items, naming consistency, minor duplication

### Audit Categories

**1. Styling**
- Any `style={}` prop anywhere in the file → `🔴 CRITICAL`
- Any `StyleSheet.create` import or call → `🔴 CRITICAL`
- Inline style objects passed as props (e.g. `style={{ color: '#fff' }}`) → `🔴 CRITICAL`
- Hardcoded hex values, pixel numbers, or `rem`/`em` in className strings → `🔴 CRITICAL`
- className tokens that do not exist in `tailwind.config.js` or NativeWind defaults → `🔴 CRITICAL`
- `opacity-*` used as a workaround for transparency when a proper token exists → `🟡 RECOMMENDED`

**2. TypeScript**
- Props interface not exported → `🟡 RECOMMENDED`
- Any prop typed as `any` or `object` → `🟡 RECOMMENDED`
- Missing return type on non-trivial helper functions → `🟢 NICE-TO-HAVE`
- `as` type assertions masking unsafe casts → `🟡 RECOMMENDED`

**3. Architecture**
- Component file placed in the wrong directory (e.g. feature-specific UI in `src/shared/`) → `🔴 CRITICAL`
- Import from another feature (`@features/patient` inside `@features/doctor`) → `🔴 CRITICAL`
- Direct Axios/fetch call inside the component → `🔴 CRITICAL`
- Zustand store imported and called directly inside the component → `🔴 CRITICAL`
- Business logic (data transformation, validation rules) inside component body → `🟡 RECOMMENDED`

**4. State & Logic**
- Non-trivial state logic (> 2 `useState` + side effects) not extracted to a custom hook → `🟡 RECOMMENDED`
- Derived values recomputed on every render without `useMemo` → `🟡 RECOMMENDED`
- Callback functions recreated on every render without `useCallback` (when passed to children) → `🟡 RECOMMENDED`
- `useEffect` with missing or incorrect dependency array → `🔴 CRITICAL`

**5. i18n**
- String literals rendered in JSX that should be user-visible (labels, messages, placeholders) not routed through `t('key')` or received as a prop → `🔴 CRITICAL`
- Exception: strings used only as `testID`, `accessibilityRole`, or developer-facing attributes are not flagged

**6. Performance**
- Component rendered inside a `FlatList` / `ScrollView` without `React.memo` → `🟡 RECOMMENDED`
- Large inline arrays or objects defined inside the component body (should be constants outside) → `🟡 RECOMMENDED`

**7. Accessibility**
- Interactive elements (`Pressable`, `TouchableOpacity`) missing `accessibilityLabel` or `accessibilityRole` → `🟢 NICE-TO-HAVE`
- Images missing `accessibilityLabel` → `🟢 NICE-TO-HAVE`
- Decorative icons missing `accessibilityElementsHidden` / `importantForAccessibility="no"` → `🟢 NICE-TO-HAVE`

**8. Storybook Coverage**
- A named prop variant (e.g. `variant="outline"`) has no dedicated story → `🟡 RECOMMENDED`
- A size option has no dedicated story → `🟡 RECOMMENDED`
- No story for disabled state (if prop exists) → `🟡 RECOMMENDED`
- No story with very long / overflowing text → `🟢 NICE-TO-HAVE`
- No `Overview` story showing the full matrix → `🟡 RECOMMENDED`
- Story uses hardcoded strings instead of the `label` / `text` arg from `meta.args` → `🟢 NICE-TO-HAVE`

---

## Step 3: Refactor

Rewrite the component applying every fix from the audit. Rules:

**Styling**
- NativeWind `className` only — zero `style` props.
- Exception: React Native props that cannot accept CSS variables (`placeholderTextColor`, `tintColor`, `selectionColor`, `underlayColor`). For these, import the raw hex from `primitiveColors` in `src/design/tokens.ts` and add a comment: `// CSS variables not supported in this RN prop — raw hex from primitiveColors`.
- Never build className strings with string interpolation involving runtime values; use lookup tables instead.

**Lookup table pattern for multi-state styles:**
```tsx
const BG: Record<Status, string> = {
  default: 'bg-primary-500',
  success: 'bg-green-500',
  error:   'bg-red-500',
};
// usage: <View className={BG[status]} />
```

**TypeScript**
- Export the props interface: `export interface ComponentNameProps { ... }`
- No `any` types. Use `React.ReactNode` for renderable children/icons.
- Type all helper functions explicitly.

**Architecture**
- If the component has non-trivial state (≥ 2 `useState` + any `useEffect`), extract to `useComponentName` hook in the correct hooks directory and import it.
- No API calls, store imports, or business logic in the component file.

**Naming & Structure**
- Destructure all props at the function signature.
- Extract repeated className-building logic into named `const` variables above the return.
- If the component body exceeds ~80 lines, extract large sub-sections into local `const` render helpers (`const renderButtons = () => ...`) defined inside the component.
- Keep lookup tables (`Record<X, string>`) as module-level constants above the component.

**i18n**
- Replace every hardcoded user-visible string with a prop (the caller supplies the translated string via `t('key')`).
- Never call `useTranslation` inside a shared UI component — that belongs in the screen or feature component.

---

## Step 4: Update Stories

Rewrite or extend the `.stories.tsx` file so that:

- Every exported prop variant (`variant`, `status`, `size`, `disabled`, etc.) has its own named story.
- Every size is individually documented.
- Edge cases covered:
  - Long text / wrapping (pass a 60+ character label)
  - Empty / undefined optional props (label, icon, helperText)
  - All status values (default, success, info, warning, error)
  - Disabled state
- An `Overview` story renders the complete variant × status (or variant × size) matrix.
- Interactive stories use a `ControlledWrapper` with `useState` where the component requires a controlled value.
- Icon placeholders use `<Text>` with a Unicode character — never import an external icon library in stories.

Story naming convention: `Category / Descriptor` (e.g. `'Variant / Filled'`, `'Status / Error'`, `'Overview / All Statuses × Variants'`).

---

## Step 5: Output Package

Deliver everything in a single response in this order:

### 1. Audit Report
The full categorised issue list from Step 2. Group by category. Include a count summary at the top:
```
Audit complete — X issues found: Y critical, Z recommended, W nice-to-have.
```

### 2. Refactored Component
Full `.tsx` source at the exact file path. No placeholders, no `// TODO` comments.

### 3. Updated Stories
Full `.stories.tsx` source at the exact file path.

### 4. Summary
- Issues fixed per category (table)
- One-sentence rationale for any non-obvious decision (e.g. why a hook was or was not extracted)

---

## Pre-output Checklist

Gate the output behind all of these:

- [ ] Zero `style={}` or `StyleSheet` in refactored component (only `primitiveColors` raw hex exception allowed, with comment)
- [ ] Every className token validated against `tailwind.config.js` and NativeWind defaults
- [ ] Props interface exported, zero `any` types
- [ ] No hardcoded user-visible strings in JSX
- [ ] No API calls, store imports, or business logic in the component file
- [ ] Stories cover every variant, every size, disabled state, and long-text edge case
- [ ] `Overview` story present

If any item fails, fix it before outputting.
