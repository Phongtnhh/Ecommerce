import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapSelector.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect([lng, lat], `${lat}, ${lng}`);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo([position[1], position[0]], 16);
    }
  }, [position, map]);

  return position ? (
    <Marker position={[position[1], position[0]]} />
  ) : null;
}

const MapSelector = ({ onLocationSelect, initialPosition = null }) => {
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Default position (Hanoi, Vietnam)
  const defaultCenter = [21.028511, 105.854444];
  const center = position ? [position[1], position[0]] : defaultCenter;

  const handleLocationSelect = async (coordinates, clickedAddress) => {
    setPosition(coordinates);
    setLoading(true);

    try {
      // Reverse geocoding using Nominatim (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[1]}&lon=${coordinates[0]}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        const formattedAddress = data.display_name;
        setAddress(formattedAddress);
        onLocationSelect(formattedAddress, coordinates);
      } else {
        setAddress(clickedAddress);
        onLocationSelect(clickedAddress, coordinates);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress(clickedAddress);
      onLocationSelect(clickedAddress, coordinates);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          handleLocationSelect(coords, `${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Không thể lấy vị trí hiện tại');
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị');
    }
  };

  return (
    <div className="map-selector">
      <div className="map-controls">
        <button 
          type="button"
          className="current-location-btn"
          onClick={getCurrentLocation}
        >
          📍 Lấy vị trí hiện tại
        </button>
        {loading && <span className="loading-text">Đang tìm địa chỉ...</span>}
      </div>

      <div className="map-container">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            onLocationSelect={handleLocationSelect}
          />
        </MapContainer>
      </div>

      {address && (
        <div className="selected-address">
          <strong>Địa chỉ đã chọn:</strong>
          <p>{address}</p>
        </div>
      )}

      <div className="map-instructions">
        <p>💡 Click vào bản đồ để chọn địa chỉ giao hàng</p>
      </div>
    </div>
  );
};

export default MapSelector;
