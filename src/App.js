import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import SearchBar from "./components/SearchBar";
import WeatherDisplay from "./components/WeatherDisplay";

const socket = io(process.env.REACT_APP_API_URL);

function App() {
  const [regions, setRegions] = useState(() => {
    const savedRegions = localStorage.getItem("regions");
    return savedRegions ? JSON.parse(savedRegions) : [];
  });
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [logs, setLogs] = useState({});

  useEffect(() => {
    regions.forEach((region) => fetchWeather(region));

    socket.on("weatherUpdate", ({ region, data }) => {
      setWeatherData((prev) => ({ ...prev, [region]: data }));
    });

    return () => {
      socket.off("weatherUpdate");
    };
  }, [regions]);

  useEffect(() => {
    localStorage.setItem("regions", JSON.stringify(regions));
  }, [regions]);

  const fetchWeather = async (region) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/weather?region=${region}`
    );
    const data = await response.json();
    setWeatherData((prev) => ({ ...prev, [region]: data }));

    const forecastResponse = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${region}&days=3`
    );
    if (!forecastResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const forecastData = await forecastResponse.json();
    setForecastData((prev) => ({
      ...prev,
      [region]: forecastData.forecast.forecastday,
    }));

    const logsResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/weather/logs?region=${region}`
    );
    const logsData = await logsResponse.json();
    setLogs((prev) => ({ ...prev, [region]: logsData }));
  };

  const handleAddRegion = (region) => {
    if (!regions.includes(region)) {
      setRegions([region, ...regions.slice(0, 2)]);
      fetchWeather(region);
    }
  };

  const handleRemoveRegion = (region) => {
    setRegions(regions.filter((r) => r !== region));
  };

  return (
    <div>
      <SearchBar onAddRegion={handleAddRegion} />
      {regions.map((region) => (
        <WeatherDisplay
          key={region}
          region={region}
          data={weatherData[region]}
          forecast={forecastData[region]}
          logs={logs[region]}
          onRemove={() => handleRemoveRegion(region)}
        />
      ))}
    </div>
  );
}

export default App;
