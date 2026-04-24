export function formatearClima(
  ciudad,
  pais,
  clima
) {
  return `
Clima actual

Ciudad: ${ciudad}, ${pais}
Temperatura: ${clima.temperature} °C
Viento: ${clima.windspeed} km/h
Dirección del viento: ${clima.winddirection}°
Hora: ${clima.time}
`;
}