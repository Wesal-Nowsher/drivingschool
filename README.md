# Driving Instructor Website (plain HTML, CSS, JS)

No framework and no build step. Any static host (Vercel, Netlify, GitHub Pages) can serve the folder as it is.

| Address | File | What it is |
|---|---|---|
| `/guide` | `guide/index.html` + `js/guide.js` | Student guide: language, payment details, process guide, game-style driving lessons (9 languages; Pashto, Amharic and Filipino texts in `js/data/guide-more/`) |
| `/` | `index.html` + `js/landing.js` | Instructor landing page for Google Ads: hero with consultation form, pricing in 4 payments, reviews, FAQ |
| `/privacy` | `privacy/index.html` | Privacy policy (required for Google Ads lead forms) |

`/yousef`, `/yousef-ismail-m-basal` redirect to `/`, and `/v1` to `/guide` (see `vercel.json`).

## Languages (landing page)
English (`/`), Arabic (`/ar`), Urdu (`/ur`), Pashto (`/ps`), Hindi (`/hi`), Malayalam (`/ml`), Amharic (`/am`), Filipino (`/fil`) and Chinese (`/zh`).
Texts live in `js/data/landing/<code>.js`: one list per language, in the same order as `en.js` (line N matches `data-i18n="tN"` in `index.html`).
To change a text, edit the same line in every language file.

## Settings: `js/config.js`
- `whatsapp`, `phone`: the instructor's numbers (digits with country code). WhatsApp and call buttons appear once set.
- `formEndpoint`: where the consultation form is sent (e.g. a Formspree form URL or a Google Apps Script web app that writes to a Google Sheet). If empty, the form opens WhatsApp with the details filled in.
- `googleAdsId` and `conversions`: Google Ads conversion tracking. Form submissions, WhatsApp taps and call taps are reported as conversions.
- `fees`: prices used by the guide.

## Content
- Guide texts: `js/data/i18n.js`, `hub-i18n.js`, `ui-i18n.js`, `game-i18n.js`
- Lesson pictures and animations: `js/data/scenes.js`
- Landing page text: edit `index.html` directly
- Success stories: add photos to `/reviews/` and list them in `js/data/reviews.js` (only real students who agreed). While empty, clearly marked sample reviews are shown.

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 and http://localhost:8000/guide/
