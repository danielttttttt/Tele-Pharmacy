# Tele-Pharmacy Frontend - Vercel Deployment Guide

## Overview
This document outlines the changes made to ensure successful deployment of the tele-pharmacy frontend application on Vercel's platform.

## Key Changes Made

### 1. Vercel Configuration
- Updated `vercel.json` to properly handle static builds with API routes
- Removed incorrect route mapping for API endpoints that would interfere with serverless functions
- Configured builds to use `@vercel/static-build` for React application

### 2. API Routes Migration
- Migrated from Express server (`server.js`) to Vercel serverless functions
- Created API routes in `/api` directory:
  - `/api/medications.js` - Medication listing and search
  - `/api/pharmacies.js` - Pharmacy listing and search
 - `/api/orders.js` - Order creation
  - `/api/orders/[id].js` - Order details
  - `/api/orders/[id]/track.js` - Order tracking
- Added CORS headers to all API routes for proper cross-origin requests

### 3. WebSocket Implementation
- Updated ChatBox component to conditionally use WebSocket only in development
- Implemented mock responses for production environment
- Updated VideoCall component to handle production environment without WebSocket
- Added environment checks to disable real-time features that require persistent connections in production
- Updated TeleConsult page to indicate that video calling requires dedicated infrastructure

### 4. Build Configuration
- Updated `vite.config.js` for optimized Vercel deployment:
  - Disabled sourcemaps in production
  - Configured code splitting with manual chunks
  - Added Firebase optimization for ESM imports
  - Included Firebase dependencies in optimization
- Fixed Firebase import issues that were causing build failures

### 5. Static Assets
- Moved logo.svg from `src/assets` to `public` directory for proper static serving
- Updated index.html to reference static assets correctly
- Fixed favicon and app icon paths

### 6. Service Worker Registration
- Moved inline service worker registration from index.html to separate file (`src/registerServiceWorker.js`)
- Added environment checks to only register service worker in production

### 7. Environment Variables
- Ensured proper handling of environment variables for different environments
- Added checks for Vercel environment variables

## Environment Variables Required for Production

The following environment variables should be configured in Vercel dashboard:

### Firebase Configuration
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Deployment Instructions

1. Push code to a Git repository
2. Import the project in Vercel dashboard
3. Set environment variables in Vercel dashboard
4. The build command `npm run build` and output directory `dist` should be detected automatically
5. Deploy

## Features Available in Production

- Medication search and browsing
- Pharmacy search and location services
- User authentication with Firebase
- Order placement and tracking
- Chat functionality (with mock responses in production)
- Profile management
- Inventory management for pharmacy accounts

## Limitations in Production

- Video calling requires a dedicated signaling server and is not available
- Chat functionality uses mock responses instead of real-time WebSocket communication
- These limitations are clearly indicated in the UI when running in production

## Testing

The application build has been tested successfully with `npm run build` command and generates optimized bundles suitable for Vercel deployment.