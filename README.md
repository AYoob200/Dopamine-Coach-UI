# Dopamine Coach

A focus and productivity web app built with React + Vite.

## Features

- Task planning and focus sessions
- Work/Break flow with momentum-based UI
- Completed tasks timeline and restore action
- Theme switch (light/dark)
- Authentication flow (demo mode)
- JSON-based i18n with RTL/LTR support

## Tech Stack

- React 18
- React Router 6
- Vite 6
- Tailwind CSS
- Framer Motion
- Lucide React

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open the local URL shown in the terminal (default: http://localhost:5173/).

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Demo Login Credentials

The current login is hardcoded for testing:

- Email: test@gmail.com
- Password: 12345678

## Project Structure

- `src/pages/` page-level screens
- `src/components/` shared UI/layout/guards
- `src/context/GlobalStateContext.jsx` app state and actions
- `src/i18n/` translation dictionaries and i18n loader
- `src/utils/` helper utilities (momentum and tags)

## Internationalization (JSON-based)

Languages are loaded automatically from JSON files in `src/i18n/`.

### Current setup

- `src/i18n/en.json` English (LTR)
- `src/i18n/ar.json` Arabic (RTL)
- `src/i18n/index.js` dynamic JSON loader + helper functions

### Add a new language

1. Create a new file in `src/i18n/`, for example `fr.json`.
2. Include at least these keys:

```json
{
  "locale": "fr",
  "direction": "ltr",
  "meta": {
    "name": "French",
    "nativeName": "Français"
  }
}
```

3. Add translation sections (for example: `common`, `auth`, `pages`, `settings`, etc.).
4. Restart dev server if needed.

The language will appear automatically in the Settings language selector.

## Notes

- Folder name and app label are `dopamine-coach`, while package name is currently `dopamine-couch` in `package.json`. If needed, rename safely in a separate change.
