import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import LayerComponent from "../Layers/LayerComponent";
import "../Maps/Maps.css";
import SearchComponent from "../Search/Search";

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef: React.MutableRefObject<maplibregl.Marker[]> = useRef([]);
  const [currentStyle, setCurrentStyle] = useState(
    "https://api.maptiler.com/maps/basic-v2/style.json?key=vazXV1hChkGLzIwyHVwj"
  );
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 17.4478, lon: 78.3541 });

  // Define the locations array
  const locations = useMemo(
    () => [
      { name: "Gachibowli", lat: 17.4478, lon: 78.3541 },
      { name: "Kakinada", lat: 16.9335, lon: 82.2377 },
      { name: "Nizamabad", lat: 18.6741, lon: 78.1025 },
      { name: "Nalgonda", lat: 16.4440, lon: 79.2755 },
      { name: "Kadapa", lat: 14.4770, lon: 78.8212 },
      { name: "Rajahmundry", lat: 16.9888, lon: 81.7784 },
    ],
    []
  );

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: currentStyle,
        center: [selectedLocation.lon, selectedLocation.lat],
        zoom: 12,
      });

      mapRef.current.addControl(
        new maplibregl.NavigationControl(),
        "bottom-right"
      );

      // Add initial marker
      markerRef.current = [
        new maplibregl.Marker({ color: "red" })
          .setLngLat([selectedLocation.lon, selectedLocation.lat])
          .setPopup(
            new maplibregl.Popup().setHTML(`<h3>${locations[0].name}</h3>`)
          )
          .addTo(mapRef.current!),
      ];

      // Add additional markers for other locations
      locations.forEach(({ name, lat, lon }) => {
        const marker = new maplibregl.Marker({ color: "red" })
          .setLngLat([lon, lat])
          .setPopup(new maplibregl.Popup().setHTML(`<h3>${name}</h3>`))
          .addTo(mapRef.current!);
        markerRef.current = [...markerRef.current, marker];
        marker.getElement().addEventListener('click', () => handleMarkerClick(lat, lon));
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
  }, [currentStyle, locations, selectedLocation.lat, selectedLocation.lon]);

  const handleStyleChange = (newStyle: string) => {
    if (mapRef.current) {
      setCurrentStyle(newStyle);
      mapRef.current.setStyle(newStyle);

      markerRef.current.forEach((marker) =>
        marker.setLngLat([selectedLocation.lon, selectedLocation.lat])
      );
    }
  };

  const handleMarkerClick = (lat: number, lon: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lon, lat],
        zoom: 18, // Set the desired zoom level
      });

      markerRef.current.forEach((marker) => {
        if (
          marker.getLngLat().lng === lon &&
          marker.getLngLat().lat === lat
        ) {
          marker.togglePopup();
        } else {
          marker.setPopup(null);
        }
      });

      setSelectedLocation({ lat, lon });
    }
  };

  return (
    <div className="Container" style={{ position: "relative" }}>
      <div ref={mapContainerRef} className="map-container" />
      <div className="layer-container">
        <LayerComponent
          onChange={handleStyleChange}
          currentStyle={currentStyle}
        />
      </div>
      <div className="search-component">
        <SearchComponent
          onLocationSelected={handleMarkerClick}
          markerRef={markerRef}
          selectedLocation={selectedLocation}
          mapRef={mapRef.current}
        />
      </div>
    </div>
  );
};

export default MapComponent;
