import React, { useState } from "react";
import "./Search.scss";
import maplibregl from "maplibre-gl";

interface LocationData {
  place_id: string;
  display_name: string;
  lat: number;
  lon: number;
}

interface SearchComponentProps {
  onLocationSelected: (lat: number, lon: number) => void;
  markerRef: React.MutableRefObject<maplibregl.Marker[]>;
  selectedLocation: { lat: number; lon: number };
  mapRef: maplibregl.Map | null;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onLocationSelected,
  markerRef,
  selectedLocation,
  mapRef,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8081/api/v1/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refNum: "Test",
          location: query,
          source: "test",
          boundaryCountry: ["In"],
          size: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Transform the API response to match the LocationData structure
      const transformedData = data.locations.map((item: any, index: number) => ({
        place_id: `location_${index}`,  // generate a unique place_id for each location
        display_name: item.location,    // use the location field for display name
        lat: item.latitude,             // latitude as a number
        lon: item.longitude,            // longitude as a number
      }));
      setSuggestions(transformedData);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Error fetching suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    fetchSuggestions(newQuery);
  };

  const handleLocationSelect = (suggestion: LocationData) => {
    onLocationSelected(suggestion.lat, suggestion.lon);
    setQuery(suggestion.display_name);
    setSuggestions([]);

    if (mapRef) {
      mapRef.flyTo({
        center: [suggestion.lon, suggestion.lat],
        zoom: 16,
      });

      if (markerRef.current.length > 0) {
        markerRef.current[0].setLngLat([suggestion.lon, suggestion.lat]);
      } else {
        markerRef.current = [
          new maplibregl.Marker()
            .setLngLat([suggestion.lon, suggestion.lat])
            .addTo(mapRef),
        ];
      }
    }
  };

  return (
    <div className="search-component">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for a location"
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.place_id}
            onClick={() => handleLocationSelect(suggestion)}
          >
            {suggestion.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
