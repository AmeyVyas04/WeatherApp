"use client";

import { useState } from "react";
import { MapPin, Compass } from "lucide-react";

export default function WeatherInputPage() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setWeatherData(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/weatherapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });

      const data = await res.json();
      console.log("Weather API response:", data);

      if (!res.ok) {
        setErrorMsg(data?.error || "Something went wrong");
      } else {
        setWeatherData(data);
      }
    } catch (err) {
      setErrorMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4 text-black">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">🌤️ Weather Finder</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium" htmlFor="lat">
              Latitude
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-blue-500" />
              <input
                id="lat"
                type="text"
                placeholder="Enter latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium" htmlFor="lon">
              Longitude
            </label>
            <div className="relative">
              <Compass className="absolute left-3 top-2.5 text-blue-500" />
              <input
                id="lon"
                type="text"
                placeholder="Enter longitude"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </form>

        {/* Error */}
        {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}

        {/* Weather Data */}
        {weatherData && (
          <div className="mt-6 bg-blue-100 p-4 rounded-xl shadow text-black">
            <h2 className="text-lg font-semibold mb-2">Weather Info</h2>
            <p><strong>Location:</strong> {weatherData.name}</p>
            <p><strong>Temperature:</strong> {(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
            <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
            <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}
