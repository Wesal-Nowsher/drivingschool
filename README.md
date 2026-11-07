# Driving Instructor Website (Next.js)

- `/yousef-ismail-m-basal` is the instructor's landing page (also reachable as `/yousef` and `/Yousef Ismail M. Basal`): hero with photo and consultation form, about, how it works, pricing, success stories, what you learn, why us, FAQ and contact. Content lives in `lib/site.js`.
- `/` is the interactive multilingual student guide (below). The old `/v1` address redirects here.
- `/admin` is the instructor dashboard. Consultation requests from the landing page are tagged "consultation".

## Student guide (/)

Instructors share one link with their students. Each student picks a language (English, العربية, اردو, हिन्दी, മലയാളം, 中文) and the app takes them through:

- **Register with your instructor:** name, WhatsApp number, nationality, area, car type, preferred time, whether they have a learner licence, notes
- The step-by-step licence process, the full cost breakdown (217 BD) and the documents needed
- 8 driving lessons to read before practical classes (progress is saved on the student's phone), with the school map, roundabout diagram and practice videos
- An 8-question practice quiz

## Instructor dashboard: `/admin`
Log in with `ADMIN_PASSWORD`. The dashboard shows every registration and lets the instructor:
- open WhatsApp with a ready-made greeting (this marks the student as *contacted*) or call them
- set a status: new → contacted → enrolled → completed / cancelled
- add private notes (payments, class times)
- search, filter, export to CSV, or delete a registration

## Run locally
```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev
```
Open http://localhost:3000 for students and http://localhost:3000/admin for the instructor.

## Deploy (free) on Vercel
1. Import this GitHub repo at vercel.com.
2. Add a free Postgres database (Vercel → Storage → Neon, or neon.tech / supabase.com) and set `DATABASE_URL`. The table is created automatically.
3. Set `ADMIN_PASSWORD` and `NEXT_PUBLIC_TEACHER_WHATSAPP`.
4. Share the deployed URL with students.

Without `DATABASE_URL`, registrations are saved to `data/registrations.json`. That works for local use or a VPS, but **not** on Vercel, where the disk is not persistent.

## Editing content
- Fees and WhatsApp number: `lib/config.js`
- Guide texts in all languages: `lib/i18n.js`
- Registration form texts: `lib/reg-i18n.js`
- Images and videos: `public/assets/`
