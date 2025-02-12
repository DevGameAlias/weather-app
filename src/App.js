import { useState } from "react";
import { fetchWeather, fetchFiveDayForecast } from "./api/weatherservice";
import Particles from "react-particles";
import WeatherAnimation from "./components/WeatherAnimation";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState("metric"); // 'metric' (Celsius) or 'imperial' (Fahrenheit)

  const handleSearch = async () => {
    if (!city) return;
    const weather = await fetchWeather(city, unit);
    const forecast = await fetchFiveDayForecast(city, unit);
    setWeatherData(weather);
    setForecastData(forecast);
  };

  const getWindParticles = (weather) => {
    if (!weather || !weather.toLowerCase().includes("wind")) return null;
    return {
      fpsLimit: 60,
      particles: {
        number: { value: 50 },
        move: { direction: "left", speed: 2 },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3 },
        color: { value: "#ffffff" },
      },
    };
  };

  const getBackgroundClass = (weather) => {
    if (!weather) return "bg-gradient-to-br from-gray-400 to-gray-700"; // Default

    const condition = weather.toLowerCase();

    if (condition.includes("clear")) return "bg-gradient-to-br from-yellow-400 to-orange-600";
    if (condition.includes("cloud")) return "bg-gradient-to-br from-gray-300 to-gray-600";
    if (condition.includes("rain") || condition.includes("drizzle")) return "bg-gradient-to-br from-blue-600 to-blue-900";
    if (condition.includes("snow")) return "bg-gradient-to-br from-blue-200 to-white";
    if (condition.includes("thunderstorm")) return "bg-gradient-to-br from-gray-800 to-gray-900";
    if (condition.includes("wind")) return "bg-gradient-to-br from-gray-500 to-gray-800";

    return "bg-gradient-to-br from-gray-400 to-gray-700"; // Default fallback
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
    if (city) {
      fetchWeather(city, unit === "metric" ? "imperial" : "metric").then(setWeatherData);
      fetchFiveDayForecast(city, unit === "metric" ? "imperial" : "metric").then(setForecastData);
    }
  };

  // Convert Unix timestamps to readable times
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen text-white transition-all duration-500 ${getBackgroundClass(weatherData?.weather[0].main)}`}>
      
      {/* Weather Animations (Only Show When Weather Data Exists) */}
      {weatherData && <WeatherAnimation weather={weatherData?.weather[0].main} />}

      {/* Wind Particles Effect (Only When Windy) */}
      {weatherData?.weather[0].main.toLowerCase().includes("wind") && (
        <Particles className="absolute top-0 left-0 w-full h-full" options={getWindParticles(weatherData.weather[0].main)} />
      )}

      {/* Search Input */}
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 text-black rounded-md"
      />
      <button onClick={handleSearch} className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-md">
        Get Weather
      </button>

      {/* Temperature Unit Toggle */}
      <button onClick={toggleUnit} className="mt-2 bg-gray-200 text-blue-700 px-3 py-1 rounded-md">
        Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
      </button>

      {/* Current Weather Display */}
      {weatherData && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">{weatherData.name}</h2>
          <p>{weatherData.weather[0].description}</p>
          <p>Temperature: {Math.round(weatherData.main.temp)}°{unit === "metric" ? "C" : "F"}</p>
        </div>
      )}

      {/* 5-Day Forecast */}
      {forecastData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-4 mt-4">
            {forecastData.map(([date, info]) => (
              <div key={date} className="bg-white text-blue-900 p-4 rounded-md">
                <p className="font-bold">{date}</p>
                <img src={`https://openweathermap.org/img/wn/${info.icon}.png`} alt={info.description} />
                <p>{info.description}</p>
                <p>🌡 Hi/Low: {Math.round(info.tempMax)}° / {Math.round(info.tempMin)}° {unit === "metric" ? "C" : "F"}</p>
                <p>🤔 Feels Like: {Math.round(info.feelsLike)}°{unit === "metric" ? "C" : "F"}</p>
                <p>💨 Wind: {Math.round(info.windSpeed)} {unit === "metric" ? "m/s" : "mph"}</p>
                <p>💧 Humidity: {info.humidity}%</p>
                <p>🌅 Sunrise: {formatTime(info.sunrise)}</p>
                <p>🌇 Sunset: {formatTime(info.sunset)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
