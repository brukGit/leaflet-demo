import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CountryMap = () => {
  const [hoverInfo, setHoverInfo] = useState(null);

  // Real GeoJSON coordinates for 5 countries (simplified for demo)
  const mockGeoData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { ISO_A3: "USA", NAME: "United States" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-125.0, 49.0], [-66.0, 49.0], [-66.0, 24.0], 
          [-125.0, 24.0], [-125.0, 49.0]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ISO_A3: "IND", NAME: "India" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.0, 35.0], [97.0, 35.0], [97.0, 8.0], 
          [68.0, 8.0], [68.0, 35.0]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ISO_A3: "BRA", NAME: "Brazil" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.0, 5.0], [-34.0, 5.0], [-34.0, -33.0], 
          [-73.0, -33.0], [-73.0, 5.0]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ISO_A3: "ZAF", NAME: "South Africa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [16.0, -22.0], [32.0, -22.0], [32.0, -34.0], 
          [16.0, -34.0], [16.0, -22.0]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { ISO_A3: "AUS", NAME: "Australia" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [113.0, -10.0], [153.0, -10.0], [153.0, -39.0], 
          [113.0, -39.0], [113.0, -10.0]
        ]]
      }
    }
  ]
};
  const mockCountryData = [
    { code: "USA", value: 1500, population: "331M", region: "North America" },
    { code: "IND", value: 800, population: "1.4B", region: "Asia" },
    { code: "BRA", value: 400, population: "213M", region: "South America" },
    { code: "ZAF", value: 300, population: "60M", region: "Africa" },
    { code: "AUS", value: 200, population: "26M", region: "Oceania" }
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
      fillOpacity: hoverInfo?.code === feature.properties.ISO_A3 ? 0.9 : 0.6,
      color: 'white',
      transition: 'all 0.3s'
    };
  };

  const onEachFeature = (feature, layer) => {
    const country = mockCountryData.find(c => c.code === feature.properties.ISO_A3);
    
    layer.on({
       mouseover: () => {
    setHoverInfo({
      code: feature.properties.ISO_A3,
      name: feature.properties.NAME,
      value: country?.value
    });
    layer.setStyle({ weight: 3 });
  },
      mouseout: () => {
        setHoverInfo(null);
        layer.setStyle({ weight: 1 });
      }
    });

    if (country) {
      layer.bindPopup(`
        <div class="popup-content">
          <h4>${feature.properties.NAME}</h4>
          <p>Value: ${country.value}</p>
          <p>Population: ${country.population}</p>
          <p>Region: ${country.region}</p>
        </div>
      `);
    }
  };

  const geoJsonComponent = useMemo(() => (
    <GeoJSON
      data={mockGeoData}
      style={countryStyle}
      onEachFeature={onEachFeature}
    />
  ), []);

  return (
    <div style={{ 
      height: '80vh', 
      width: '90%', 
      margin: '20px auto',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <MapContainer
        center={[20, 20]}
        zoom={2}
        minZoom={2}
        maxBounds={[[-60, -180], [85, 190]]}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonComponent}

   {hoverInfo && (
  <div className="hover-tooltip"
    style={{
      position: 'fixed',
      zIndex: 1000,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '12px 20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      pointerEvents: 'none',
      textAlign: 'center',
      minWidth: '200px',
      fontSize: '1.1em'
    }}
  >
    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
      {hoverInfo.name}
    </div>
    <div>Value: {hoverInfo.value}</div>
  </div>
)}

        <div className="legend"
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '20px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '15px',
            borderRadius: '5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <h4 style={{ margin: '0 0 10px' }}>Value Scale</h4>
          {[['#800026', '> 1000'], ['#BD0026', '501-1000'], ['#E31A1C', '201-500'], 
           ['#FC4E2A', '101-200'], ['#FFEDA0', '≤ 100']].map(([color, label]) => (
            <div key={color} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: color, 
                marginRight: '8px' 
              }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </MapContainer>
    </div>
  );
};

export default CountryMap;