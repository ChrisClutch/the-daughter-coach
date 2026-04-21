# The Daughter Coach - Project Context & Architecture

**Goal:** Provide full context of the "GirlDad / Daughter Coach" MVP architecture so Claude can seamlessly understand the codebase and write code without breaking the existing constraints.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Vanilla CSS (`src/app/globals.css`) using dark/gold `#D4AF37` aesthetic. Avoid TailwindCSS.
- **Database / Auth:** Firebase Firestore (Real-time sync) + Firebase Auth (Google Sign-in).
- **Gamification / Payments:** Stripe (API Version 2025-01-27) via Next.js Edge/Node API Routes.

## Repository Structure 
```text
/src
 ├── app/
 │   ├── globals.css              # Core premium dark mode styling & variables
 │   ├── layout.tsx               # Global layout, handles Google Fonts
 │   ├── page.tsx                 # Main public landing page
 │   ├── api/
 │   │   └── checkout/route.ts    # Stripe backend to generate $100 checkout sessions
 │   └── app/
 │       ├── dashboard/page.tsx   # Premium Dad UI (Auth locked, Stripe locked)
 │       └── kid/page.tsx         # Kid Feedback UI
 ├── lib/
 │   ├── firebase.ts              # Firebase initialization (Auth, db, GoogleProvider)
 │   └── softAudit.ts             # Moderation logic for Kid feedback (Soft AI Audit)
```

## Feature Behaviors & Flows

**1. Authentication & Monetization (The Dad Flow)**
- The user hits `/app/dashboard`.
- **Gate 1:** Checked against Firebase Auth (`onAuthStateChanged`). If null, displays the "Encrypted Portal" Google Sign-in button.
- **Gate 2:** Checked against Firestore `dads/{userId}` for `hasPaid: true`. If false, displays the "$100 Father of the Year Pool" Stripe button.
- **Payment:** Hits `/api/checkout` with `dadId`. Returns a Stripe Sandbox Checkout URL. On success, redirects to `/app/dashboard?stripe_success=true`. The client-side catches this, updates the Firebase `dads` document to `hasPaid: true`, and removes the URL param.

**2. The Pairing System (Real-Time)**
- Once the Dad passes both gates, he clicks "Generate Code." A 6-digit random code is generated.
- A `pairing` document is created in Firestore.
- The Kid goes to `/app/kid`, types the 6-digit code, and hits Connect. The document status changes to `connected`.
- Both UIs use `onSnapshot` to instantly reflect the "Connection Established" state without refreshing.

**3. The Feedback System & Soft Audit**
- Kid submits a 1-5 star rating and a text comment.
- Before writing to Firestore, the request passes through `softAudit(comment)`.
- The soft audit flags destructive language (e.g., "I hate you") and saves a `{ safe: false, auditReason: string }` flag.
- The comment is saved to `pairings/{pairingCode}/feedback` sub-collection.
- The Dad UI detects the real-time update and renders the 5-stars + comment, injecting red warning text if it was soft-audited so the Dad knows it was filtered.

## Firestore Database Schema
```json
// Collection: dads
dads/{dadId} 
  - hasPaid: boolean
  - email: string

// Collection: pairings
pairings/{pairingCode}
  - dadId: string
  - dadName: string
  - status: "pending" | "connected"
  - createdAt: timestamp

  // Sub-Collection: feedback
  pairings/{pairingCode}/feedback/{autoId}
    - rating: number (1-5)
    - comment: string
    - timestamp: string
    - safe: boolean
    - auditReason: string | null
```

## Strategic Notes
- The pricing model is a competitive "Tontine/Prize Pool". Dads pay $100 upfront. Top 20% highest scoring Dads win the aggregated pool at the end of the year. Do not switch this back to the "Punitive/Fines" StickK model.
- Keep all UI dark, heavy, and sophisticated. "Dad as Yoda, Kid as Luke." Avoid gamified badges or playful CSS. Everything should feel like an exclusive executive mastermind.
