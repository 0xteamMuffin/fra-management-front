"use client"

import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  ScaleControl,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState, useRef } from "react"
import L, { Layer, LeafletEvent, FeatureGroup } from "leaflet"
import { Claim } from "./atlas-view" 
import { Map, Satellite, Loader2 } from "lucide-react"

interface MapComponentProps {
  claims: Claim[]
}

export default function MapComponent({ claims }: MapComponentProps) {
  const [geoData, setGeoData] = useState(null)
  const [villageData, setDistrictData] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [isSatelliteView, setIsSatelliteView] = useState(false)
  const [isLoading, setIsLoading] = useState(false) 

  const geoJsonRef = useRef<L.GeoJSON | null>(null)

  useEffect(() => {
    fetch("data/odisha.geojson")
      .then((response) => response.json())
      .then((data) => setGeoData(data))
  }, [])

  const fetchDistrictBoundaries = (districtName: string) => {
    if (districtName === selectedDistrict) return;

    setIsLoading(true)
    setDistrictData(null) 

    fetch("data/data1.geojson")
      .then((response) => response.json())
      .then((data) => {
        console.log("GeoJSON CRS:", data.crs); 
        const filteredFeatures = {
          ...data,
          features: data.features.filter(
            (feature: any) => feature.properties?.DISTRICT === districtName
          ),
        }

        if (filteredFeatures.features.length > 0) {
          setDistrictData(filteredFeatures)
          setSelectedDistrict(districtName)
        } else {
          setSelectedDistrict(null)
        }
      })
      .catch(error => {
        console.error("Failed to fetch district boundaries:", error);
        setSelectedDistrict(null);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const defaultStyle = {
    color: "red",
    weight: 2,
    dashArray: "5 5",
    fillColor: "gray",
    fillOpacity: 0.6,
  }

  const activeStyle = {
    ...defaultStyle,
    fillColor: "white",
    fillOpacity: 1,
  }

  const satelliteBoundaryStyle = {
    color: "red",
    weight: 2,
    dashArray: "5 5",
    fillOpacity: 0,
  }

  const districtStyle = {
    color: "blue",
    weight: 2,
    fillColor: "lightblue",
    fillOpacity: 0,
  }
  
  const styleGeoJson = (feature: any) => {
    if (isSatelliteView) {
      return satelliteBoundaryStyle
    }
    if (feature.properties.district === selectedDistrict) {
      return activeStyle
    }
    return defaultStyle
  }


  const handleFeatureClick = (e: LeafletEvent) => {
    if (isLoading) {
      return
    }

    const layer = e.target
    const districtName = layer.feature?.properties?.district

    if (districtName) {
      fetchDistrictBoundaries(districtName)
    }

    const map = layer._map
    map.fitBounds((layer as FeatureGroup).getBounds())
  }

  return (
    <div className="relative h-full w-full">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-xl">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700" />
            <span className="font-semibold text-gray-700">Fetching Data...</span>
          </div>
        </div>
      )}

      {/* View Toggle Button */}
      <button
        onClick={() => setIsSatelliteView(!isSatelliteView)}
        className="absolute top-3 right-3 z-[1000] flex items-center gap-2 rounded-lg border border-gray-200/50 bg-white/80 px-4 py-2 font-semibold text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-200 ease-in-out hover:bg-white hover:shadow-xl active:scale-95 active:bg-gray-100"
      >
        {isSatelliteView ? (
          <>
            <Map className="h-5 w-5" />
            <span>Map View</span>
          </>
        ) : (
          <>
            <Satellite className="h-5 w-5" />
            <span>Satellite View</span>
          </>
        )}
      </button>

      {/* Map Container */}
      <MapContainer
        center={[20.2376, 84.2700]}
        zoom={7.3}
        style={{ height: "100%", width: "100%" }}
      >
         <ScaleControl position="bottomleft" imperial={false} />
        {isSatelliteView ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">ESRI</a>'
          />
        ) : (
          <TileLayer url="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAokB9pSgZf0AAAAASUVORK5CYII=" />
        )}
{/* 
        <WMSTileLayer
          url="http://localhost:8080/geoserver/wms"
          layers="bhuvan:BAND3"
          format="image/png"
          transparent={true}
          version="1.0.0"
        /> */}

        {/* Main State GeoJSON Layer */}
        {geoData && (
          <GeoJSON
            ref={geoJsonRef}
            key={selectedDistrict}
            data={geoData}
            style={styleGeoJson}
            onEachFeature={(feature: any, layer: Layer) => {
              layer.on({
                click: handleFeatureClick,
              })
            }}
          />
        )}

        {/* Village Boundary Layer */}
        {villageData && (
          <GeoJSON
            key={selectedDistrict} 
            data={villageData}
            style={districtStyle}
            onEachFeature={(feature: any, layer: Layer) => {
              if (feature.properties?.NAME) {
                layer.bindPopup(`
                    <h3 class="font-bold">${feature.properties.NAME}</h3>
                `)
                layer.on("click", (e: any) => {
                  const map = e.target._map
                  map.fitBounds((layer as FeatureGroup).getBounds())
                })
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}