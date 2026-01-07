(function () {
  const data = window.CAFE_DATA;
  if (!data || !data.cities) return;

  const CITY_ORDER = [
    "Paris",
    "Cortina d'Ampezzo",
    "Venice",
    "Milan",
    "Zurich",
    "Geneva",
    "Lausanne",
    "Bern",
    "Basel",
    "Lucerne",
  ];

  const cityEntries = Object.keys(data.cities)
    .map((key) => {
      let name = key;
      if (key.indexOf("Switzerland - ") === 0) {
        name = key.replace("Switzerland - ", "");
      } else if (key === "Cortina dAmpezzo") {
        name = "Cortina d'Ampezzo";
      }
      const entry = data.cities[key];
      return {
        key,
        name,
        center: entry.center,
        cafes: entry.cafes || [],
        notes: entry.notes || [],
      };
    })
    .sort((a, b) => {
      return CITY_ORDER.indexOf(a.name) - CITY_ORDER.indexOf(b.name);
    });

  const cityCenters = {};
  const cityCounts = {};
  cityEntries.forEach((city) => {
    cityCenters[city.name] = city.center;
    cityCounts[city.name] = city.cafes.length;
  });

  const cafes = [];
  const cafeById = {};

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function buildCafeId(cityName, cafe) {
    const base = [cityName, cafe.name, cafe.address].join("-");
    return slugify(base);
  }

  function getCafeCoords(cafe, cityName) {
    const center = cityCenters[cityName] || [0, 0];
    const lng = typeof cafe.lng === "number" ? cafe.lng : center[0];
    const lat = typeof cafe.lat === "number" ? cafe.lat : center[1];
    return [lng, lat];
  }

  function specialtySummary(specialty) {
    if (!specialty) return "Specialty details unavailable";
    const parts = [];
    if (specialty.espresso) parts.push("Espresso");
    if (specialty.filter) parts.push("Filter");
    if (specialty.roastery && specialty.roastery !== "unknown") {
      if (specialty.roastery === "roaster-owned") {
        parts.push("Roastery");
      } else {
        parts.push("Multi-roaster");
      }
    }
    return parts.length ? parts.join(" + ") : "Specialty details unavailable";
  }

  function hoursSummary(hours) {
    if (!hours) return "Hours: Check listing";
    if (hours.Daily) return "Daily " + hours.Daily;
    if (hours.Mon && hours.Tue && hours.Wed && hours.Thu && hours.Fri) {
      const weekday = hours.Mon;
      if (
        hours.Tue === weekday &&
        hours.Wed === weekday &&
        hours.Thu === weekday &&
        hours.Fri === weekday
      ) {
        return "Mon-Fri " + weekday;
      }
    }
    if (hours.Mon) return "Weekdays " + hours.Mon;
    const firstKey = Object.keys(hours)[0];
    if (firstKey) return firstKey + " " + hours[firstKey];
    return "Hours: Check listing";
  }

  function mapDirectionsUrl(cafe) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(cafe.name + " " + cafe.address)
    );
  }

  function instagramUrl(handle) {
    if (!handle) return null;
    const trimmed = handle.trim();
    if (trimmed.indexOf("http") === 0) return trimmed;
    return "https://instagram.com/" + trimmed.replace("@", "");
  }

  function cortinaSuggestionsHtml() {
    const suggestions = [
      "Hotel lounge bars in the town center",
      "Neighborhood pasticcerie for espresso + pastries",
      "Apres-ski bars near Corso Italia",
    ];
    return (
      "<ul class=\"cortina-list\">" +
      suggestions.map((item) => "<li>" + item + "</li>").join("") +
      "</ul>"
    );
  }

  cityEntries.forEach((city) => {
    city.cafes.forEach((cafe) => {
      const id = buildCafeId(city.name, cafe);
      const normalized = {
        id,
        name: cafe.name,
        city: city.name,
        neighborhood: cafe.neighborhood || "Neighborhood TBD",
        address: cafe.address,
        hours: cafe.hours || {},
        specialty: cafe.specialty || {},
        instagram: cafe.instagram || null,
        januaryNotes: cafe.januaryNotes || "",
        hasExactCoords: cafe.hasExactCoords,
        coordinates: getCafeCoords(cafe, city.name),
      };
      cafes.push(normalized);
      cafeById[id] = normalized;
    });
  });

  const swissCities = [
    "Zurich",
    "Geneva",
    "Lausanne",
    "Bern",
    "Basel",
    "Lucerne",
  ];

  const swissCount = swissCities.reduce((sum, name) => {
    return sum + (cityCounts[name] || 0);
  }, 0);

  const tripItems = [
    {
      title: "Paris",
      dates: data.meta.dates.Paris,
      count: cityCounts["Paris"],
    },
    {
      title: "Cortina d'Ampezzo",
      dates: data.meta.dates.Cortina_dAmpezzo,
      count: 0,
    },
    {
      title: "Venice",
      dates: data.meta.dates.Venice,
      count: cityCounts["Venice"],
    },
    {
      title: "Milan",
      dates: data.meta.dates.Milan,
      count: cityCounts["Milan"],
    },
    {
      title: "Switzerland",
      dates: "2026-01-23 to 2026-01-30",
      count: swissCount,
      subtitle: "Across 6 cities",
    },
  ];

  const state = {
    view: "home",
    city: "All",
    selectedCafeId: null,
    lastView: "home",
  };

  function renderTripStrip() {
    const container = document.getElementById("trip-strip");
    if (!container) return;
    container.innerHTML = tripItems
      .map((item) => {
        const countText =
          item.count === 0
            ? "No specialty cafes"
            : item.count + " cafes";
        return (
          "<div class=\"trip-pill\"><strong>" +
          item.title +
          "</strong><br><span>" +
          item.dates +
          "</span><br><span>" +
          countText +
          "</span>" +
          (item.subtitle ? "<br><span>" + item.subtitle + "</span>" : "") +
          "</div>"
        );
      })
      .join("");
  }

  function cityClass(name) {
    if (name === "Cortina d'Ampezzo") return "cortina";
    return name.toLowerCase().split(" ")[0];
  }

  function renderCityCards() {
    const container = document.getElementById("city-cards");
    if (!container) return;
    container.innerHTML = cityEntries
      .map((city) => {
        const count = cityCounts[city.name] || 0;
        const countLine =
          count === 0 ? "No specialty cafes" : count + " cafes";
        const descriptor =
          city.name === "Cortina d'Ampezzo"
            ? "Traditional espresso bars instead"
            : "Tap to explore";
        return (
          "<button class=\"city-card " +
          cityClass(city.name) +
          "\" type=\"button\" data-city=\"" +
          city.name +
          "\">" +
          "<h3>" +
          city.name +
          "</h3>" +
          "<p class=\"city-count\">" +
          countLine +
          "</p>" +
          "<p>" +
          descriptor +
          "</p>" +
          "<span class=\"city-cta\">Open map</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function renderChips(containerId, activeCity, view) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = ["All"].concat(CITY_ORDER);
    container.innerHTML = items
      .map((city) => {
        const isActive = city === activeCity ? " is-active" : "";
        return (
          "<button class=\"chip" +
          isActive +
          "\" type=\"button\" data-view=\"" +
          view +
          "\" data-city=\"" +
          city +
          "\">" +
          city +
          "</button>"
        );
      })
      .join("");
  }

  function renderMapSheet(cafe, cityName) {
    const container = document.getElementById("map-sheet-content");
    if (!container) return;

    if (cityName === "Cortina d'Ampezzo") {
      container.innerHTML =
        "<h3 class=\"sheet-title\">Cortina d'Ampezzo</h3>" +
        "<p class=\"sheet-meta\">Cortina d'Ampezzo doesn't have third-wave specialty coffee shops.</p>" +
        "<p class=\"sheet-meta\">Try traditional espresso bars at hotel lounges or local bars. Search \"espresso bar\", \"pasticceria\", or \"hotel bar\" on Google Maps.</p>" +
        "<p class=\"sheet-meta\">Traditional picks (no verified names in the research data):</p>" +
        cortinaSuggestionsHtml();
      return;
    }

    if (!cafe) {
      const count =
        cityName === "All"
          ? cafes.length
          : cityCounts[cityName] || 0;
      container.innerHTML =
        "<h3 class=\"sheet-title\">" +
        (cityName === "All" ? "All Cities" : cityName) +
        "</h3>" +
        "<p class=\"sheet-meta\">" +
        count +
        " cafes. Tap a marker to see details.</p>";
      return;
    }

    container.innerHTML =
      "<h3 class=\"sheet-title\">" +
      cafe.name +
      "</h3>" +
      "<p class=\"sheet-meta\">" +
      cafe.neighborhood +
      " · " +
      cafe.city +
      "</p>" +
      "<p class=\"sheet-meta\">" +
      hoursSummary(cafe.hours) +
      "</p>" +
      "<div class=\"sheet-actions\">" +
      "<button class=\"secondary-button\" type=\"button\" data-action=\"open-detail\" data-id=\"" +
      cafe.id +
      "\">View details</button>" +
      "<a class=\"primary-button\" href=\"" +
      mapDirectionsUrl(cafe) +
      "\" target=\"_blank\">Get Directions</a>" +
      "</div>";
  }

  function renderList(cityName) {
    const container = document.getElementById("list-container");
    if (!container) return;

    if (cityName === "Cortina d'Ampezzo") {
      container.innerHTML =
        "<div class=\"cortina-card\">" +
        "<h3>No Third-Wave Coffee</h3>" +
        "<p>Cortina d'Ampezzo doesn't have third-wave specialty coffee shops.</p>" +
        "<p>Try traditional espresso bars at hotel lounges or local bars. Search \"espresso bar\", \"pasticceria\", or \"hotel bar\" on Google Maps.</p>" +
        "<p>Traditional picks (no verified names in the research data):</p>" +
        cortinaSuggestionsHtml() +
        "</div>";
      return;
    }

    const filtered =
      cityName === "All"
        ? cafes
        : cafes.filter((cafe) => cafe.city === cityName);

    if (!filtered.length) {
      container.innerHTML =
        "<div class=\"cortina-card\"><h3>No cafes found</h3></div>";
      return;
    }

    const groups = {};
    filtered.forEach((cafe) => {
      const neighborhood = cafe.neighborhood || "Neighborhood";
      if (!groups[neighborhood]) groups[neighborhood] = [];
      groups[neighborhood].push(cafe);
    });

    const groupHtml = Object.keys(groups)
      .sort()
      .map((neighborhood) => {
        const cards = groups[neighborhood]
          .map((cafe) => {
            const instagram = instagramUrl(cafe.instagram);
            return (
              "<article class=\"cafe-card\" data-id=\"" +
              cafe.id +
              "\">" +
              "<div class=\"card-header\">" +
              "<h3>" +
              cafe.name +
              "</h3>" +
              "<span class=\"cafe-badge\">" +
              neighborhood +
              "</span>" +
              "</div>" +
              "<p class=\"cafe-meta\">" +
              hoursSummary(cafe.hours) +
              "</p>" +
              "<p class=\"cafe-meta\">" +
              specialtySummary(cafe.specialty) +
              "</p>" +
              "<div class=\"cafe-actions\">" +
              "<button class=\"secondary-button toggle-details\" type=\"button\" data-action=\"toggle-details\">Details</button>" +
              "<a class=\"primary-button\" href=\"" +
              mapDirectionsUrl(cafe) +
              "\" target=\"_blank\">Directions</a>" +
              "</div>" +
              "<div class=\"cafe-details\">" +
              "<p><strong>Address:</strong> " +
              cafe.address +
              "</p>" +
              "<div class=\"detail-hours\">" +
              formatHours(cafe.hours) +
              "</div>" +
              "<p><strong>Specialty:</strong> " +
              specialtySummary(cafe.specialty) +
              "</p>" +
              (cafe.januaryNotes
                ? "<p><strong>January notes:</strong> " +
                  cafe.januaryNotes +
                  "</p>"
                : "") +
              (instagram
                ? "<a class=\"secondary-button\" href=\"" +
                  instagram +
                  "\" target=\"_blank\">Instagram</a>"
                : "") +
              "<button class=\"secondary-button\" type=\"button\" data-action=\"open-detail\" data-id=\"" +
              cafe.id +
              "\">Full details</button>" +
              "</div>" +
              "</article>"
            );
          })
          .join("");

        return (
          "<section class=\"neighborhood-group\">" +
          "<h4 class=\"neighborhood-title\">" +
          neighborhood +
          "</h4>" +
          cards +
          "</section>"
        );
      })
      .join("");

    container.innerHTML = groupHtml;
  }

  function formatHours(hours) {
    if (!hours) return "<p>Hours: Check listing</p>";
    const lines = [];
    if (hours.Daily) {
      lines.push("<p><strong>Daily:</strong> " + hours.Daily + "</p>");
    } else {
      const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      order.forEach((day) => {
        if (hours[day]) {
          lines.push(
            "<p><strong>" + day + ":</strong> " + hours[day] + "</p>"
          );
        }
      });
      const otherKeys = Object.keys(hours).filter((key) => order.indexOf(key) < 0);
      otherKeys.forEach((key) => {
        lines.push(
          "<p><strong>" + key + ":</strong> " + hours[key] + "</p>"
        );
      });
    }
    return lines.join("");
  }

  function renderDetail(id) {
    const container = document.getElementById("detail-content");
    if (!container) return;
    const cafe = cafeById[id];
    if (!cafe) {
      container.innerHTML =
        "<div class=\"detail-content\"><h3>Cafe not found</h3></div>";
      return;
    }
    const instagram = instagramUrl(cafe.instagram);
    container.innerHTML =
      "<h2>" +
      cafe.name +
      "</h2>" +
      "<p class=\"cafe-meta\">" +
      cafe.city +
      " · " +
      cafe.neighborhood +
      "</p>" +
      "<div class=\"detail-list\">" +
      "<p><strong>Address:</strong> " +
      cafe.address +
      "</p>" +
      "<p><strong>Specialty:</strong> " +
      specialtySummary(cafe.specialty) +
      "</p>" +
      (cafe.januaryNotes
        ? "<p><strong>January notes:</strong> " +
          cafe.januaryNotes +
          "</p>"
        : "") +
      "</div>" +
      "<div class=\"detail-hours\">" +
      formatHours(cafe.hours) +
      "</div>" +
      "<div class=\"cafe-actions\">" +
      "<a class=\"primary-button\" href=\"" +
      mapDirectionsUrl(cafe) +
      "\" target=\"_blank\">Open in Google Maps</a>" +
      (instagram
        ? "<a class=\"secondary-button\" href=\"" +
          instagram +
          "\" target=\"_blank\">Instagram</a>"
        : "") +
      "</div>";
  }

  function setView(viewName) {
    state.view = viewName;
    const views = document.querySelectorAll(".view");
    views.forEach((view) => {
      view.classList.toggle("is-active", view.dataset.view === viewName);
    });
    document.querySelectorAll(".nav-button").forEach((nav) => {
      nav.classList.toggle("is-active", nav.dataset.nav === viewName);
    });
    if (viewName === "map" && window.MapView) {
      window.MapView.resize();
    }
  }

  function updateMap(cityName) {
    if (!window.MapView) return;
    const filtered =
      cityName === "All"
        ? cafes
        : cafes.filter((cafe) => cafe.city === cityName);
    window.MapView.updateData(filtered);
    window.MapView.fitToCity(cityName);
    renderMapSheet(
      state.selectedCafeId ? cafeById[state.selectedCafeId] : null,
      cityName
    );
  }

  function updateList(cityName) {
    renderChips("list-city-chips", cityName, "list");
    renderList(cityName);
  }

  function handleRoute() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (!hash) {
      setView("home");
      return;
    }
    const parts = hash.split("?");
    const path = parts[0];
    const params = new URLSearchParams(parts[1] || "");
    const segments = path.split("/");
    const view = segments[0];

    if (view === "detail" && segments[1]) {
      state.lastView = state.view !== "detail" ? state.view : state.lastView;
      setView("detail");
      renderDetail(decodeURIComponent(segments[1]));
      return;
    }

    const cityParam = params.get("city") || "All";
    if (state.city !== cityParam) {
      state.selectedCafeId = null;
    }
    state.city = cityParam;

    if (view === "map" || view === "list" || view === "home") {
      setView(view);
      if (view !== "detail") state.lastView = view;
      if (view === "map") {
        renderChips("map-city-chips", cityParam, "map");
        updateMap(cityParam);
      }
      if (view === "list") {
        updateList(cityParam);
      }
    }
  }

  function initMap() {
    if (!window.MapView) return;
    window.MapView.ensureInit(cafes, cityCenters);
  }

  function attachEvents() {
    const cityCards = document.getElementById("city-cards");
    if (cityCards) {
      cityCards.addEventListener("click", (event) => {
        const button = event.target.closest(".city-card");
        if (!button) return;
        const city = button.dataset.city;
        window.location.hash = "#/map?city=" + encodeURIComponent(city);
      });
    }

    const listContainer = document.getElementById("list-container");
    if (listContainer) {
      listContainer.addEventListener("click", (event) => {
        const action = event.target.getAttribute("data-action");
        const card = event.target.closest(".cafe-card");
        if (!card) return;
        if (action === "open-detail") {
          const id = event.target.getAttribute("data-id") || card.dataset.id;
          if (id) {
            state.selectedCafeId = id;
            window.location.hash = "#/detail/" + encodeURIComponent(id);
          }
          return;
        }
        if (action === "toggle-details") {
          card.classList.toggle("is-open");
          return;
        }
        if (event.target.closest("a") || event.target.closest("button")) {
          return;
        }
        card.classList.toggle("is-open");
      });
    }

    const mapSheet = document.getElementById("map-sheet");
    if (mapSheet) {
      mapSheet.addEventListener("click", (event) => {
        const action = event.target.getAttribute("data-action");
        if (action === "open-detail") {
          const id = event.target.getAttribute("data-id");
          if (id) {
            state.selectedCafeId = id;
            window.location.hash = "#/detail/" + encodeURIComponent(id);
          }
        }
      });
    }

    const chips = document.querySelectorAll(".chip-row");
    chips.forEach((row) => {
      row.addEventListener("click", (event) => {
        const chip = event.target.closest(".chip");
        if (!chip) return;
        const view = chip.dataset.view;
        const city = chip.dataset.city;
        if (view) {
          window.location.hash =
            "#/" + view + "?city=" + encodeURIComponent(city);
        }
      });
    });

    const mapListToggle = document.getElementById("map-list-toggle");
    if (mapListToggle) {
      mapListToggle.addEventListener("click", () => {
        window.location.hash =
          "#/list?city=" + encodeURIComponent(state.city);
      });
    }

    const detailBack = document.getElementById("detail-back");
    if (detailBack) {
      detailBack.addEventListener("click", () => {
        const fallback = state.lastView || "list";
        if (fallback === "detail") {
          window.location.hash = "#/list?city=" + encodeURIComponent(state.city);
        } else if (fallback === "map" || fallback === "home") {
          window.location.hash = "#/" + fallback + "?city=" + encodeURIComponent(state.city);
        } else {
          window.location.hash = "#/list?city=" + encodeURIComponent(state.city);
        }
      });
    }

    window.addEventListener("cafe-selected", (event) => {
      state.selectedCafeId = event.detail.id;
      renderMapSheet(cafeById[event.detail.id], state.city);
    });

    window.addEventListener("hashchange", handleRoute);
  }

  function init() {
    renderCityCards();
    renderTripStrip();
    renderChips("map-city-chips", state.city, "map");
    renderChips("list-city-chips", state.city, "list");
    initMap();
    attachEvents();
    handleRoute();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
