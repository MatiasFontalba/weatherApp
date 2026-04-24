import { fetchJson } from "../utils/httpClient.js";
import { formatearClima } from "../utils/formatter.js";

export async function obtenerClima(ciudad) {
  const geoUrl =
    `https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}`;

  const geoData = await fetchJson(geoUrl);

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Ciudad no encontrada");
  }

  const { latitude, longitude, name, country } =
    geoData.results[0];

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current_weather=true`;

  const weatherData = await fetchJson(weatherUrl);

  return formatearClima(
    name,
    country,
    weatherData.current_weather
  );
}