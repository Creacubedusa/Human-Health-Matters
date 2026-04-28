# HHM Architecture Reference

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54, Expo Router (file-based routing) |
| Language | TypeScript strict |
| Styling | NativeWind 4 / Tailwind 3.4 — className only |
| Animation | React Native Reanimated |
| State | Zustand 5 — one store per feature |
| Server state | TanStack Query + Axios + Zod |
| i18n | i18next + react-i18next + expo-localization |
| Storage | expo-secure-store |
| Component docs | Storybook 10 |
| Path aliases | `@features/*`, `@shared/*`, `@design/*` |

---

## Directory Structure

```
app/                         Expo Router entry (file = route)
  _layout.tsx                Root layout (providers)
  index.tsx                  Redirect based on auth state
  (auth)/                    Unauthenticated screens
  (patient)/                 Patient tab group
  (doctor)/                  Doctor tab group
  (donor)/                   Donor tab group

src/
  features/
    patient/
      components/            Patient-specific reusable components
      screens/               Patient screen files
      hooks/                 Patient-specific hooks
      services/              Patient service layer
      store/                 Patient Zustand store
      types/                 Patient TypeScript types
    doctor/                  Same structure
    donor/                   Same structure
  shared/
    components/
      ui/                    Buttons, inputs, cards, badges
      layout/                SafeArea wrappers, containers, grids
      feedback/              Spinners, skeletons, error states, toasts
    api/                     Axios instance, interceptors, base types
    hooks/                   Cross-feature hooks
    i18n/
      locales/               en.json, etc.
    store/                   Global auth + theme state
    types/                   Shared TypeScript interfaces
    utils/                   Pure helper functions
  design/
    tokens.ts                Color + spacing constants
```

**Cross-feature import rule:** Features may only import from `@shared/*` or `@design/*`. Never import from `@features/patient` inside `@features/doctor`.

---

## Layer Separation (strict)

```
Screen (TSX)
  ↓ calls
Custom hook (useFeatureName.ts)
  ↓ calls
Service (featureName.service.ts)
  ↓ calls
API layer (shared/api/)
  ↓ calls
Backend
```

- UI components only call hooks.
- Hooks call services.
- Services call the API layer.
- API calls never appear inside a component or a Zustand store action directly.

---

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Component | PascalCase.tsx | `PatientCard.tsx` |
| Screen | PascalCase.tsx | `LoginScreen.tsx` |
| Hook | useFeatureName.ts | `usePatientProfile.ts` |
| Service | featureName.service.ts | `auth.service.ts` |
| Store | featureName.store.ts | `patient.store.ts` |
| Types | featureName.types.ts | `patient.types.ts` |
| i18n | en.json, fr.json | language code |

---

## Styling Rules

- **Only** NativeWind `className` props. No exceptions.
- `StyleSheet.create` — forbidden.
- `style={{ ... }}` inline objects — forbidden.
- Hardcoded hex values in className — forbidden.
- Hardcoded pixel numbers — forbidden.
- All colors come from `tailwind.config.js` theme tokens.
- All spacing comes from Tailwind scale mapped to `src/design/tokens.ts`.

---

## i18n Rules

- Every string visible to the user must be an i18n key.
- Use `const { t } = useTranslation()` at the top of the component.
- Namespace keys by screen or feature: `patient.home.title`, `common.error`, `doctor.onboarding.npi`.
- Locale files: `src/shared/i18n/locales/en.json` (and future language files).
- No raw string literals inside JSX — ever.

---

## State Management

- Each feature owns its Zustand store: `src/features/<role>/store/<role>.store.ts`.
- Global state (auth session, locale): `src/shared/store/`.
- Never mix patient/doctor/donor state in one store.
- Avoid storing derived data — compute it in selectors.

---

## UI State Requirement

Every screen must handle all four states:

1. **Loading** — skeleton or activity indicator
2. **Error** — message + retry button
3. **Empty** — contextual illustration/message (not a blank screen)
4. **Success** — the actual content

No screen ships without all four defined.

---

## Role Isolation

Each role has its own Expo Router group: `(patient)`, `(doctor)`, `(donor)`. No user should access features outside their role. Screen files for patient live under `src/features/patient/` — never under doctor or donor directories.

---

## Edge Case Rules

- Block patient progression if insurance + donor funding is unavailable.
- Block doctor access if NPI, Tax ID, or bank details are missing from onboarding.
- Flag AI triage output when confidence falls below threshold.
- Never show a blank screen — always an empty state.

---

## Forbidden Patterns (strictly prohibited)

- `StyleSheet.create` or `style={{ }}` in any component
- Hardcoded text strings in JSX
- `axios.get(...)` or `fetch(...)` called directly from a component or screen
- Importing from one feature inside another (e.g., `@features/patient` inside `@features/doctor`)
- Using `any` as a TypeScript type
- Over-engineering: no abstractions beyond the current task
- Mixing loading/error/empty/success logic into a single conditional mess

---

## Out of Scope — Do Not Implement

- Insurance claim submission
- Payment reconciliation
- Pharmacy integration
- Crowdfunding campaigns
- Full EHR integration
