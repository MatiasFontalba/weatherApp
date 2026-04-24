import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = path.join(__dirname, "../../.weather_cache.json");
const CACHE_TTL = 60 * 60 * 1000;

async function cargarCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function guardarArchivoCache(data) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function obtenerDeCache(ciudad) {
  const cache = await cargarCache();

  const key = ciudad.toLowerCase().trim();
  const entrada = cache[key];

  if (!entrada) return null;

  const ahora = Date.now();
  if (ahora - entrada.timestamp > CACHE_TTL) {
    delete cache[key];
    await guardarArchivoCache(cache);
    return null;
  }

  entrada.timestamp = ahora;
  await guardarArchivoCache(cache);

  return entrada.data;
}

export async function guardarEnCache(ciudad, data) {
  const cache = await cargarCache();
  const key = ciudad.toLowerCase().trim();

  cache[key] = {
    timestamp: Date.now(),
    data: data,
  };

  await guardarArchivoCache(cache);
}
