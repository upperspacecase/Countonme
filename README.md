# Simply Accountable

> One Question. Every Day. A shared accountability tracker — did you do it today? Share with friends. Send encouragement.

## What&rsquo;s in here

- **Landing page** — `index.html` + `styles.css` + `landing.js`
- **Interactive web tracker** — `app.html` + `app.js` (persists to `localStorage`)
- **Remotion demo** — a 30-second animated product walkthrough rendered with [Remotion](https://remotion.dev)
- **Static content pages** — `how-it-works.html`, `faq.html`, `support.html`, `privacy.html`
- **Demo embed page** — `demo.html` (plays the rendered `public/demo.mp4`)

## Remotion demo

The marketing demo is a React-based composition under `src/`.

```sh
npm install

# Live preview in the Remotion Studio
npm run preview

# Render a 30s MP4 into public/demo.mp4 (embedded on demo.html)
npm run render

# Or render a GIF
npm run render:gif
```

Scenes, in order:

1. `src/scenes/Intro.tsx` — brand + "One Question. Every Day."
2. `src/scenes/CheckIn.tsx` — phone mock, tap YES, check-mark animates in
3. `src/scenes/Week.tsx` — week grid fills one dot at a time, streak counter ticks to 5
4. `src/scenes/Friends.tsx` — 4 friend avatars pop in, network lines draw
5. `src/scenes/Encourage.tsx` — "Nudge" button presses, message bubble flies, confetti
6. `src/scenes/Outro.tsx` — brand mark + "Get started for free."

Durations are configured in `src/Demo.tsx` (`SCENE`). Style tokens live in `src/theme.ts`.

The rendered `public/demo.mp4` is gitignored by default — bake it locally before deploying, or remove the ignore line if you want to commit it.

## Static site

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Branch

Development happens on `claude/accountability-tracker-app-a0z6N`.
