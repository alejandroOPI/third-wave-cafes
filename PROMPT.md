# Third Wave Coffee Map - Babymoon Trip

## Project Goal
Build a mobile-first web app showing specialty/third-wave coffee shops for a babymoon trip through Europe. The data has already been researched - your job is to build a beautiful, functional app.

## Trip Itinerary
- Paris: Jan 6-10, 2026 (22 cafés)
- Switzerland: Jan 23-30, 2026 (11 cafés across 6 cities)
- Venice: Jan 13-14, 2026 (5 cafés)
- Milan: Jan 14-16, 2026 (10 cafés)
- Cortina d'Ampezzo: Jan 10-13, 2026 (NO specialty coffee - be honest about this)

## Data Source
The verified café data is in `chatgpt-research-full.json` (48 cafés total). DO NOT invent new cafés. Only use data from this file.

## Technical Stack
- Pure HTML/CSS/JS (NO frameworks, NO build tools, NO npm)
- Mobile-first responsive design
- Mapbox GL JS for interactive maps
- Single page app with client-side routing
- Must work when opened directly as file:// (for testing)

## Design Requirements

### Visual Style
- Warm, editorial aesthetic (think specialty coffee shop vibes)
- Color palette: cream (#FDF6E3), warm brown (#8B4513), charcoal (#2D2D2D), accent gold (#D4A574)
- Typography: System fonts, generous line-height (1.6+)
- No stock photos - use solid color cards with good typography
- Subtle shadows, rounded corners (8px)

### Mobile UX (CRITICAL)
- 44px minimum tap targets
- Bottom navigation bar (thumb-friendly)
- Card-based café list with swipe hints
- Pull-to-refresh gesture feel
- Smooth 60fps animations
- Test at 375px width (iPhone SE)

### Map Requirements
- Mapbox GL JS with custom markers
- Cluster markers when zoomed out
- Popup on tap showing café name + "Get Directions" link
- City-level zoom presets
- Current location button (if permitted)

## Features

### 1. City Selector (Landing)
- Large tappable cards for each city
- Show café count per city
- Beautiful city imagery or color gradient backgrounds

### 2. Map View
- Full-screen map with bottom sheet
- Markers colored by city
- Tap marker → show café card
- "List View" toggle

### 3. List View
- Scrollable cards organized by neighborhood
- Each card shows: Name, Neighborhood, Hours summary, Specialty type
- Tap card → expand with full details + directions link

### 4. Café Detail
- Full address
- Opening hours by day
- Specialty type (espresso/filter/roastery)
- Instagram link if available
- January closure notes (important for trip planning!)
- "Open in Google Maps" button

### 5. Cortina Special Case
- Honest message: "Cortina d'Ampezzo doesn't have third-wave specialty coffee shops"
- Suggest enjoying traditional Italian espresso bars instead
- List 2-3 recommended traditional bars

## File Structure
```
/
├── index.html          (single HTML file with all structure)
├── css/
│   └── style.css       (all styles, mobile-first)
├── js/
│   ├── app.js          (main app logic, routing, UI)
│   ├── data.js         (café data exported from JSON)
│   └── map.js          (Mapbox integration)
├── chatgpt-research-full.json  (source data - DO NOT MODIFY)
└── README.md
```

## Mapbox Token
```
pk.eyJ1IjoiYWxlamFuZHJvb3BpIiwiYSI6ImNtNWw0dnBoZzJhbHkya3B6ZWVsMnRqdXEifQ.Uh_ceEJWjudge6xy9GnXTA
```

## Coordinates Note
Many cafés in the JSON have null coordinates. For these:
1. Use the neighborhood name to place them approximately
2. Or geocode the address using Mapbox Geocoding API
3. Group null-coordinate cafés at city center with a note

## Quality Checklist
- [ ] Loads without errors in browser console
- [ ] All 48 cafés from JSON are displayed
- [ ] Map shows markers (even if clustered at city centers)
- [ ] Mobile layout works at 375px width
- [ ] Tap targets are 44px minimum
- [ ] No horizontal scroll on mobile
- [ ] Cortina shows honest "no specialty coffee" message
- [ ] Links to Google Maps work
- [ ] Colors match the warm coffee palette
- [ ] Smooth scrolling and transitions

## Anti-Patterns to Avoid
- DO NOT use ES modules (import/export) - they don't work with file://
- DO NOT fetch local JSON - embed the data in data.js
- DO NOT use placeholder images from external URLs
- DO NOT invent café data not in the JSON
- DO NOT use complex build tools
