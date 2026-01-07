# Agent Build Instructions for Third-Wave Coffee App

## Project Type
This is a **pure static web project** - NO npm, NO build tools, NO frameworks.

## How to Build
```bash
# There is no build step. The files are ready to serve.
# To test locally, use Python's built-in server:
python3 -m http.server 8000

# Or use any static file server
```

## How to Test
1. Open `index.html` in a browser
2. Test on mobile: Chrome DevTools → Toggle Device Toolbar → iPhone SE (375px)
3. Check browser console for errors (should be zero)
4. Verify all 48 cafés load from the data
5. Test map markers appear
6. Test that links to Google Maps open correctly

## File Structure
```
/
├── index.html          # Single HTML file
├── css/style.css       # All styles
├── js/
│   ├── app.js          # Main logic
│   ├── data.js         # Embedded café data (from JSON)
│   └── map.js          # Mapbox integration
├── chatgpt-research-full.json  # Source data (48 cafés)
├── PROMPT.md           # Requirements
└── README.md           # User documentation
```

## Critical Learnings from Previous Attempts

### What Broke Last Time
1. **ES Modules don't work with file://** - Used `import/export` which fails when opening HTML directly
2. **Fetching local JSON fails** - `fetch('./data.json')` doesn't work with file://
3. **Missing coordinates** - Many cafés have null lat/lng, app broke trying to plot them

### Solutions
1. **NO ES modules** - Use regular `<script>` tags in order, global variables
2. **Embed data in JS** - Convert JSON to `const CAFES = [...]` in data.js
3. **Handle null coordinates** - Group at city center, or skip from map but show in list

### JavaScript Pattern to Use
```html
<!-- In index.html - ORDER MATTERS -->
<script src="js/data.js"></script>  <!-- Defines window.CAFE_DATA -->
<script src="js/map.js"></script>   <!-- Uses window.CAFE_DATA -->
<script src="js/app.js"></script>   <!-- Main app logic -->
```

```javascript
// In data.js - NO import/export
window.CAFE_DATA = {
  paris: [...],
  milan: [...],
  // etc
};
```

## Data Source
The café data is in `chatgpt-research-full.json`. This was researched by ChatGPT Pro Deep Research and includes:
- 22 cafés in Paris (by arrondissement)
- 11 cafés in Switzerland (Zurich, Geneva, Lausanne, Bern, Basel, Lucerne)
- 5 cafés in Venice (by sestiere)
- 10 cafés in Milan (by neighborhood)
- 0 cafés in Cortina (honest - no specialty coffee there)

## Mapbox Token
```
pk.eyJ1IjoiYWxlamFuZHJvb3BpIiwiYSI6ImNtNWw0dnBoZzJhbHkya3B6ZWVsMnRqdXEifQ.Uh_ceEJWjudge6xy9GnXTA
```

## City Center Coordinates (for cafés without coords)
```javascript
const CITY_CENTERS = {
  'Paris': [2.3522, 48.8566],
  'Milan': [9.1900, 45.4642],
  'Venice': [12.3155, 45.4408],
  'Zurich': [8.5417, 47.3769],
  'Geneva': [6.1432, 46.2044],
  'Lausanne': [6.6323, 46.5197],
  'Bern': [7.4474, 46.9480],
  'Basel': [7.5886, 47.5596],
  'Lucerne': [8.3093, 47.0502],
};
```

## Quality Gates Before Committing

### Must Pass
- [ ] `index.html` opens without console errors
- [ ] All 48 cafés visible in list view
- [ ] Map loads with Mapbox tiles
- [ ] Mobile layout works at 375px (no horizontal scroll)
- [ ] Tap targets are 44px minimum
- [ ] Cortina shows "no specialty coffee" message
- [ ] Google Maps direction links work

### Nice to Have
- [ ] Smooth animations
- [ ] Marker clustering
- [ ] Offline-capable

## Git Workflow
```bash
# After making changes:
git add -A
git commit -m "feat: description of what changed"
git push origin main
```

## Deployment
The repo is set up for GitHub Pages. After pushing to main, the site will be live at:
https://alejandroopi.github.io/third-wave-cafes/

## Common Mistakes to Avoid
1. Don't use `import` or `export` statements
2. Don't fetch local files - embed data in JS
3. Don't forget to handle null coordinates
4. Don't use external image URLs that might break
5. Don't make tap targets smaller than 44px
6. Don't skip mobile testing
