# RYFT Landing Page

Marketing site for **RYFT** — a product positioned around turning long-form text and web novels into high-quality audiobooks. The app is a single-page **React** experience with **client-side routing** for legal pages, optional **Supabase** authentication, **Paddle Billing** checkout overlays, optional **PostHog** analytics, and a **Web3Forms**-backed support form.

This document explains how the project is structured, how each major feature works, and how to run and configure it.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, TypeScript |
| Build | Vite 8, `@vitejs/plugin-react` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), custom `@theme` tokens in `src/index.css` |
| Motion | Framer Motion |
| Icons | Lucide React |
| Routing | React Router v7 (`BrowserRouter`, `Routes`, `Route`) |
| Auth | Supabase Auth (`@supabase/supabase-js`) — email/password + Google OAuth |
| Payments | Paddle.js (`@paddle/paddle-js`) — overlay checkout |
| Analytics | PostHog (`posthog-js`, optional `PostHogProvider`) |

Fonts are loaded in `index.html` (Inter, JetBrains Mono). Open Graph and Twitter card meta tags are defined there for link previews.

---

## Quick start

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
# Edit .env with your keys (see Environment variables below)
npm run dev
```

- **Development:** `npm run dev` — default Vite URL is `http://localhost:5173/`.
- **Production build:** `npm run build` runs `tsc -b` then `vite build`; output is `dist/`.
- **Preview build locally:** `npm run preview`.
- **Lint:** `npm run lint`.

---

## Project structure

```
src/
  App.tsx                 # Router + scroll restoration helper
  main.tsx                # Root render: PostHog (optional) → AuthProvider → App
  index.css               # Tailwind + @theme colors/fonts + landing animations
  vite-env.d.ts           # Typed Vite env vars

  pages/
    LandingPage.tsx       # Main long-scroll marketing page (most UI lives here)
    PrivacyPolicyPage.tsx
    TermsPage.tsx
    RefundPolicyPage.tsx

  components/             # Modals, hero pipeline, footer, marquee, etc.
  contexts/
    AuthContext.tsx       # Session, signIn / signUp / Google / signOut, PostHog identify

  config/
    contact.ts            # SUPPORT_EMAIL (mailto + Web3Forms copy)
    socialLinks.ts        # Footer / social URLs

  hooks/
    useVoiceManifest.ts   # Fetches public voice manifest

  lib/
    supabase.ts           # Browser Supabase client singleton
    paddle.ts             # Paddle init + price ID helpers
    posthogConfig.ts      # PostHog provider options
    contactForm.ts        # Web3Forms submit + mailto fallback
    landingScrollRestore.ts
    voiceManifest.ts      # Types, defaults, URL resolution for /voices/*

public/                   # Static assets (served at site root)
  voices/
    manifest.json         # Optional: overrides default voice list for VoiceMarquee
    audio/ , images/      # Voice samples and avatars (paths referenced from manifest)
```

---

## Routing and navigation

Defined in `src/App.tsx`:

| Path | Page |
|------|------|
| `/` | `LandingPage` |
| `/privacy` | `PrivacyPolicyPage` |
| `/terms` | `TermsPage` |
| `/refunds` | `RefundPolicyPage` |

**Scroll behavior**

- Visiting `/privacy`, `/terms`, or `/refunds` scrolls to the top.
- When returning to `/`, the app can **restore the previous scroll position** on the landing page: footer legal links call `rememberLandingScrollPosition()` before navigation; `consumeLandingScrollRestore()` runs when the home route mounts (`ScrollToTopOnRoute` in `App.tsx`). This uses `sessionStorage` under a fixed key (`ryft-landing-scroll-y`).

---

## Landing page: sections and behavior

`LandingPage.tsx` is a long, sectioned document with anchor IDs used by the fixed nav.

### Navigation

- Brand control scrolls to top.
- Links: **Voices** (`#voices`), **Features** (`#unlimited-tts` — label says Features but the href targets the unlimited TTS block), **Pricing** (`#pricing`), **Support** (opens contact modal).
- **Login** opens `InterestModal` in `login` mode; signed-in users see an **account menu** (avatar, contact support, sign out).
- **Extension** opens `ExtensionLaunchModal`.

### Hero

- Large headline and subcopy.
- **HeroScrapePipeline** wraps a **chapter-editor-style preview** (`HeroChapterEditorPreview`): static “Pride and Prejudice” chapters, fake generate dock, equalizer animation — a visual stand-in for the desktop product.

### Voices (`#voices`)

- **VoiceMarquee**: horizontally scrolling strips of voice “cards.”
- Voice data comes from **`useVoiceManifest`**, which fetches `${BASE_URL}voices/manifest.json`. If the fetch fails, **`voiceManifest.ts`** supplies **default voices** (Heart, Luna, Nova, Orion, Atlas). Manifest entries can reference `images/` and `audio/` paths under `/voices/`.

### Unlimited TTS (`#unlimited-tts`)

- **LocalLibraryPreview**: illustrates local library / unlimited synthesis positioning (grid background, orbs, intro copy).

### Features (`#features`)

- “Batch export in any format” narrative with a fake download-queue UI (progress bars, queued items).

### Multi-cast (`#features` area — character casting)

- Large “Custom Voice for each Character” section with a **scanner animation** and “detected cast” cards. Copy states **Multi-Cast is coming soon** (not available in current build).

### Pricing (`#pricing`)

Two modes driven by **constants** at the top of `LandingPage.tsx`:

- **`BETA_LIFETIME_SEATS_CLAIMED` vs `BETA_LIFETIME_SEATS_TOTAL`**  
  While seats remain, the page shows the **Founding lifetime** offer (price, seat scarcity UI, roadmap column, **Claim a founding seat** → `InterestModal` `beta-lifetime`).
- When “sold out,” the UI switches to **monthly/yearly subscription** toggle and **Subscribe** → `InterestModal` `subscribe`.

Seat “social proof” (progress bar and “X / 100 left”) is gated by **`BETA_SEATS_SOCIAL_PROOF_THRESHOLD`** so the bar stays hidden until enough seats are “claimed” in the constant.

### Footer

- RYFT branding, copyright, legal links (React Router `Link`), **Contact support** button, **SocialFooterLinks** (URLs from `src/config/socialLinks.ts` — e.g. Instagram, Discord).

### Global chrome

- **`LandingScrollProgress`**: reading/scroll progress indicator.
- **`body.landing-page`** class toggled on mount for page-specific styling.

Framer Motion **`useReducedMotion`** scales back transforms where appropriate.

---

## Modals and flows

### `InterestModal` (`src/components/InterestModal.tsx`)

Shared modal with three **`InterestKind`** values:

| Kind | Purpose |
|------|---------|
| `login` | **`LoginAuthPanel`** — email/password, Google OAuth, sign up |
| `beta-lifetime` | Founding-seat Paddle checkout (when `lib/paddle` reports founding price + token configured) |
| `subscribe` | Subscription Paddle checkout (when subscription price env vars + token are set) |

**Paddle** is opened with **`Checkout.open`** and **`settings.displayMode: 'overlay'`** (in-page overlay, not a plain redirect link).

**Founding seat `customData`**

- `flow: 'landing_founding_seat'`
- `supabase_user_id`: current user id from **`supabase.auth.getUser()`**

**Subscription `customData`**

- `supabase_user_id`: from **`getUser()`** as well (for backend / webhook correlation).

Both flows require **Supabase to be configured** and a **signed-in user** before checkout opens; the UI can embed **`LoginAuthPanel`** when the user is missing.

### `ExtensionLaunchModal`

Placeholder UX for extension download / install messaging.

### `ContactSupportModal`

Collects name, email, message. If **`VITE_WEB3FORMS_ACCESS_KEY`** is set, submits to **Web3Forms** via `submitSupportMessage` in `lib/contactForm.ts`. Otherwise **`openSupportMailtoFallback`** opens the visitor’s mail client to **`SUPPORT_EMAIL`** (`config/contact.ts`, currently `support@ryft.us`).

---

## Authentication (`AuthContext`)

`src/contexts/AuthContext.tsx` wraps the app in **`main.tsx`**.

- **Session:** `getSession` on mount + `onAuthStateChange` to keep `user` / `session` in sync.
- **Sign in:** `signInWithPassword`. If Supabase returns the message **`Invalid login credentials`**, the context maps it to a **Google sign-up hint** (encourage “Continue with Google”).
- **Sign up:** `signUp` with `emailRedirectTo` set to the site origin.
- **Google:** `signInWithOAuth` with `redirectTo` current path (OAuth return lands on the same page).
- **PostHog:** After load, **`posthog.identify(user.id, { email })`** when PostHog is configured; **`posthog.reset()`** on sign-out.

`LoginAuthPanel` shows setup instructions if Supabase env vars are missing or still placeholders (`lib/supabase.ts` **`isSupabaseConfigured`**).

---

## Paddle Billing (`lib/paddle.ts`)

- **`getPaddleInstance()`** initializes Paddle once with **`VITE_PADDLE_CLIENT_TOKEN`** and environment **`sandbox`** unless **`VITE_PADDLE_ENV=production`**.
- **Founding checkout** is considered configured when **client token** and **`VITE_PADDLE_PRICE_ID`** are both set (`isPaddleCheckoutConfigured`).
- **Subscription** uses **`getPaddleSubscriptionPriceId(period)`**: monthly/yearly from **`VITE_PADDLE_SUBSCRIPTION_MONTHLY_PRICE_ID`** / **`VITE_PADDLE_SUBSCRIPTION_YEARLY_PRICE_ID`**, with fallback **`VITE_PADDLE_SUBSCRIPTION_PRICE_ID`**.

Webhook or server-side code should read **`custom_data`** (or the equivalent field in your Paddle API version) to link payments to **`supabase_user_id`** and, for founding seats, **`flow`**.

---

## PostHog (`lib/posthogConfig.ts`)

If **`VITE_POSTHOG_KEY`** is non-empty, **`main.tsx`** wraps the tree in **`PostHogProvider`** with:

- **`capture_pageview: 'history_change'`** for SPA route changes
- **`person_profiles: 'identified_only'`**
- Host from **`VITE_POSTHOG_HOST`** or US default

---

## Styling

- **Tailwind v4** with `@theme` in `index.css`: `--color-primary` (violet), `--color-secondary` (cyan), surfaces, fonts.
- Custom keyframes: equalizer, marquee `scroll`, gradient text, load bars, etc.
- Landing uses a dark **glass** aesthetic (`glass-panel`, borders, gradients) defined in CSS utilities/classes in `index.css`.

---

## Environment variables

Copy **`.env.example`** to **`.env`**. Vite only exposes variables prefixed with **`VITE_`**.

| Variable | Role |
|----------|------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `VITE_POSTHOG_KEY` | Optional PostHog project key |
| `VITE_POSTHOG_HOST` | Optional PostHog API host (EU vs US) |
| `VITE_PADDLE_CLIENT_TOKEN` | Paddle client-side token |
| `VITE_PADDLE_PRICE_ID` | Founding / one-time catalog price id |
| `VITE_PADDLE_SUBSCRIPTION_*` | Monthly/yearly/fallback subscription price ids |
| `VITE_PADDLE_ENV` | `production` for live Paddle; omit or non-production for **sandbox** |
| `VITE_WEB3FORMS_ACCESS_KEY` | Optional; enables in-browser support form submit |

Typed declarations live in **`src/vite-env.d.ts`**.

---

## Content and product toggles

- **Pricing mode:** Edit the **`BETA_*`** constants in **`LandingPage.tsx`** (lifetime vs subscription UI).
- **Social links:** **`src/config/socialLinks.ts`**.
- **Support email:** **`src/config/contact.ts`**.
- **Voices:** Add or edit **`public/voices/manifest.json`** and assets under **`public/voices/`** (see `voiceManifest.ts` for path rules).

---

## Legal and compliance pages

`PrivacyPolicyPage`, `TermsPage`, and `RefundPolicyPage` use **`LegalDocumentLayout`** for consistent typography and back navigation. They are ordinary content pages; update copy in those files as your counsel requires.

---

## Development notes

- **`import.meta.env.BASE_URL`** is respected for assets like **`/voices/manifest.json`** (subpath deployment).
- The repo is **`private`** in `package.json`; treat keys in `.env` as secrets even when “public” Supabase anon key is browser-exposed by design.
- For **Google OAuth**, configure the provider in Supabase and add redirect URLs (localhost and production) under Authentication → URL Configuration, as noted in `.env.example`.

---

## License / ownership

Project metadata in `package.json` does not declare a license; treat as proprietary unless you add one.
