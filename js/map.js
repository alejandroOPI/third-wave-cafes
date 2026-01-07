(function () {
  const ACCESS_TOKEN =
    "pk.eyJ1IjoiYWxlamFuZHJvb3BpIiwiYSI6ImNtNWw0dnBoZzJhbHkya3B6ZWVsMnRqdXEifQ.Uh_ceEJWjudge6xy9GnXTA";

  const DEFAULT_VIEW = {
    center: [7.5, 46.5],
    zoom: 4.3,
  };

  const CITY_COLORS = {
    Paris: "#8B4513",
    "Cortina d'Ampezzo": "#B6845F",
    Venice: "#C98A4B",
    Milan: "#A85E2B",
    Zurich: "#B0723B",
    Geneva: "#B87A3E",
    Lausanne: "#B06B36",
    Bern: "#9F5C32",
    Basel: "#B47A45",
    Lucerne: "#A96A3C",
  };

  let map;
  let geojson = { type: "FeatureCollection", features: [] };
  let cityCenters = {};
  let mapReady = false;

  function getColor(city) {
    return CITY_COLORS[city] || "#8B4513";
  }

  function buildGeojson(cafes) {
    return {
      type: "FeatureCollection",
      features: cafes.map((cafe) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: cafe.coordinates,
        },
        properties: {
          id: cafe.id,
          name: cafe.name,
          address: cafe.address,
          city: cafe.city,
          color: getColor(cafe.city),
        },
      })),
    };
  }

  function addSourcesAndLayers() {
    map.addSource("cafes", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 13,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "cafes",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#D4A574",
        "circle-radius": [
          "step",
          ["get", "point_count"],
          18,
          10,
          22,
          25,
          28,
        ],
        "circle-opacity": 0.85,
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "cafes",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#2D2D2D",
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "cafes",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": ["get", "color"],
        "circle-radius": 9,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff8ea",
      },
    });

    map.on("click", "clusters", (event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map.getSource("cafes").getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
        });
      });
    });

    map.on("click", "unclustered-point", (event) => {
      const feature = event.features[0];
      const coordinates = feature.geometry.coordinates.slice();
      const name = feature.properties.name;
      const address = feature.properties.address;
      const id = feature.properties.id;

      new mapboxgl.Popup({ offset: 18 })
        .setLngLat(coordinates)
        .setHTML(
          "<strong>" +
            name +
            "</strong><br><small>" +
            address +
            "</small><br><a href='https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(name + " " + address) +
            "' target='_blank'>Get Directions</a>"
        )
        .addTo(map);

      window.dispatchEvent(
        new CustomEvent("cafe-selected", { detail: { id: id } })
      );
    });

    map.on("mouseenter", "unclustered-point", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
    });
  }

  function ensureInit(cafes, centers) {
    if (map) return;
    mapboxgl.accessToken = ACCESS_TOKEN;
    cityCenters = centers || {};
    geojson = buildGeojson(cafes);

    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center: DEFAULT_VIEW.center,
      zoom: DEFAULT_VIEW.zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    map.on("load", () => {
      mapReady = true;
      addSourcesAndLayers();
    });
  }

  function updateData(cafes) {
    geojson = buildGeojson(cafes);
    if (mapReady) {
      const source = map.getSource("cafes");
      if (source) {
        source.setData(geojson);
      }
    }
  }

  function fitToCity(city) {
    if (!mapReady) return;
    if (!city || city === "All") {
      map.easeTo({ center: DEFAULT_VIEW.center, zoom: DEFAULT_VIEW.zoom });
      return;
    }
    const center = cityCenters[city];
    if (center) {
      map.easeTo({ center: center, zoom: 12 });
    }
  }

  function resize() {
    if (map) map.resize();
  }

  window.MapView = {
    ensureInit,
    updateData,
    fitToCity,
    resize,
  };
})();
