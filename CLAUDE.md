# Family Tree App — Project Context

## Tech Stack
- **Runtime:** Expo (iOS + Android)
- **Lang:** TypeScript strict
- **State:** Zustand (hierarchical tree data)
- **UI:** React Native + NativeWind (Tailwind)
- **Viz:** `react-native-skia` for tree rendering
- **DB/Auth:** Supabase (PostgreSQL + Auth)
- **Nav:** Expo Router

## Architecture Decisions
- Zustand for state — handles deep tree hierarchies without re-render hell
- Skia over D3 — native performance, better RN integration
- Supabase edge functions for complex relationship queries

## Current State
- [x] Expo project initialized
- [x] Git remote linked (git@github.com:F13RC3/family-tree-app.git)
- [x] Dependencies installed (zustand, supabase, skia, nativewind)
- [x] Folder structure created (`/src/{components,screens,utils,navigation,store,services,types}`)
- [x] Types defined (`FamilyMember`, `Relationship`, `TreeNode`)
- [x] Supabase client + API helpers (`src/services/supabase.ts`)
- [x] Zustand store with tree helpers (`src/store/useFamilyStore.ts`)
- [x] Tailwind + NativeWind configured
- [ ] Auth screens
- [ ] Member CRUD screens
- [ ] Tree visualization component

## Data Model
See `src/types/index.ts`

## Env Setup Required
Copy `.env.example` to `.env` and fill in Supabase credentials.

## Session Carry-Over
Last session ended: Core scaffold complete. Store + services ready. Next: Auth screens + Supabase schema.
