# Third Wave Coffee Map - Babymoon Trip

Mobile-first web app for mapping third-wave coffee stops across Paris, Cortina d'Ampezzo, Venice, and Milan.

## Status
- Cafe data is currently marked as unverified.
- Coordinates are intentionally empty until verified.
- City pins show approximate city centers only.

## File Structure
```
/
├── index.html
├── css/style.css
├── js/app.js
├── js/data.js
└── README.md
```

## Local Preview
Open `index.html` in a browser. (Mapbox GL JS requires a network connection to load tiles.)

## Data Verification Checklist (Required)
Before traveling, confirm for each cafe:
- Still open (not permanently closed)
- Correct address
- Accurate coordinates (within 50m)
- Actually specialty/third-wave coffee

Update `js/data.js` with verified coordinates and set `verified: true` for each entry.

## Deploy to GitHub Pages
1. Commit the repository to GitHub.
2. In GitHub: Settings -> Pages -> Build and deployment -> select `main` and `/ (root)`.
3. Save. Your site will publish at the provided URL.

## Mapbox Token
The Mapbox access token is embedded in `js/app.js` per project instructions.
