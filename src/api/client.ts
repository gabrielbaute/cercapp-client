import createClient from "openapi-fetch";
import type { paths } from "./v1/schema";

const client = createClient<paths>({
  // Vite reemplazará esto en tiempo de compilación por la URL correspondiente
  baseUrl: import.meta.env.VITE_API_BASE_URL,
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
    return new Request(request, { cache: "no-store" });
  }
});

export default client;