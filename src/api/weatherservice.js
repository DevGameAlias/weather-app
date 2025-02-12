const API_KEY = process.env.REACT_APP_WEATHER_API;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Fetch current weather data
export const fetchWeather = async (city, unit = "metric") => {
  try {
    const response = await fetch(
      `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=${unit}`
    );

    if (!response.ok) {
      throw new Error("Weather data not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

// Fetch 5-day forecast data
export const fetchFiveDayForecast = async (city, unit = "metric") => {
  try {
    const response = await fetch(
      `${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=${unit}`
    );

    if (!response.ok) {
      throw new Error("Forecast data not found");
    }

    const data = await response.json();

    // Process data to group forecasts by day with high/low temps
    const dailyForecast = {};

    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0]; // Extract the date (YYYY-MM-DD)

      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          tempMin: entry.main.temp_min,
          tempMax: entry.main.temp_max,
          feelsLike: entry.main.feels_like,
          humidity: entry.main.humidity,
          windSpeed: entry.wind.speed,
          description: entry.weather[0].description,
          icon: entry.weather[0].icon,
          sunrise: data.city.sunrise,
          sunset: data.city.sunset,
        };
      } else {
        // Update min/max temperatures
        dailyForecast[date].tempMin = Math.min(dailyForecast[date].tempMin, entry.main.temp_min);
        dailyForecast[date].tempMax = Math.max(dailyForecast[date].tempMax, entry.main.temp_max);
      }
    });

    return Object.entries(dailyForecast).slice(0, 5); // Get 5-day forecast
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return null;
  }
};


