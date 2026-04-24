import { fetchJson } from "../utils/httpClient.js";
import { formatearClima } from "../utils/formatter.js";
import { obtenerDeCache, guardarEnCache } from "../utils/cacheService.js";

export async function obtenerClima(ciudad) {
  const datosCacheados = await obtenerDeCache(ciudad);
  if (datosCacheados) {
    console.log("Caché local");
    return formatearClima(
      datosCacheados.name,
      datosCacheados.country,
      datosCacheados.current_weather
    );
  }

  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.append("name", ciudad);

  const geoData = await fetchJson(geoUrl.toString());

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(
      `Ciudad no encontrada: "${ciudad}". Verifica la ortografía.`
    );
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.append("latitude", latitude);
  weatherUrl.searchParams.append("longitude", longitude);
  weatherUrl.searchParams.append("current_weather", "true");

  const weatherData = await fetchJson(weatherUrl.toString());

  if (!weatherData?.current_weather) {
    throw new Error(
      "Los datos meteorológicos no están disponibles en este momento."
    );
  }

  const dataParaGuardar = {
    name,
    country,
    current_weather: weatherData.current_weather,
  };
  await guardarEnCache(ciudad, dataParaGuardar);

  return formatearClima(name, country, weatherData.current_weather);
}
