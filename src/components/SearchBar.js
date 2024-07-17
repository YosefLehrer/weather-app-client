import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";

function SearchBar({ onAddRegion }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length === 0) {
        setSuggestions([]);
        return;
      }

      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      if (!apiKey) {
        console.error("API key is undefined");
        return;
      }

      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          console.error("Failed to fetch data from Weather API");
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleSearch = ({ target: { value } }) => {
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = (suggestion) => {
    onAddRegion(suggestion);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div style={{ marginBottom: "100px" }}>
      <p>Search:</p>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggestion"
              onClick={() => handleSelectSuggestion(suggestion.name)}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
