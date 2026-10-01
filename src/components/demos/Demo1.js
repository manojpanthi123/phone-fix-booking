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
    const map = L.map(mapNode.current).setView([SHOP.lat, SHOP.lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    const pin = L.divIcon({
      className: "shop-pin",
      html: "<span>Phone Fix</span>",
      iconSize: [88, 28],
      iconAnchor: [44, 28]
    });

    L.marker([SHOP.lat, SHOP.lng], { icon: pin })
      .addTo(map)
      .bindPopup("<strong>" + SHOP.name + "</strong><br>" + SHOP.address)
      .openPopup();

    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => {
      clearTimeout(timer);
      map.remove();
    };
  }, []);

  return (
    <section>
      <h3>Demo 1: Interactive map</h3>
      <p>
        Zoom and drag the map. The pin marks the repair shop at {SHOP.address}.
      </p>
      <div ref={mapNode} className="shop-map" role="region" aria-label="Shop map" />
    </section>
  );
}

export default Demo1;
