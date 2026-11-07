# Illustration prompts

The app ships with built-in SVG illustrations. To replace any of them with your own AI-generated images:

1. Generate an image with one of the prompts below (ChatGPT / DALL·E, Midjourney, Gemini, Ideogram…).
2. Save it as `public/illustrations/<key>.png` (for example `public/illustrations/step0.png`).
3. Add the key to `generatedImages` in `lib/config.js`, e.g. `generatedImages: ["welcome", "step0"]`.

**Size:** landscape 16:10 (e.g. 1600×1000). Keep important content away from the edges.

**Shared style (paste at the start of every prompt):**
> Flat vector illustration, friendly and simple, soft pastel colours with Bahrain red (#CE1126) accents, clean white background, no text, no logos, no brand names, rounded shapes, diverse Middle-Eastern and South-Asian people, modern Bahrain setting, left-hand-drive cars driving on the right side of the road.

| Key | Prompt (after the shared style) |
|---|---|
| `welcome` | A happy young expat standing next to a beige sedan on a sunny Bahrain road with palm trees and the Bahrain World Trade Center skyline in the distance, holding car keys. |
| `step0` | A hand holding a smartphone showing a generic red calendar-appointment app being downloaded, with a download arrow icon. |
| `step1` | A person sitting on a sofa booking an appointment on a smartphone; a large calendar with one day ticked in green floats next to them. |
| `step2` | Inside a government traffic office: a person doing an eye test, reading letters from an eye chart, while holding an ID card and a bank card. |
| `step3` | A close-up of a generic learner driving permit card with a big red "L" plate next to it, and a small learner driving handbook. |
| `step4` | A driving instructor in the passenger seat calmly pointing ahead while a learner driver holds the steering wheel (left-hand drive car) with a red L plate on the car; a clock showing hours of practice. |
| `step5` | A driving examiner with a clipboard checklist standing next to a training car on a closed test track with cones and a reverse-parking bay. |
| `step6` | A smiling person holding a new driving licence card, with confetti, next to their car. |
| `costs` | A neat stack of Bahraini dinar banknotes and coins next to a receipt with a green tick, simple and clean. |
| `docs` | A flat-lay of a national ID card, a photocopy of the ID card, a bank debit card and a pair of glasses on a table. |

The **lesson pictures** (seat/mirrors, lanes, roundabout, traffic lights, signs, pedestrians, reversing, exam tips) are interactive. Their tappable numbered spots sit at exact positions in the SVG drawing, so they cannot be replaced by flat images without moving the hotspots too.
