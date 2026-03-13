import createClient from "openapi-fetch";
import type { paths } from "./v1/schema";

const client = createClient<paths>({
  baseUrl: "http://localhost:8000", // Cambia esto según tu entorno
});

client.use({
  onRequest({ request }) {
    // 1. Buscamos el token en el almacenamiento del navegador
    const token = localStorage.getItem("token");
    
    // 2. Si existe, lo inyectamos en los headers
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    
    // 3. Retornamos la petición ya modificada
    return request;
  }
});

export default client;