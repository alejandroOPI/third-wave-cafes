import { cities, cafes, cortinaAlternatives } from "./data.js";

mapboxgl.accessToken = "pk.eyJ1IjoiYWxlamFuZHJvb3BpIiwiYSI6ImNtNWw0dnBoZzJhbHkya3B6ZWVsMnRrdXEifQ.Uh_ceEJWjudge6xy9GnXTA";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [7.5, 46.5], // Center on Europe
  zoom: 4.5,
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

const markers = [];

function addMarkers(city = "all") {
  markers.forEach(m => m.remove());
  markers.length = 0;

  const filtered = city === "all" ? cafes : cafes.filter(c => c.city === city);
  
  filtered.forEach(cafe => {
    if (!cafe.coordinates) return;
    
    const el = document.createElement("div");
    el.className = "marker";
    el.style.cssText = "width:24px;height:24px;background:#8B4513;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer;";
    
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <strong>${cafe.name}</strong><br>
      <small>${cafe.address}</small><br>
      <em>${cafe.specialty}</em><br>
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.address)}" target="_blank" style="color:#8B4513;">Directions</a>
    `);
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat(cafe.coordinates)
      .setPopup(popup)
      .addTo(map);
    
    markers.push(marker);
  });

  // Fit bounds if filtered
  if (city !== "all" && filtered.length > 0) {
    const cityData = cities.find(c => c.name === city);
    if (cityData) {
      map.flyTo({ center: cityData.center, zoom: city === "Paris" ? 12 : 13 });
    }
  } else if (city === "all") {
    map.flyTo({ center: [7.5, 46.5], zoom: 4.5 });
  }
}

function renderList(city = "all") {
  const container = document.getElementById("cafe-list");
  if (!container) return;
  
  let filtered = city === "all" ? cafes : cafes.filter(c => c.city === city);
  
  // Handle Cortina
  if (city === "Cortina d'Ampezzo") {
    container.innerHTML = `
      <div class="cortina-notice">
        <h3>No Third-Wave Coffee in Cortina</h3>
        <p>Cortina d'Ampezzo is a traditional Italian ski town without specialty coffee shops. Enjoy classic Italian espresso instead - the mountain views make up for it!</p>
        <h4>Traditional Alternatives:</h4>
        <ul>
          ${cortinaAlternatives.map(a => `<li><strong>${a.name}</strong> - ${a.note}</li>`).join("")}
        </ul>
      </div>
    `;
    return;
  }
  
  if (filtered.length === 0) {
    container.innerHTML = "<p>No cafes found for this city.</p>";
    return;
  }
  
  container.innerHTML = filtered.map(cafe => `
    <article class="cafe-card">
      <div class="cafe-color" style="background:${getColorForCity(cafe.city)}"></div>
      <div class="cafe-info">
        <h3>${cafe.name}</h3>
        <p class="cafe-city">${cafe.city}</p>
        <p class="cafe-address">${cafe.address}</p>
        <p class="cafe-specialty">${cafe.specialty}</p>
        <a class="cafe-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.address)}" target="_blank">
          Get Directions
        </a>
      </div>
    </article>
  `).join("");
}

function getColorForCity(city) {
  const colors = {
    "Paris": "#E6B17E",
    "Milan": "#D4A574", 
    "Venice": "#C49A6C",
    "Cortina d'Ampezzo": "#A68B5B"
  };
  return colors[city] || "#8B4513";
}

// Filter buttons
document.querySelectorAll(".filter-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const city = btn.dataset.city;
    addMarkers(city);
    renderList(city);
  });
});

// Initialize
map.on("load", () => {
  addMarkers();
  renderList();
});
