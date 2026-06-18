# MovieFlix 🎬

A React Native (Expo) movie browsing app with a dark-themed UI, powered by **The Movie Database (TMDB) API**. Browse popular movies, search for titles, and discover new films.

## Tech Stack

- **[Expo](https://expo.dev) ~54** with **React Native 0.81**
- **[expo-router](https://docs.expo.dev/router/introduction/)** — file-based routing
- **[NativeWind](https://www.nativewind.dev/) v4** — Tailwind CSS for React Native
- **[TMDB API](https://developer.themoviedb.org/)** — movie data
- **`react-native-reanimated`** — animations
- **TypeScript**

## Features

- **Home** — grid of popular movies from TMDB
- **Search** — debounced search with real-time results
- **Movie Cards** — poster, title, rating, release year
- **Custom Tab Bar** — animated bottom navigation with dark styling
- **Dark Theme** — custom color palette throughout

## Getting Started

### Prerequisites

- Node.js
- A [TMDB API Bearer Token](https://developer.themoviedb.org/)

### Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create an `.env` file in the project root:

   ```env
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_bearer_token_here
   ```

3. Start the dev server:

   ```bash
   npx expo start
   ```

   Press **a** (Android), **i** (iOS), or **w** (web) to open the app.

### Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |
| `npm run web` | Start on Web |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/                  # expo-router file-based routes
  (tabs)/             # Bottom tab screens (Home, Search, Saved, Profile)
  movies/[id].tsx     # Movie detail page
components/           # Reusable UI components
services/             # TMDB API client & useFetch hook
interfaces/           # TypeScript type definitions
constants/            # Image & icon imports
assets/               # Images and icons
```

## Status

- ✅ Home / Search screens
- 🔲 Saved screen (placeholder)
- 🔲 Profile screen (placeholder)
- 🔲 Movie detail screen (placeholder)
