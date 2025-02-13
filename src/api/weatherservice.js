const API_KEY = process.env.REACT_APP_WEATHER_API;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

/** 
 * Fetch current weather data for a city.
 * @param {string} city - The city name.
 * @param {string} unit - "metric" or "imperial" (default: "metric").
 * @returns {Promise<object|null>} - Returns weather data or null if an error occurs.
 */
export const fetchWeather = async (city, unit = "metric") => {
  const url = `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=${unit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather data not found for ${city}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null; // Prevents bad state from breaking the app
  }
};

/** 
 * Fetch 5-day forecast data for a city.
 * @param {string} city - The city name.
 * @param {string} unit - "metric" or "imperial" (default: "metric").
 * @returns {Promise<Array|null>} - Returns processed forecast data or null if an error occurs.
 */
export const fetchFiveDayForecast = async (city, unit = "metric") => {
  const url = `${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=${unit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast data not found for ${city}`);
    }

    const data = await response.json();

    // Process data to group forecasts by day with high/low temps
    const dailyForecast = {};

    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0]; // Extract YYYY-MM-DD

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

    // ✅ Ensure the return is inside the function!
    return Object.entries(dailyForecast).slice(0, 5); // Get 5-day forecast

  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return null;
  }
};
