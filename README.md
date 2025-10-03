Weather Now — Angular PWA

A fast, modern weather app built with Angular 20, the Open-Meteo APIs, and Service Worker caching. Search any city, use your current location, compare places side-by-side, switch units and themes, and install it like a native app.

✨ Features

Search any location (Open-Meteo Geocoding).

Current conditions: temperature, feels like, humidity, wind, precip, icon, local date/time.

7-day forecast with quick day selection.

Hourly forecast for the selected day with simple paging.

Units control:

System toggle: Metric ⇄ Imperial

Fine-grained: °C/°F, km/h/mph, mm/in (persists in localStorage).

Favorites: save up to 12 locations; one-click open (persists in localStorage).

Use My Location: one-tap geolocation.

Auto-geolocation on first visit: politely checks permissions and tries once (remembers via autogeo.v1).

Voice search: say a city name, we geocode and load it (Web Speech API).

Animated hero background that loops smoothly.

Themes:

Light / Dark

Auto mode (follows time of day, then aligns to API is_day after fetch).

Compare page: add multiple places and view their current snapshot in cards.

PWA-ready: install prompt button, manifest & icons, service worker (enabled for production builds).

Fast by default: in-memory forecast cache (60s TTL) to reduce network calls.

Responsive layout with skeleton loaders and error/retry state.

Planned/ready-to-wire extras on Compare: UV index, visibility, pressure, sunrise/sunset (API params are supported; UI placeholders already exist).

🧱 Tech Stack

Angular 20 (standalone components, signals, computed/effect)

Open-Meteo: Geocoding + Forecast (no API key)

Service Worker via @angular/service-worker

TypeScript, RxJS, CSS

📦 Project Structure (high level)
src/
  app/
    core/
      models/           # TS interfaces (Place, Units, CurrentWeather, ...)
      services/         # WeatherService, GeoService, ThemeService, FavoritesService
      stores/           # WeatherStore, UnitsStore
      utils/            # icon map, bg class map
    features/
      dashboard/        # main screen (search, hero, daily, hourly)
      compare/          # side-by-side cards for multiple places
    shared/
      components/
        favorites-bar/
        pwa-install/
        search-bar/
        units-dropdown/
        use-location/
        voice-search/
        weather-icon/
    app.routes.ts
    app.html            # header (Compare link, units dropdown, theme buttons, PWA install)
    app.config.ts       # router, http client, service worker registration
  assets/               # icons, background SVG, etc.
  styles.css
public/
  manifest.webmanifest
  icons/                # PWA icons
ngsw-config.json        # Angular SW config

🚀 Getting Started
1) Install
npm install

2) Run (dev)
npm start
# or
ng serve


Visit http://localhost:4200

In dev, the service worker is disabled (by design). PWA behavior is best tested on a production build.

3) Build (production + PWA)
ng build --configuration=production


Serve the dist/ folder over HTTPS / a static host:

# example using http-server (install globally if needed)
npx http-server ./dist/weather-app -p 8080 -S


Open https://localhost:8080
 and you should see:

Manifest loaded (no 404)

Service worker registered

Install button becomes available (when criteria met)

🔧 Configuration & Notes
Open-Meteo API

No key needed.

Forecast parameters include temperature_unit, wind_speed_unit, precipitation_unit, plus current, hourly, daily fields.

is_day is requested and fed to ThemeService in auto mode.

Units

Global system toggle (Metric/Imperial).

Individual toggles for temperature, wind, precip keep the system coherent.

Everything persists in localStorage.

Voice Search

Uses the Web Speech API (SpeechRecognition / webkitSpeechRecognition).

Works best in Chromium browsers (desktop & Android Chrome).

PWA

Service worker is only enabled when !isDevMode() in app.config.ts.

Install button listens to beforeinstallprompt.

Manifest & icons live in /public.
Ensure angular.json includes the public folder in assets (see troubleshooting).

🧪 Troubleshooting
“Manifest fetch … 404 (Not Found)”

Ensure your angular.json build assets include public:

"assets": [
  "src/favicon.ico",
  "src/assets",
  "public"
]


Then restart the dev server or rebuild.
(If the CLI added public automatically, you’re set. The error appears when the folder isn’t copied.)

“Service worker not registering in dev”

Expected. Angular disables SW in dev. Build with --configuration=production and serve from dist.

Voice search doesn’t start

Check site permissions for microphone.

Some browsers (e.g., Firefox, Safari desktop) don’t support the API.

Geolocation not working

Ensure the site is served from HTTPS (or http://localhost).

If the browser previously denied permission, reset permissions in the site settings.

🗺️ Key Commands
# Dev
ng serve

# Lint
ng lint

# Unit tests
ng test

# Prod build (PWA on)
ng build --configuration=production

🛣️ Roadmap / Next Steps

Wire UV index, visibility, pressure, sunrise & sunset on Compare (Open-Meteo supports these).

Add search suggestions debounce and keyboard navigation.

Error toasts (voice/geocode failures, network hiccups).

Offline detail: show last cached result badges, “viewed X min ago”.

Shareable URLs for selected city and compare sets.

Accessibility: focus states, ARIA for menus, reduced-motion support.

📄 License

MIT — feel free to use and adapt.
