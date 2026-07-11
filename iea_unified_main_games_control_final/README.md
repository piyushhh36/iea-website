# International English Academy India — Premium Animated Website

Open `index.html` in a browser.

## Included Pages
- `index.html` — cinematic home page
- `everyday-english.html` — Everyday English programme
- `levels.html` — A1-C2 level pathway
- `tasks-games.html` — reusable activity engine and demo game
- `clubs.html` — club overview
- `awareness-club.html`, `reading-club.html`, `film-club.html`
- `pricing.html`, `process.html`, `blog.html`, `about.html`, `trainer.html`, `contact.html`
- `login.html` / `portal.html` — Admin, Editor and Student frontend portal

## Features
- Dark/light mode
- Premium loading screen
- GSAP scroll animation
- Three.js animated hero scene
- Magnetic buttons and mouse-reactive 3D cards
- Horizontal scrolling campus section
- Activity engine templates
- Demo grammar game
- Role-based admin/editor/student portal
- Enquiry form saved in localStorage
- Search overlay
- FAQ accordion
- WhatsApp CTA
- SEO metadata and EducationalOrganization schema

## Important
This is a complete static frontend foundation. Real authentication, CMS, payment, CRM, email automation, analytics persistence and WhatsApp Business automation require backend/API integration.


## Unified Main Website + Games Portal Merge

This version keeps the premium main academy website as the public website and uses the games portal as the single login system.

- Public main website remains on `index.html`.
- Tasks & Games opens the game section from `tasks-games.html`.
- All roles login only from `login.html`.
- Student panel: `student.html`.
- Editor panel: `editor.html`.
- Admin panel: `admin.html`.
- Admin/Editor → Media uploads are shared into the main website homepage media section.
- Admin/Editor → All Page Controls now includes main academy pages and game pages.
- Text/content fields in All Page Controls can override the first hero/title/subtitle/buttons of the selected page.

Demo logins:
- Student: student@iea.in / student123
- Editor: editor@iea.in / editor123
- Admin: admin@iea.in / admin123
- Anshu Admin: clickansh@gmail.com / admin123



## Google Sheets Trial Database Connection

This version is connected to the Apps Script Web App URL:

https://script.google.com/macros/s/AKfycbxeQhbISx0sG6cr7Upr0hUSe_RtNHoimX1mBF6qn69nmQhgQDhKvuL66Fquw51AEX1CNw/exec

Main connector file:
`assets/js/iea-sheets-api.js`

How it works in this trial version:
- Google Sheets stores text/data/questions/page controls.
- Cloudinary/Google Drive links can be saved in the MediaLibrary sheet.
- The website reads Sheets data on page load and merges it into the existing local demo database.
- Admin/Editor saves are also synced back to the Google Sheet through Apps Script.
- For large media files, upload to Cloudinary or Google Drive and paste the URL into the Admin/Editor media panel or the Sheet.

Test URLs:
- `https://script.google.com/macros/s/AKfycbxeQhbISx0sG6cr7Upr0hUSe_RtNHoimX1mBF6qn69nmQhgQDhKvuL66Fquw51AEX1CNw/exec?action=ping`
- `https://script.google.com/macros/s/AKfycbxeQhbISx0sG6cr7Upr0hUSe_RtNHoimX1mBF6qn69nmQhgQDhKvuL66Fquw51AEX1CNw/exec?action=read&sheet=Pages`

Trial warning:
This is not a secure production login/database yet. It is suitable for testing. For a real academy portal with private student progress, migrate to Supabase or Firebase later.
