import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SHOP = {
  lat: -39.5347,
  lng: 176.8486,
  name: "PHONE FIX SERVICES",
  address: "501 Gloucester Street, Taradale, Napier 4112"
};

function Demo1() {
  const mapNode = useRef(null);

  useEffect(() => {
    const map = L.map(mapNode.current).setView([-41.2, 173.8], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    L.rectangle([[-39.85, 176.45], [-39.15, 177.25]], {
      color: "#c62828",
      weight: 2,
      fillColor: "#c62828",
      fillOpacity: 0.12
    }).addTo(map);

    L.circleMarker([SHOP.lat, SHOP.lng], {
      radius: 7,
      color: "#c62828",
      fillColor: "#c62828",
      fillOpacity: 1
    })
      .addTo(map)
      .bindTooltip(SHOP.address, { permanent: true, direction: "top", className: "shop-label" })
      .openTooltip();

    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => {
      clearTimeout(timer);
      map.remove();
    };
  }, []);

  return (
    <section>
      <h3>DEMO 1: INTERACTIVE MAP</h3>
      <p>Zoom and drag the map of New Zealand. The label marks {SHOP.address}.</p>
      <div ref={mapNode} className="shop-map" role="region" aria-label="Shop map" />
    </section>
  );
}

export default Demo1;
