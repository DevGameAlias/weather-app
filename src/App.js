import { useState, useEffect, useRef } from "react";
import { fetchWeather, fetchFiveDayForecast } from "./api/weatherservice";
import { fetchCitySuggestions } from "./api/geoservice";
import Lottie from "lottie-react";

// Import animations
import rainData from "./assets/rain.json";
import snowData from "./assets/snow.json";
import cloudData from "./assets/clouds.json";

export default function App() {
  /** 🌟 State Management */
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [weatherCondition, setWeatherCondition] = useState("");

  // Animations
  const [rainAnimation, setRainAnimation] = useState(null);
  const [snowAnimation, setSnowAnimation] = useState(null);
  const [cloudAnimation, setCloudAnimation] = useState(null);

  /** 🌟 Fetch Weather Data */
  const handleSearch = async () => {
    if (!city) return;
    console.log("Fetching weather for:", city);

    const weather = await fetchWeather(city, unit);
    const forecast = await fetchFiveDayForecast(city, unit);

    if (weather) {
      console.log("Weather Data:", weather);
      setWeatherCondition(weather.weather[0].main.toLowerCase());
    }
    if (forecast) console.log("Forecast Data:", forecast);

    setWeatherData(weather);
    setForecastData(forecast);
    setCitySuggestions([]);
  };

  /** 🌟 Fetch Animations on Mount */
  useEffect(() => {
    console.log("Fetching animations...");
    setRainAnimation(rainData);
    setSnowAnimation(snowData);
    setCloudAnimation(cloudData);
  }, []);

  /** 🌟 Handle City Input Change */
  const debounceTimeout = useRef(null);
  const handleCityInputChange = (e) => {
    const input = e.target.value;
    setCity(input);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (input.length > 2) {
        const suggestions = await fetchCitySuggestions(input);
        const usCities = suggestions.filter((city) => city.country === "US");

        const uniqueCities = usCities.reduce((acc, city) => {
          if (!acc.find((c) => c.name === city.name)) acc.push(city);
          return acc;
        }, []);

        setCitySuggestions(uniqueCities);
      } else {
        setCitySuggestions([]);
      }
    }, 300);
  };

  /** 🌟 Handle Enter Key in Input */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /** 🌟 Handle Click on Suggested City */
  const handleCitySelection = (selectedCity) => {
    setCity(selectedCity);
    setCitySuggestions([]);
    handleSearch();
  };

  /** 🌟 Toggle Temperature Unit */
  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
    if (city) {
      fetchWeather(city, unit === "metric" ? "imperial" : "metric").then(setWeatherData);
      fetchFiveDayForecast(city, unit === "metric" ? "imperial" : "metric").then(setForecastData);
    }
  };

  /** 🌟 Dynamic Background Based on Weather */
  const getBackgroundClass = () => {
    if (weatherCondition.includes("clear")) return "bg-gradient-to-b from-sky-400 to-sky-200";
    if (weatherCondition.includes("rain")) return "bg-gradient-to-b from-gray-700 to-gray-900";
    if (weatherCondition.includes("snow")) return "bg-gradient-to-b from-blue-200 to-gray-300";
    if (weatherCondition.includes("cloud")) return "bg-gradient-to-b from-gray-500 to-gray-400";
    return "bg-gradient-to-b from-gray-400 to-gray-600";
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen text-white space-y-6 px-4 ${getBackgroundClass()}`}>
      {/* 🌧️🌨️ Weather Animations (Always Behind UI) */}
      {weatherCondition.includes("rain") && <Lottie animationData={rainAnimation} className="absolute inset-0 w-full h-full opacity-50 z-0" />}
      {weatherCondition.includes("snow") && <Lottie animationData={snowAnimation} className="absolute inset-0 w-full h-full opacity-60 z-0" />}

      {/* ☁️ Extra Clouds for Cloudy Days */}
      {weatherCondition.includes("cloud") && (
        <>
          <Lottie animationData={cloudAnimation} className="absolute top-5 left-15 w-[350px] opacity-80 animate-float" />
          <Lottie animationData={cloudAnimation} className="absolute top-0 right-3 transform -translate-x-1/2 w-[300px] opacity-90 animate-float-slow" />
          <Lottie animationData={cloudAnimation} className="absolute top-5 left-3 w-[150px] opacity-80 animate-float" />
          <Lottie animationData={cloudAnimation} className="absolute bottom-7 right-10 transform -translate-x-1/2 w-[300px] opacity-90 animate-float-slow" />
          <Lottie animationData={cloudAnimation} className="absolute mid-5 left-10 w-[150px] opacity-80 animate-float" />
          <Lottie animationData={cloudAnimation} className="absolute bottom-0 right-5 transform -translate-x-1/2 w-[180px] opacity-90 animate-float-slow" />
          <Lottie animationData={cloudAnimation} className="absolute mid-3 left-7 w-[150px] opacity-80 animate-float" />
          <Lottie animationData={cloudAnimation} className="absolute mid-7 left-1/4 transform -translate-x-1/2 w-[180px] opacity-90 animate-float-slow" />
        </>
      )}

      {/* 🔍 Search & Buttons (Ensuring they're above animations) */}
      <div className="relative z-20 flex items-center space-x-2">
        <input type="text" placeholder="Enter city name" value={city} onChange={handleCityInputChange} onKeyDown={handleKeyDown} className="p-2 text-black rounded-md" />

        <button onClick={toggleUnit} className="bg-gray-200 text-blue-700 px-3 py-1 rounded-md">
          {unit === "metric" ? "°F" : "°C"}
        </button>

        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Search
        </button>
      </div>

      {/* 📍 City Name & Current Temperature */}
      {weatherData && (
        <div className="mt-6 text-center z-10">
          <h2 className="text-4xl font-semibold">{weatherData.name}</h2>
          <p className="text-lg font-light">{weatherData.weather[0].description}</p>
          <p className="text-6xl font-bold">
            {Math.round(weatherData.main.temp)}°{unit === "metric" ? "C" : "F"}
          </p>
        </div>
      )}

      {/* 📅 5-Day Forecast Cards */}
      {forecastData && (
        <div className="grid grid-cols-5 gap-4 mt-6 z-10">
          {forecastData.map(([date, info]) => (
            <div key={date} className="bg-white/30 text-black p-4 rounded-lg shadow-2xl border-4 border-gray-400 backdrop-blur-md">
              <p className="text-lg font-semibold">{new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "2-digit", day: "2-digit" })}</p>
              <img src={`https://openweathermap.org/img/wn/${info.icon}.png`} alt={info.description} className="w-12 h-12 mx-auto" />
              <p>
                Hi/Low: {Math.round(info.tempMax)}° / {Math.round(info.tempMin)}°
              </p>
              <p>💨 Wind: {Math.round(info.windSpeed)} mph</p>
              <p>💧 Humidity: {info.humidity}%</p>
              <p>🌅 Sunrise: {new Date(info.sunrise * 1000).toLocaleTimeString()}</p>
              <p>🌇 Sunset: {new Date(info.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
