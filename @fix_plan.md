# Fix Plan - Third Wave Coffee App v2

## Current State
- Data is ready in `js/data.js` (48 cafés, auto-generated)
- Previous attempt had ES module issues and broken map
- Need to rebuild UI from scratch with proper patterns

## Tasks

### Phase 1: Core Structure
- [ ] Create clean `index.html` with proper script loading order (no ES modules)
- [ ] Create `css/style.css` with mobile-first responsive design
- [ ] Create `js/app.js` with main app logic
- [ ] Create `js/map.js` with Mapbox integration

### Phase 2: UI Components
- [ ] City selector landing page (cards for each city)
- [ ] List view showing cafés grouped by neighborhood
- [ ] Map view with markers
- [ ] Café detail view/modal

### Phase 3: Mobile Polish
- [ ] Verify 44px tap targets
- [ ] Test at 375px width
- [ ] Add smooth transitions
- [ ] Bottom navigation bar

### Phase 4: Special Cases
- [ ] Cortina "no specialty coffee" message
- [ ] Handle cafés with null coordinates (show in list, group on map)
- [ ] Google Maps direction links

### Phase 5: Final Checks
- [ ] Zero console errors
- [ ] All 48 cafés display correctly
- [ ] Map loads with Mapbox tiles
- [ ] Mobile layout works
- [ ] Commit and push to GitHub

## Done
- [x] Generate data.js from ChatGPT research JSON
- [x] Update PROMPT.md with detailed requirements
- [x] Update @AGENT.md with learnings from failed attempt
- [x] Clean up old Ralph artifacts

## Notes
- Use `window.CAFE_DATA` global, not ES modules
- Embed data in JS, don't fetch JSON files
- City centers provided for null coordinates
- Mapbox token is in PROMPT.md
