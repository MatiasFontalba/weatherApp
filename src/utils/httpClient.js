export async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error en la petición");
  }

  return response.json();
}