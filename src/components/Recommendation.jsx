'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Sun, Cloud, Thermometer } from 'lucide-react';

const OPENWEATHERMAP_API_KEY = '9ea0cb58316db17f4049fd326d820ab5';

const GardenRecommendationApp = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPlantRecommendations = (weatherData) => {
    const recommendations = [];
    const { temp, humidity } = weatherData.main;

    if (temp < 10) {
      recommendations.push({
        category: 'Cold Climate Plants',
        plants: ['Kale', 'Spinach', 'Brussel Sprouts', 'Garlic', 'Radishes', 'Turnips']
      });
    } else if (temp >= 10 && temp < 20) {
      recommendations.push({
        category: 'Mild Climate Plants',
        plants: ['Lettuce', 'Peas', 'Broccoli', 'Carrots', 'Cauliflower', 'Beets']
      });
    } else if (temp >= 20 && temp < 30) {
      recommendations.push({
        category: 'Warm Climate Plants',
        plants: ['Tomatoes', 'Peppers', 'Cucumbers', 'Basil', 'Zucchini', 'Squash']
      });
    } else {
      recommendations.push({
        category: 'Hot Climate Plants',
        plants: ['Okra', 'Sweet Potatoes', 'Eggplant', 'Rosemary', 'Melons', 'Corn']
      });
    }

    if (humidity > 70) {
      recommendations.push({
        category: 'High Humidity Plants',
        plants: ['Mint', 'Chives', 'Parsley', 'Cilantro', 'Ginger', 'Turmeric']
      });
    } else if (humidity < 30) {
      recommendations.push({
        category: 'Low Humidity Plants',
        plants: ['Aloe Vera', 'Lavender', 'Sage', 'Thyme', 'Oregano', 'Rosemary']
      });
    } else {
      recommendations.push({
        category: 'Moderate Humidity Plants',
        plants: ['Basil', 'Cilantro', 'Dill', 'Fennel', 'Parsley', 'Chives']
      });
    }

    return recommendations;
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
        () => {
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
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
      );

      if (!response.ok) throw new Error('Weather data fetch failed');

      const data = await response.json();
      setWeatherData(data);
      setRecommendations(getPlantRecommendations(data));
      setLoading(false);
    } catch {
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-300 via-green-100 to-green-500 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-10">
        <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">
          🌿 Plant Recommendation
        </h1>

        <button
          onClick={fetchLocation}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 shadow-md transition-all flex items-center justify-center mb-6"
        >
          <MapPin className="mr-2" /> Get My Location
        </button>

        {loading && <div className="text-green-800 text-center">Loading...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}

        {weatherData && (
          <div className="bg-green-100 p-6 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Thermometer className="mr-2 text-orange-500" />
                <span>{weatherData.main.temp}°C</span>
              </div>
              <div className="flex items-center">
                <Cloud className="mr-2 text-blue-500" />
                <span>{weatherData.main.humidity}% Humidity</span>
              </div>
            </div>
            <div className="flex items-center">
              <Sun className="mr-2 text-yellow-500" />
              <span>{weatherData.name}</span>
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="bg-green-50 p-6 rounded-lg mt-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-4 text-center">Recommendations</h2>
            {recommendations.map((rec, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-green-700">{rec.category}</h3>
                <ul className="list-disc pl-5">
                  {rec.plants.map((plant, idx) => (
                    <li key={idx}>{plant}</li>
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