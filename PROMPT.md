# Third Wave Coffee Map - Babymoon Trip

## Project Goal
Build a mobile-first web app showing specialty/third-wave coffee shops for a babymoon trip through Europe.

## Trip Itinerary
- Paris: Jan 6-10, 2026
- Cortina d'Ampezzo: Jan 10-13, 2026
- Venice: Jan 13-14, 2026
- Milan: Jan 14-16, 2026

## Technical Requirements
- Pure HTML/CSS/JS (no frameworks)
- Mobile-first, works great on iPhone
- 44px minimum tap targets
- Mapbox GL JS for maps
- Deploy to GitHub Pages

## Data Requirements - CRITICAL
YOU MUST VERIFY ALL DATA. Use web search to confirm:
1. Each cafe still exists (not permanently closed)
2. Correct address and coordinates
3. Is actually specialty/third-wave coffee (not just any cafe)

### Initial Research Data (VERIFY THESE):

#### PARIS
- Belleville Brulerie, 10 Rue Pradier, 75019 - roastery
- Coutume Cafe, 47 Rue de Babylone, 75007 - Scandinavian style
- Ten Belles, 10 Rue de la Grange aux Belles, 75010 - pastries+coffee
- Boot Cafe, 19 Rue du Pont aux Choux, 75003 - tiny, great flat white
- Cafe Lomi, 3 Ter Rue Marcadet, 75018 - roastery
- Fragments, 76 Rue des Tournelles, 75003 - brunch+coffee
- Telescope, 5 Rue Villedo, 75001 - pioneer
- KB CafeShop, 53 Avenue Trudaine, 75009 - Aussie vibes

#### MILAN
- Orsonero, Via Broggi 15 - best in Milan
- Cafezal, Via Cesare Battisti 1 - Brazilian
- Sevengrams, Via Spadari 6 - light roasts

#### VENICE (limited scene)
- Torrefazione Cannaregio, Fondamenta dei Ormesini 2804
- Note: Venice has very few specialty options

#### CORTINA D'AMPEZZO
- NO third-wave coffee shops exist here
- App should honestly state this and suggest enjoying traditional Italian espresso
- Can list best traditional bars: Embassy, Lovat

## Features Required
1. Map view with pins for each city
2. List view with cafe cards
3. Filter by city
4. Each cafe shows: name, address, specialty, link to Google Maps directions
5. "No specialty coffee" message for Cortina with alternatives

## Design
- Clean, minimal
- Use color placeholders (NO stock photos, NO Unsplash)
- Colors: warm coffee tones
- Typography: system fonts

## File Structure
```
/
├── index.html
├── css/style.css
├── js/app.js
├── js/data.js (verified cafe data)
└── README.md
```

## Mapbox Token
Use this token: pk.eyJ1IjoiYWxlamFuZHJvb3BpIiwiYSI6ImNtNWw0dnBoZzJhbHkya3B6ZWVsMnRrdXEifQ.Uh_ceEJWjudge6xy9GnXTA

## Acceptance Criteria
- [ ] All cafe data verified via web search
- [ ] Coordinates accurate (within 50m)
- [ ] No invented/fake cafes
- [ ] Works on mobile Safari
- [ ] Honest about Cortina lacking specialty coffee
