// Cafe data inline (no ES modules needed)
const cafes = [
  // Paris
  { name: "Belleville Brulerie", city: "Paris", address: "10 Rue Pradier, 75019", specialty: "House-roasted single origins", coordinates: [2.3827, 48.8773] },
  { name: "Coutume Cafe", city: "Paris", address: "47 Rue de Babylone, 75007", specialty: "Scandinavian-style light roasts", coordinates: [2.3173, 48.8515] },
  { name: "Ten Belles", city: "Paris", address: "10 Rue de la Grange aux Belles, 75010", specialty: "Excellent pastries + coffee", coordinates: [2.3647, 48.8737] },
  { name: "Boot Cafe", city: "Paris", address: "19 Rue du Pont aux Choux, 75003", specialty: "Tiny space, great flat white", coordinates: [2.3636, 48.8640] },
  { name: "Cafe Lomi", city: "Paris", address: "3 Ter Rue Marcadet, 75018", specialty: "Industrial roastery space", coordinates: [2.3503, 48.8918] },
  { name: "Fragments", city: "Paris", address: "76 Rue des Tournelles, 75003", specialty: "Brunch + specialty coffee", coordinates: [2.3661, 48.8568] },
  { name: "Telescope", city: "Paris", address: "5 Rue Villedo, 75001", specialty: "Pioneer of Paris specialty", coordinates: [2.3378, 48.8661] },
  { name: "KB CafeShop", city: "Paris", address: "53 Avenue Trudaine, 75009", specialty: "Aussie vibes, avocado toast", coordinates: [2.3404, 48.8818] },
  // Milan
  { name: "Orsonero", city: "Milan", address: "Via Broggi 15, 20129", specialty: "Best specialty in Milan", coordinates: [9.2075, 45.4774] },
  { name: "Cafezal", city: "Milan", address: "Via Cesare Battisti 1, 20122", specialty: "Brazilian owners, excellent espresso", coordinates: [9.1895, 45.4628] },
  { name: "Sevengrams", city: "Milan", address: "Via Spadari 6, 20123", specialty: "Light roasts, modern space", coordinates: [9.1860, 45.4630] },
  // Venice
  { name: "Torrefazione Cannaregio", city: "Venice", address: "Fondamenta dei Ormesini 2804, 30121", specialty: "One of few specialty spots", coordinates: [12.3267, 45.4458] },
];

const cities = [
  { name: "Paris", center: [2.3522, 48.8566] },
  { name: "Cortina d'Ampezzo", center: [12.1357, 46.5405] },
  { name: "Venice", center: [12.3155, 45.4408] },
  { name: "Milan", center: [9.1900, 45.4642] },
];

mapboxgl.accessToken = "pk.eyJ1IjoiYWxlamFuZHJvb3BpIiwiYSI6ImNtNWw0dnBoZzJhbHkya3B6ZWVsMnRrdXEifQ.Uh_ceEJWjudge6xy9GnXTA";

let map, markers = [];

function init() {
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v11",
    center: [7.5, 46.5],
    zoom: 4.5,
  });
  map.addControl(new mapboxgl.NavigationControl(), "top-right");
  map.on("load", () => { addMarkers(); renderList(); });
  
  document.querySelectorAll(".filter-button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const city = btn.dataset.city;
      addMarkers(city);
      renderList(city);
    });
  });
}

function addMarkers(city = "all") {
  markers.forEach(m => m.remove());
  markers.length = 0;
  const filtered = city === "all" ? cafes : cafes.filter(c => c.city === city);
  
  filtered.forEach(cafe => {
    const el = document.createElement("div");
    el.style.cssText = "width:24px;height:24px;background:#8B4513;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer;";
    
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<strong>" + cafe.name + "</strong><br><small>" + cafe.address + "</small><br><em>" + cafe.specialty + "</em><br>" +
      "<a href='https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(cafe.name + " " + cafe.address) + "' target='_blank' style='color:#8B4513;'>Directions</a>"
    );
    
    markers.push(new mapboxgl.Marker(el).setLngLat(cafe.coordinates).setPopup(popup).addTo(map));
  });

  if (city !== "all" && city !== "Cortina d'Ampezzo") {
    const c = cities.find(x => x.name === city);
    if (c) map.flyTo({ center: c.center, zoom: 12 });
  } else if (city === "all") {
    map.flyTo({ center: [7.5, 46.5], zoom: 4.5 });
  }
}

function renderList(city = "all") {
  const container = document.getElementById("cafe-list");
  if (!container) return;
  
  if (city === "Cortina d'Ampezzo") {
    container.innerHTML = '<div class="cortina-notice"><h3>No Third-Wave Coffee</h3><p>Cortina is a traditional ski town. Enjoy classic Italian espresso at Embassy or Lovat.</p></div>';
    return;
  }
  
  const filtered = city === "all" ? cafes : cafes.filter(c => c.city === city);
  container.innerHTML = filtered.map(cafe => 
    '<article class="cafe-card"><div class="cafe-info"><h3>' + cafe.name + '</h3>' +
    '<p class="cafe-city">' + cafe.city + '</p>' +
    '<p class="cafe-address">' + cafe.address + '</p>' +
    '<p class="cafe-specialty">' + cafe.specialty + '</p>' +
    '<a class="cafe-link" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cafe.name + " " + cafe.address) + '" target="_blank">Get Directions</a></div></article>'
  ).join("");
}

document.addEventListener("DOMContentLoaded", init);
