# El Contador EC – Demo

A **frontend-only demo** of an accounting and tax services web application. This repository does not connect to a real backend or payment processor. All data is mock, and payments are disabled.

## Purpose

This demo was built for a company to showcase the application’s UI and flows. It is presented **with the company’s permission**, in a limited form: no sensitive information or architecture is shown (no real backend, credentials, or internal design).

Use it to:

- Browse categories and services
- Sign in as **Manager** (admin) or **Client** to explore different roles
- View the admin panel (manager), cart, profile, and service pages

No real API keys, credentials, or payment data are stored in the repo. The demo uses in-memory mock data only.

## Tech stack

- **React** 19  
- **Vite** 6  
- **react-router-dom** 7  

## Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)

## Setup and run

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Demo mode is **on by default** (no backend or `.env` required). To use a real backend instead, set `VITE_DEMO_MODE=false` in a `.env` file.

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (e.g. `http://localhost:5173`).

## Demo usage

1. On the first screen, you’ll see **“This is a demo”** and two options:
   - **Sign in as Manager** – access the admin panel and manage categories, services, and items.
   - **Sign in as Client** – browse services, add items to the cart, and view profile.

2. A blue banner at the top reminds you that this is a demo and no real data or payments are used.

3. All data (categories, services, cart, cards) is mock. The payment step shows: *“Payment is disabled in this demo.”*

4. To switch roles, sign out and choose the other role on the demo home screen.

## How to access the Admin Panel

1. **Sign in as Manager** on the demo home page (this signs you in as an admin).
2. Go to **My profile** (click your name or “My orders” in the header, then open your profile).
3. In the profile sidebar, click **Admin Panel**.

### Screenshots

*My profile – sidebar with "Admin Panel" link:*

<img width="1795" height="845" alt="image" src="https://github.com/user-attachments/assets/df0c3bb3-2b3d-4dad-aa61-c172c19e99ac" />


*Admin Panel:*

<img width="1927" height="839" alt="image" src="https://github.com/user-attachments/assets/c0f04946-3eb3-444a-910c-ab6809fc087c" />



## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start Vite dev server      |
| `npm run build`| Production build           |
| `npm run preview` | Preview production build |

## Sensitive data

- The repository is intended to be **safe to push**: no real API keys or payment credentials are committed.
- Paymentez (or other payment) keys are **not** in the codebase; they are read from environment variables when not in demo mode (see `.env.example` for optional variable names).
- Demo mode uses only mock data and does not call any external API or payment service.

## Optional: non-demo mode

If you have a real backend and optional Paymentez env vars, you can run without demo mode by setting `VITE_DEMO_MODE=false` or removing it. Then configure:

- `VITE_ENVIRONMENT` – e.g. `development` or `production`
- Optionally: `VITE_PAYMENTEZ_APP_CODE`, `VITE_PAYMENTEZ_APP_KEY` (never commit real values)

See `.env.example` for the list of optional variables.

## License

Built for demonstration purposes. All rights reserved.
