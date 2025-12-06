import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button } from "./Button";
import { Input } from "./Input";
import { Search } from "lucide-react";
import L from "leaflet";

// Fix for default marker icon in Leaflet with React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address?: any;
  }) => void;
  initialPosition?: [number, number];
}

function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  const map = useMapEvents({
    click(e) {
      const newPos = e.latlng;
      setPosition(newPos);
      map.flyTo(newPos, map.getZoom());

      // Reverse geocode to get address details
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          onLocationSelect({
            lat: newPos.lat,
            lng: newPos.lng,
            address: data.address,
          });
        })
        .catch((err) => console.error("Reverse geocoding failed", err));
    },
  });

  // Fix for map rendering in modal
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position}></Marker>;
}

export const LocationPicker = ({
  onLocationSelect,
  initialPosition = [10.762622, 106.660172],
}: LocationPickerProps) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const newPos = new L.LatLng(lat, lon);
        setPosition(newPos);

        // Also trigger selection with the searched location
        onLocationSelect({ lat, lng: lon });
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Search location (e.g. Ben Thanh Market)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          type="button"
          onClick={handleSearch}
          variant="secondary"
          disabled={isSearching}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className="h-[200px] w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
        <MapContainer
          center={initialPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationSelect={onLocationSelect}
          />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-500">
        💡 Tip: Search for a place or click directly on the map to pin the
        location.
      </p>
    </div>
  );
};
