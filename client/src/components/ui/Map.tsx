import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  markers: {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
  }[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export const Map = ({
  markers,
  center = [10.762622, 106.660172], // Default to HCMC
  zoom = 13,
  className = "h-[400px] w-full rounded-lg z-0",
}: MapProps) => {
  return (
    <MapContainer center={center} zoom={zoom} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>
            <div className="font-semibold">{marker.title}</div>
            {marker.description && (
              <div className="text-sm text-gray-600">{marker.description}</div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
