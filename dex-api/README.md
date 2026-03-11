# dex-api

Minimal Express + MongoDB (Mongoose) API for:

- Storing user details (`POST /auth/register`)
- Verifying credentials (`POST /auth/login`)

## Setup

1. Create `.env` from `.env.example`
2. Install deps: `npm install`
3. Run: `npm run dev`

## Endpoints

- `GET /health`
- `POST /auth/register` `{ "email": "...", "password": "...", "name": "...", "walletAddress": "0x..." }`
- `POST /auth/login` `{ "email": "...", "password": "...", "walletAddress": "0x..." }`
