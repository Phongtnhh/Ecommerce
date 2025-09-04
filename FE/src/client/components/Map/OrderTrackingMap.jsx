import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './OrderTrackingMap.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different markers
const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">${symbol}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const OrderTrackingMap = ({ 
  orderLocation, 
  deliveryLocation, 
  currentDriverLocation = null,
  orderStatus = 'pending'
}) => {
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [distance, setDistance] = useState(null);

  // Icons for different markers
  const storeIcon = createCustomIcon('#e74c3c', '🏪');
  const customerIcon = createCustomIcon('#27ae60', '🏠');
  const driverIcon = createCustomIcon('#3498db', '🚚');

  // Calculate route between two points
  const calculateRoute = async (start, end) => {
    if (!start || !end) return;
    
    setLoading(true);
    try {
      // Using OpenRouteService API (free tier)
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248d5c7c8a7b8e84b8e8b8e8b8e8b8e8b8e&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const coordinates = data.features[0].geometry.coordinates;
        const routeCoords = coordinates.map(coord => [coord[1], coord[0]]);
        setRoute(routeCoords);
        
        // Extract distance and duration
        const summary = data.features[0].properties.summary;
        setDistance((summary.distance / 1000).toFixed(1)); // Convert to km
        setEstimatedTime(Math.round(summary.duration / 60)); // Convert to minutes
      } else {
        // Fallback: direct line
        setRoute([[start[1], start[0]], [end[1], end[0]]]);
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      // Fallback: direct line
      setRoute([[start[1], start[0]], [end[1], end[0]]]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderLocation && deliveryLocation && orderStatus === 'shipping') {
      calculateRoute(orderLocation, deliveryLocation);
    }
  }, [orderLocation, deliveryLocation, orderStatus]);

  // Calculate map center and bounds
  const getMapCenter = () => {
    if (orderLocation && deliveryLocation) {
      const lat = (orderLocation[1] + deliveryLocation[1]) / 2;
      const lng = (orderLocation[0] + deliveryLocation[0]) / 2;
      return [lat, lng];
    }
    return [21.028511, 105.854444]; // Default to Hanoi
  };

  const getMapBounds = () => {
    if (orderLocation && deliveryLocation) {
      const bounds = L.latLngBounds([
        [orderLocation[1], orderLocation[0]],
        [deliveryLocation[1], deliveryLocation[0]]
      ]);
      
      if (currentDriverLocation) {
        bounds.extend([currentDriverLocation[1], currentDriverLocation[0]]);
      }
      
      return bounds;
    }
    return null;
  };

  const mapCenter = getMapCenter();
  const mapBounds = getMapBounds();

  return (
    <div className="order-tracking-map">
      <div className="tracking-info">
        <div className="tracking-stats">
          {distance && (
            <div className="stat-item">
              <span className="stat-label">Khoảng cách:</span>
              <span className="stat-value">{distance} km</span>
            </div>
          )}
          {estimatedTime && (
            <div className="stat-item">
              <span className="stat-label">Thời gian dự kiến:</span>
              <span className="stat-value">{estimatedTime} phút</span>
            </div>
          )}
          <div className="stat-item">
            <span className="stat-label">Trạng thái:</span>
            <span className={`stat-value status-${orderStatus}`}>
              {orderStatus === 'shipping' ? 'Đang giao hàng' : 
               orderStatus === 'delivered' ? 'Đã giao hàng' : 
               orderStatus === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
            </span>
          </div>
        </div>
        
        {loading && (
          <div className="loading-indicator">
            <span>Đang tính toán tuyến đường...</span>
          </div>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
          bounds={mapBounds}
          boundsOptions={{ padding: [20, 20] }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Store/Order location marker */}
          {orderLocation && (
            <Marker 
              position={[orderLocation[1], orderLocation[0]]} 
              icon={storeIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h4>📍 Điểm xuất phát</h4>
                  <p>Cửa hàng/Kho hàng</p>
                  <small>Tọa độ: {orderLocation[1].toFixed(6)}, {orderLocation[0].toFixed(6)}</small>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Customer/Delivery location marker */}
          {deliveryLocation && (
            <Marker 
              position={[deliveryLocation[1], deliveryLocation[0]]} 
              icon={customerIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h4>🏠 Điểm giao hàng</h4>
                  <p>Địa chỉ khách hàng</p>
                  <small>Tọa độ: {deliveryLocation[1].toFixed(6)}, {deliveryLocation[0].toFixed(6)}</small>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Current driver location (if available) */}
          {currentDriverLocation && orderStatus === 'shipping' && (
            <Marker 
              position={[currentDriverLocation[1], currentDriverLocation[0]]} 
              icon={driverIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h4>🚚 Vị trí tài xế</h4>
                  <p>Đang trên đường giao hàng</p>
                  <small>Tọa độ: {currentDriverLocation[1].toFixed(6)}, {currentDriverLocation[0].toFixed(6)}</small>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Route polyline */}
          {route.length > 0 && orderStatus === 'shipping' && (
            <Polyline 
              positions={route} 
              color="#3498db" 
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-icon" style={{backgroundColor: '#e74c3c'}}>🏪</div>
          <span>Điểm xuất phát</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon" style={{backgroundColor: '#27ae60'}}>🏠</div>
          <span>Điểm giao hàng</span>
        </div>
        {orderStatus === 'shipping' && (
          <div className="legend-item">
            <div className="legend-icon" style={{backgroundColor: '#3498db'}}>🚚</div>
            <span>Vị trí tài xế</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingMap;
