# Driving Instructor Website (plain HTML, CSS, JS)

No framework and no build step. Any static host (Vercel, Netlify, GitHub Pages) can serve the folder as it is.

| Address | File | What it is |
|---|---|---|
| `/` | `index.html` + `js/guide.js` | Student guide: language, payment details, process guide, game-style driving lessons (6 languages) |
| `/yousef-ismail-m-basal` | `yousef-ismail-m-basal/index.html` + `js/landing.js` | Instructor landing page for Google Ads: hero with consultation form, pricing in 4 payments, reviews, FAQ |
| `/privacy` | `privacy/index.html` | Privacy policy (required for Google Ads lead forms) |

`/yousef`, `/Yousef Ismail M. Basal` and `/v1` redirect via `vercel.json`.

## Settings: `js/config.js`
- `whatsapp`, `phone`: the instructor's numbers (digits with country code). WhatsApp and call buttons appear once set.
- `formEndpoint`: where the consultation form is sent (e.g. a Formspree form URL or a Google Apps Script web app that writes to a Google Sheet). If empty, the form opens WhatsApp with the details filled in.
- `googleAdsId` and `conversions`: Google Ads conversion tracking. Form submissions, WhatsApp taps and call taps are reported as conversions.
- `fees`: prices used by the guide.

## Content
- Guide texts: `js/data/i18n.js`, `hub-i18n.js`, `ui-i18n.js`, `game-i18n.js`
- Lesson pictures and animations: `js/data/scenes.js`
- Landing page text: edit `yousef-ismail-m-basal/index.html` directly
- Success stories: add photos to `/reviews/` and list them in `js/data/reviews.js` (only real students who agreed). While empty, clearly marked sample reviews are shown.

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 and http://localhost:8000/yousef-ismail-m-basal/
