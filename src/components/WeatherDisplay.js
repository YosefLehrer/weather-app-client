import React from "react";

function WeatherDisplay({ region, data, forecast, logs, onRemove }) {
  return (
    <div>
      {data && (
        <div>
          <h2>{`${data.location.name}, ${data.location.region}, ${data.location.country}`}</h2>
          <button onClick={onRemove}>Remove</button>
          <p>Temperature: {data.current.temp_f}°F</p>
          <p>Humidity: {data.current.humidity}%</p>
          <p>Wind: {data.current.wind_mph} mph</p>
          <p>Rain Chance: {data.current.precip_in} in</p>
        </div>
      )}
      {forecast && (
        <div>
          <h3>3-Day Forecast</h3>
          {forecast.map((day) => (
            <div key={day.date}>
              <p>
                <b>{day.date}</b>
              </p>
              <p>Temperature: {day.day.avgtemp_f}°F</p>
              <p>Condition: {day.day.condition.text}</p>
            </div>
          ))}
        </div>
      )}
      <h3>Historical Data</h3>
      {logs && (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>Wind</th>
              <th>Rain Chance</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.data.current.temp_f}°F</td>
                <td>{log.data.current.humidity}%</td>
                <td>{log.data.current.wind_mph} mph</td>
                <td>{log.data.current.precip_in} in</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WeatherDisplay;
