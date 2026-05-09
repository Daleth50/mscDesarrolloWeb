# MSC Mobile (Ionic React)

Offline-first mobile app connected to the backend API.

## Implemented flow
- Login screen (`/login`)
- Initial synchronization screen (`/sync`)
- Tab shell (`/tabs`) with:
  - Customers tab (default)
  - Settings tab (manual sync + logout)

## Architecture
- Clean Architecture + SOLID style structure:
  - `src/domain`: entities, repository contracts, use cases
  - `src/data`: datasource implementations and repositories
  - `src/infrastructure`: HTTP client and local storage details
  - `src/presentation`: Ionic pages/components/context
  - `src/app`: composition root (dependency container + app routes)

## Environment
Copy `.env.example` to `.env` and set backend URL:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5000
```

## Run
```bash
npm install
npm run dev
```

## Capacitor
Capacitor is configured with:
- App ID: `com.msc.mobile`
- App Name: `MSC Mobile`
- Web directory: `dist`

Useful commands:

```bash
# Build web and sync native projects
npm run cap:sync

# Open Android Studio project
npm run cap:open:android

# Open Xcode project
npm run cap:open:ios

# Build+sync and run on Android device/emulator
npm run cap:run:android

# Build+sync and run on iOS simulator/device
npm run cap:run:ios
```

Generated native projects:
- `android/`
- `ios/`

## Notes
- Local persistence uses IndexedDB through `localforage`.
- Customers list is read from local DB to support offline mode.
