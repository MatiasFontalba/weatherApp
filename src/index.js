import { obtenerClima } from "./services/weatherService.js";

const ciudad = process.argv[2];

if (!ciudad) {
  console.log("Debes ingresar una ciudad");
  process.exit(1);
}

try {
  const clima = await obtenerClima(ciudad);
  console.log(clima);
} catch (error) {
  console.error("Error:", error.message);
}