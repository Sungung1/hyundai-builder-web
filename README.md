# MeetSync

MeetSync is a production-ready availability coordination app built with Next.js 14, TypeScript, Tailwind CSS, Drizzle ORM, Cloudflare D1, and Cloudflare Workers deployment via OpenNext.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Zustand
- Drizzle ORM + Cloudflare D1
- Cloudflare Workers / Pages-compatible deployment with `@opennextjs/cloudflare`

## Features

- SaaS-style landing page with meeting creation flow
- Shareable meeting rooms at `/meeting/[slug]`
- Weekly availability grid with 30-minute slots from 08:00 to 22:00
- Click and drag selection for desktop and tap-friendly mobile interaction
- Participant roster with generated colors
- Overlap heatmap and ranked best-time suggestions
- Live refresh via polling for near-real-time collaboration
- Dark mode support

## Project Structure

```text
app/
components/
api/
db/
lib/
styles/
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy the local env template:

```bash
cp .dev.vars.example .dev.vars
```

3. Create a D1 database and update `wrangler.toml` with your real `database_id`.

4. Run migrations locally or remotely:

```bash
npm run db:generate
npm run db:migrate
```

5. Start the Next.js dev server:

```bash
npm run dev
```

6. Preview the production worker locally:

```bash
npm run preview
```

## API Endpoints

- `POST /api/createMeeting`
- `POST /api/joinMeeting`
- `POST /api/saveAvailability`
- `GET /api/availability?slug=<meeting-slug>`
- `GET /api/bestTimes?slug=<meeting-slug>`

## Database

The initial migration lives at [db/migrations/0000_initial.sql](/home/user/sungung/db/migrations/0000_initial.sql).

Tables:

- `meetings`
- `participants`
- `availability`

## Deployment To Cloudflare

1. Create a Cloudflare D1 database:

```bash
npx wrangler d1 create meetsync-db
```

2. Update `wrangler.toml` with the returned database ID.

3. Apply migrations:

```bash
npx wrangler d1 migrations apply meetsync-db --local
npx wrangler d1 migrations apply meetsync-db --remote
```

4. Build and deploy:

```bash
npm run deploy
```

For Cloudflare dashboard builds, use:

- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`

## Notes

- The app uses polling for live updates to keep the deployment simple and reliable on Cloudflare.
- Run `npm run cf-typegen` after changing bindings in `wrangler.toml`.
- Cloudflare’s current guidance for full-stack Next.js routes deployment through the Workers runtime with `@opennextjs/cloudflare`; Pages remains suitable for static Next.js builds.
