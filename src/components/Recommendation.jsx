import React, { useState, useEffect } from "react";
import { MapPin, Sun, Cloud, Thermometer } from "lucide-react";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is included
import axios from "axios";

const OPENWEATHERMAP_API_KEY = "9ea0cb58316db17f4049fd326d820ab5";
const GEMINI_API_KEY = "AIzaSyA5zZ1HQs6OM5nlMI6GkbkEbnXgPvyYpsY";

const GardenRecommendationApp = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch plant recommendations from Gemini API
  const fetchPlantRecommendations = async (weatherData) => {
    try {
      const response = await axios.post(
        "https://api.gemini.com/plant-recommendations",
        {
          temp: weatherData.main.temp,
          humidity: weatherData.main.humidity,
        },
        {
          headers: {
            Authorization: `Bearer ${GEMINI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data.recommendations;
      } else {
        throw new Error("Failed to fetch plant recommendations");
      }
    } catch (err) {
      console.error("Error fetching plant recommendations:", err);
      setError("");

      // Return static fallback data
      return [
        {
          category: "Indoor Plants",
          plants: ["Snake Plant", "Spider Plant", "Peace Lily"],
        },
        {
          category: "Outdoor Plants",
          plants: ["Rose", "Marigold", "Hibiscus"],
        },
        {
          category: "Herbs",
          plants: ["Basil", "Mint", "Thyme"],
        },
      ];
    }
  };

  const fetchLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          await fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
      );

      if (response.status === 200) {
        const data = response.data;
        setWeatherData(data);

        // Fetch plant recommendations from Gemini API
        const plantRecs = await fetchPlantRecommendations(data);
        setRecommendations(plantRecs);
        setLoading(false);
      } else {
        throw new Error("Weather data fetch failed");
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-green-700 text-center">
          Garden Recommendations 🌱
        </h1>

        <button
          onClick={fetchLocation}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
        >
          <MapPin className="mr-2" /> Get My Location
        </button>

        {loading && (
          <div className="mt-6 text-center text-green-700 animate-pulse">
            Fetching location and weather data...
          </div>
        )}

        {error && <div className="mt-6 text-center text-red-600">{error}</div>}

        {weatherData && (
          <div className="mt-6 bg-green-100 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Thermometer className="mr-2 text-orange-500" />
                <span className="text-green-800 font-medium">
                  Temperature: {weatherData.main.temp}°C
                </span>
              </div>
              <div className="flex items-center">
                <Cloud className="mr-2 text-blue-500" />
                <span className="text-green-800 font-medium">
                  Humidity: {weatherData.main.humidity}%
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Sun className="mr-2 text-yellow-500" />
              <span className="text-green-800 font-medium">
                Location: {weatherData.name}
              </span>
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-6 bg-green-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">
              Plant Recommendations 🌿
            </h2>
            {recommendations.map((rec, index) => (
              <div key={index} className="mb-6">
                <h3 className="font-bold text-lg text-green-600 mb-2">
                  {rec.category}
                </h3>
                <ul className="list-disc pl-5">
                  {rec.plants.map((plant, idx) => (
                    <li key={idx} className="text-green-500 font-medium">
                      {plant}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenRecommendationApp;
