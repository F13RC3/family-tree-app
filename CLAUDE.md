# Family Tree App — Project Context

## Tech Stack
- **Runtime:** Expo (iOS + Android)
- **Lang:** TypeScript strict
- **State:** Zustand (hierarchical tree data)
- **UI:** React Native + NativeWind (Tailwind)
- **Viz:** `react-native-skia` for tree rendering
- **DB/Auth:** Supabase (PostgreSQL + Auth)

## Architecture Decisions
- Zustand for state — handles deep tree hierarchies without re-render hell
- Skia over D3 — native performance, better RN integration
- Supabase edge functions for complex relationship queries

## Current State
- [x] Expo project initialized
- [x] Git remote linked + pushed (git@github.com:F13RC3/family-tree-app.git)
- [x] Dependencies installed (zustand, supabase, skia, nativewind)
- [x] Folder structure: `/src/{components,screens,utils,navigation,store,services,types}`
- [x] Types: `FamilyMember`, `Relationship`, `TreeNode`
- [x] Supabase client + API helpers
- [x] Zustand store with tree helpers
- [x] NativeWind + Tailwind configured
- [x] Auth screens (signin/signup)
- [x] Member CRUD (MemberForm, MemberListScreen)
- [x] TreeVisualizer component (Skia)
- [x] Supabase schema (`supabase/schema.sql`) with RLS, triggers, indexes

## Data Model
See `src/types/index.ts` + `supabase/schema.sql`

## Env Setup Required
Copy `.env.example` to `.env` and fill in Supabase credentials.

## Session Carry-Over
Last session ended: MVP complete — Auth, Member CRUD, Tree Viz all pushed to main.
