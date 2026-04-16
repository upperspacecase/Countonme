# Simply Accountable

> One Question. Every Day. A shared accountability tracker — did you do it today? Share with friends. Send encouragement.

## Stack

- **Next.js 14** (App Router) — deploys to Vercel out of the box
- **Remotion** — 30-second animated product demo, played live in-browser via `@remotion/player`
- **TypeScript** + **React 18**

## Pages

| Route            | Description                                         |
| ---------------- | --------------------------------------------------- |
| `/`              | Landing page                                        |
| `/demo`          | Remotion-powered animated product walkthrough       |
| `/tracker`       | Interactive accountability tracker (localStorage)   |
| `/how-it-works`  | How it works                                        |
| `/faq`           | FAQ                                                 |
| `/support`       | Support contact                                     |
| `/privacy`       | Privacy policy                                      |

## Getting started

```sh
npm install
npm run dev       # starts Next.js dev server at http://localhost:3000
```

## Remotion demo

The demo page (`/demo`) plays the Remotion composition directly in the browser — no pre-rendering needed. If you want to export a standalone mp4:

```sh
npm run remotion:preview   # Remotion Studio
npm run remotion:render    # renders public/demo.mp4
```

Scenes live under `remotion/scenes/`. Style tokens are in `remotion/theme.ts`.

## Deploy

Push to Vercel. It auto-detects Next.js — no extra config needed.

## Branch

Development happens on `claude/accountability-tracker-app-a0z6N`.
