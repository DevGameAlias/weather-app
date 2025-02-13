const API_KEY = process.env.REACT_APP_WEATHER_API;

export const fetchCitySuggestions = async (query) => {
  if (!query) return [];

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
};
