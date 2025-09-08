"use client";

import { MapContainer, Marker, Popup, TileLayer, WMSTileLayer,GeoJSON  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";


export default function MapComponent() {
  //   const markers = [
  //     { geocode: [43.9479331, -69.311827], popUp: "Gagan" },
  //     { geocode: [43.9469331, -69.312827], popUp: "Shaunak" },
  //     { geocode: [43.9469331, -69.310827], popUp: "Prateek" },
  //     { geocode: [43.9469331, -69.311827], popUp: "Rakesh" },
  //     { geocode: [43.9469331, -69.313827], popUp: "Katty" },
  //   ];

  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("data/data.geojson")
      .then((response) => response.json())
      .then((data) => setGeoData(data));
  }, []);


  const customIcon = new Icon({
    iconUrl:
      "https://pngdownload.io/wp-content/uploads/2024/01/Map-Pin-Icon-symbol-for-location-transparent-PNG-image-jpg.webp",
    iconSize: [38, 38],
  });

  return (
    <MapContainer
      //   center={[43.9469331, -69.311827]}
      center={[16.496925, 80.500488]}
      zoom={17}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Base map */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/">ESRI</a>'
      />
      <WMSTileLayer
        url="http://localhost:8080/geoserver/wms"
        layers="bhuvan:BAND3"
        format="image/png"
        transparent={true}
        version="1.0.0"
      />
      {/* {geoData && (
          <GeoJSON
            data={geoData}
            style={{ color: "orange", weight: 1 }}
            onEachFeature={(feature : any, layer:any) => {
              if (feature.properties?.name) {
                layer.bindPopup(feature.properties.name);
              }
            }}
          />
        )} */}

      {/* Markers */}
      {/* {markers.map((marker, index) => (
        <Marker key={index} position={marker.geocode} icon={customIcon}>
          <Popup>{marker.popUp}</Popup>
        </Marker>
      ))} */}
    </MapContainer>
  );
}
