# Family Tree App

Mobile app for building and visualizing family trees. Built with Expo, TypeScript, Zustand, and Supabase.

## Tech Stack

- **Runtime:** Expo (iOS + Android)
- **Language:** TypeScript
- **State:** Zustand
- **UI:** React Native + NativeWind (Tailwind CSS)
- **Visualization:** react-native-skia
- **Backend:** Supabase (PostgreSQL + Auth)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials in `.env`:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

3. **Set up database**
   Run the SQL from `supabase/schema.sql` in your Supabase SQL editor.

4. **Start development server**
   ```bash
   npm start
   ```
   - `npm run android` — Android emulator
   - `npm run ios` — iOS simulator (macOS only)
   - `npm run web` — Web browser

## Project Structure

```
src/
  components/   # Reusable UI components
  screens/      # Screen components (Auth, Members, Tree)
  store/        # Zustand state management
  services/     # Supabase API clients
  types/        # TypeScript type definitions
  utils/        # Helper functions
  navigation/   # Expo Router configuration
```

## Features (MVP)

- [ ] Email/password authentication
- [ ] Add/edit family members (name, DOB, gender, bio)
- [ ] Create relationships (parent-child, spouse-spouse)
- [ ] Interactive tree visualization
- [ ] Zoom/pan navigation

## License

MIT
