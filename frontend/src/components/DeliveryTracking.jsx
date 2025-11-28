import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function DeliveryTracking({ data }) {
  if (!data) return <p>No tracking data available.</p>;

  // Extract coordinates
  const deliveryLat = data?.deliveryBoyLocation?.lat;
  const deliveryLng = data?.deliveryBoyLocation?.lon;

  const customerLat = data?.customerLocation?.lat;
  const customerLng = data?.customerLocation?.lon;

  // Validate coordinates
  if (
    !deliveryLat || !deliveryLng ||
    !customerLat || !customerLng
  ) {
    return <p>Invalid coordinates.</p>;
  }

  const center = [deliveryLat, deliveryLng];

  const path = [
    [deliveryLat, deliveryLng],
    [customerLat, customerLng],
  ];

  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer className="w-full h-full" center={center} zoom={16}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[deliveryLat, deliveryLng]} icon={deliveryBoyIcon}>
          <Popup>Delivery Boy</Popup>
        </Marker>

        <Marker position={[customerLat, customerLng]} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>

        <Polyline positions={path} weight={4} color="orange" />
      </MapContainer>
    </div>
  );
}

export default DeliveryTracking;
