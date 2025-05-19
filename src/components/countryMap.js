import React, { useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icons for CRA
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CountryMap = () => {
  const mockGeoData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { ISO_A3: "USA", NAME: "United States" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-125.0011, 49.5904],
            [-66.9326, 49.5904],
            [-66.9326, 24.9493],
            [-125.0011, 24.9493],
            [-125.0011, 49.5904]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { ISO_A3: "IND", NAME: "India" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [68.1766, 7.9655],
            [97.4024, 7.9655],
            [97.4024, 35.4940],
            [68.1766, 35.4940],
            [68.1766, 7.9655]
          ]]
        }
      }
    ]
  };

  const mockCountryData = [
    { code: "USA", value: 1500 },
    { code: "IND", value: 800 }
  ];

  const getColor = (value) => {
    return value > 1000 ? '#800026' :
           value > 500  ? '#BD0026' :
           value > 200  ? '#E31A1C' :
           value > 100  ? '#FC4E2A' :
                          '#FFEDA0';
  };

  const countryStyle = (feature) => {
    const country = mockCountryData.find(c => c.code === feature.properties.ISO_A3);
    return {
      fillColor: country ? getColor(country.value) : '#ccc',
      weight: 1,
      fillOpacity: 0.7,
      color: 'white'
    };
  };

  const onEachFeature = (feature, layer) => {
    const country = mockCountryData.find(c => c.code === feature.properties.ISO_A3);
    if (country) {
      layer.bindPopup(`${feature.properties.NAME}: ${country.value} units`);
    }
  };

  // Memoize geoJSON to prevent unnecessary re-renders
  const geoJsonComponent = useMemo(() => (
    <GeoJSON
      data={mockGeoData}
      style={countryStyle}
      onEachFeature={onEachFeature}
    />
  ), []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[20, 80]}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonComponent}
      </MapContainer>
    </div>
  );
};

export default CountryMap;