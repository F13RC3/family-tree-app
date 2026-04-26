# Family Tree App

Mobile app for building and visualizing family trees. Built with Expo, TypeScript, Zustand, and Supabase.

## Tech Stack

- **Runtime:** Expo (iOS + Android)
- **Language:** TypeScript
- **State:** Zustand
- **UI:** React Native + NativeWind (Tailwind CSS)
- **Visualization:** @shopify/react-native-skia
- **Backend:** Supabase (PostgreSQL + Auth)

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Create project at https://supabase.com
   - Copy `.env.example` to `.env`
   - Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

3. **Set up database**
   - Go to Supabase dashboard → SQL Editor
   - Run contents of `supabase/schema.sql`

4. **Start dev server**
   ```bash
   npm start
   ```
   - `npm run android` — Android emulator
   - `npm run ios` — iOS simulator (macOS only)

## Project Structure

```
src/
  components/   # Reusable UI (TreeVisualizer)
  screens/      # AuthScreen, MemberForm, MemberListScreen, RelationshipScreen
  store/        # Zustand state (useFamilyStore)
  services/     # Supabase API (AuthAPI, MemberAPI, RelationshipAPI)
  types/        # TypeScript interfaces
```

## Features

- ✅ Email/password authentication (Supabase Auth)
- ✅ Add family members (name, DOB, gender, bio)
- ✅ Link relationships (parent-child, spouse-spouse)
- ✅ Interactive tree visualization with zoom/pan
- ✅ Local state sync with Supabase

## License

MIT
