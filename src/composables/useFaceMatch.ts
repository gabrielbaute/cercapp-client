import { ref } from 'vue';

// Le indicamos a TypeScript que 'faceapi' existirá de forma global en la ventana del navegador
// Esto evita que TS grite porque no instalamos la librería vía NPM.
declare global {
  interface Window {
    faceapi: any;
  }
}

export function useFaceMatch() {
  const isLoaded = ref(false);
  const isModelLoading = ref(false);
  const error = ref<string | null>(null);

  // 1. INYECCIÓN DINÁMICA: Cargar el script solo cuando se necesite
  const loadFaceApiScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Si ya está cargado previamente, resolvemos de inmediato
      if (window.faceapi) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      // Asegúrate de que en tu carpeta public/ exista la subcarpeta js/ con el archivo
      script.src = '/js/face-api.js'; 
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar la librería face-api.js. Verifica que esté en public/js/'));
      document.head.appendChild(script);
    });
  };

  // 2. CARGA DE MODELOS NEURONALES
  const loadModels = async () => {
    if (isLoaded.value) return;
    isModelLoading.value = true;
    error.value = null;

    try {
      await loadFaceApiScript();
      
      // Esta ruta apunta a tu carpeta public/models/
      const MODEL_URL = '/models'; 

      // Usamos Promise.all para cargar las 3 redes neuronales en paralelo y ahorrar tiempo
      await Promise.all([
        window.faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      isLoaded.value = true;
    } catch (e: any) {
      console.error("Error inicializando biometría:", e);
      error.value = "Error al inicializar el motor de reconocimiento facial.";
    } finally {
      isModelLoading.value = false;
    }
  };

  // 3. OPTIMIZACIÓN DE MEMORIA RAM (Salvavidas para celulares)
  const resizeImage = (image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, maxSize = 800) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');
    
    // Identificamos las dimensiones reales dependiendo del elemento (video o imagen)
    let width = image instanceof HTMLVideoElement ? image.videoWidth : image.width;
    let height = image instanceof HTMLVideoElement ? image.videoHeight : image.height;

    // Regla de 3 para escalar manteniendo el aspect ratio
    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    return canvas;
  };

  // 4. COMPARACIÓN BIOMÉTRICA
  const compareFaces = async (source1: HTMLImageElement | HTMLCanvasElement, source2: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) => {
    if (!isLoaded.value) {
      await loadModels();
    }

    try {
      // Redimensionamos para no fundir la memoria RAM del dispositivo
      const resized1 = resizeImage(source1);
      const resized2 = resizeImage(source2);

      // Detectamos en el Documento de Identidad
      const detection1 = await window.faceapi.detectSingleFace(resized1).withFaceLandmarks().withFaceDescriptor();
      if (!detection1) {
        throw new Error('No se detectó un rostro claro en el documento de identidad. Intenta con una foto con mejor iluminación.');
      }

      // Detectamos en la Selfie/Cámara
      const detection2 = await window.faceapi.detectSingleFace(resized2).withFaceLandmarks().withFaceDescriptor();
      if (!detection2) {
        throw new Error('No se detectó tu rostro en la cámara. Mírala de frente y con buena luz.');
      }

      // Distancia Euclidiana (Mientras más cercana a 0, más idénticos son)
      const distance = window.faceapi.euclideanDistance(detection1.descriptor, detection2.descriptor);
      
      return {
        match: distance < 0.6, // Mantenemos tu threshold estricto original (0.6)
        distance: distance
      };

    } catch (e: any) {
      throw new Error(e.message || 'Error matemático durante la comparación facial.');
    }
  };

  return {
    isLoaded,
    isModelLoading,
    error,
    loadModels,
    compareFaces
  };
}