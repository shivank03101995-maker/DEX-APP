# dex-api

Minimal Express + MongoDB (Mongoose) API for:

- Storing user details (email/password or wallet)
- Verifying credentials (email/password or wallet)

## Setup

1. Create `.env` from `.env.example`
2. Install deps: `npm install`
3. Run: `npm run dev`

## Endpoints

- `GET /health`
- `POST /auth/register/email` `{ "email": "...", "password": "...", "name": "..." }`
- `POST /auth/register/wallet` `{ "walletAddress": "0x...", "name": "..." }`
- `POST /auth/login/email` `{ "email": "...", "password": "..." }`
- `POST /auth/login/wallet` `{ "walletAddress": "0x..." }`
