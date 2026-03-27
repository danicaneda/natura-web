'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const POSITION: [number, number] = [43.00417, -4.13972];

const customIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;
    background:#B8860B;
    border:3px solid #FAF6EE;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 4px 16px rgba(184,134,11,0.5);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

export default function MapaReinosa() {
  useEffect(() => {
    // Fix Leaflet default icon paths en Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={POSITION}
      zoom={16}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%', minHeight: '320px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={POSITION} icon={customIcon}>
        <Popup>
          <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <strong style={{ color: '#B8860B', display: 'block', marginBottom: '2px' }}>🌿 Natura</strong>
            C. Peligros, 2<br />
            39200 Reinosa, Cantabria
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
