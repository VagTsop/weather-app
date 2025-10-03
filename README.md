# 🌤️ Weather Now – Angular PWA

A modern Progressive Web App (PWA) built with **Angular** that provides real-time weather forecasts, animated backgrounds, location search, voice input, favorites, and a compare mode for multiple places.  

## ✨ Features

- **Dashboard**
  - Current weather with animated backgrounds
  - Daily and hourly forecasts
  - Paging for hourly view
  - Auto-detect location (with permission)
  - Retry on API errors

- **Search & Navigation**
  - Search bar with autocomplete results
  - Voice search 🎤 (via SpeechRecognition API)
  - Favorites bar (quick switch between saved places)
  - "Use my location" button (geolocation API)

- **Compare Mode**
  - Search and add multiple cities
  - Side-by-side comparison cards
  - Displays temperature, humidity, wind, precipitation
  - Sunrise & sunset visualization

- **Customization**
  - Theme toggle: **Auto / Light / Dark**
  - Units toggle: Metric ↔ Imperial
  - Settings persist in `localStorage`

- **PWA Features**
  - Installable on desktop and mobile
  - Offline caching with Angular Service Worker
  - Fast reloads & background sync

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI

### Install

npm install

ng serve

src/
 ├── app/
 │   ├── core/           # services, stores, utils
 │   ├── features/
 │   │   ├── dashboard/  # main dashboard
 │   │   ├── compare/    # compare locations
 │   └── shared/         # reusable components
 ├── assets/             # icons, backgrounds
 └── styles.css

## 🛠️ Tech Stack

Angular 16+

RxJS Signals

Open-Meteo API (forecast & geocoding)

PWA with Service Worker

## 📸 Screenshots

🔮 Next Steps

## Weather alerts & notifications

Offline fallback page

Charts for hourly/daily trends

Better accessibility support

## 📄 License


👉 Save this content into a file called **`README.md`** in your project root. GitHub will automatically render it with the nice formatting.  

Do you want me to also add **shields.io badges** (Angular, TypeScript, PWA, API) at the top for extra polish?

```bash

