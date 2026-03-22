import { ref, onBeforeUnmount, nextTick } from 'vue';
import { useFaceMatch } from '../../composables/useFaceMatch';

// Recibimos un callback 'onSuccess' que se ejecutará si la biometría es correcta
export default function useKYCStep(onSuccess: () => void) {
  const { loadModels, compareFaces, isModelLoading } = useFaceMatch();

  // Estados del flujo
  const step = ref<1 | 2 | 3>(1); // 1: Documento, 2: Cámara, 3: Procesando
  const documentUrl = ref<string | null>(null);
  const photoUrl = ref<string | null>(null);
  const isProcessing = ref(false);
  const errorMessage = ref<string | null>(null);

  // Referencias a elementos del DOM
  const videoRef = ref<HTMLVideoElement | null>(null);
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const documentImageRef = ref<HTMLImageElement | null>(null);
  const photoImageRef = ref<HTMLImageElement | null>(null);

  let mediaStream: MediaStream | null = null;

  // --- PASO 1: DOCUMENTO ---
  const handleDocumentUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    // Creamos una URL temporal para mostrar la vista previa sin subirla al servidor
    documentUrl.value = URL.createObjectURL(file);
    errorMessage.value = null;
  };

  const confirmDocument = () => {
    if (!documentUrl.value) {
      errorMessage.value = "Por favor, carga un documento de identidad primero.";
      return;
    }
    
    step.value = 2;
    errorMessage.value = null;
    
    // Optimizamos tiempo: empezamos a cargar la red neuronal en segundo plano 
    // mientras el usuario se acomoda frente a la cámara.
    loadModels();
    startCamera();
  };

  // --- PASO 2: CÁMARA WEBCAM ---
  const startCamera = async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.value) {
        videoRef.value.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accediendo a la cámara:", error);
      errorMessage.value = "No pudimos acceder a tu cámara. Por favor, concede los permisos en tu navegador.";
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  };

  // --- PASO 3: CAPTURA Y AUDITORÍA ---
  const capturePhotoAndCompare = async () => {
    if (!videoRef.value || !canvasRef.value) return;

    // 1. Congelamos el fotograma del video en el canvas
    const video = videoRef.value;
    const canvas = canvasRef.value;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    photoUrl.value = canvas.toDataURL('image/png');

    // Apagamos la cámara para ahorrar batería
    stopCamera();
    
    // Cambiamos la UI a estado de procesamiento
    step.value = 3; 
    isProcessing.value = true;
    errorMessage.value = null;

    // Esperamos a que Vue dibuje la imagen capturada en el DOM
    await nextTick(); 

    try {
      if (!documentImageRef.value || !photoImageRef.value) {
        throw new Error("Error interno: No se pudieron leer las imágenes.");
      }

      // ¡Aquí ocurre la magia delegada a nuestro Wrapper!
      const result = await compareFaces(documentImageRef.value, photoImageRef.value);

      if (result.match) {
        // MATCH PERFECTO: Llamamos a la función de éxito que nos pasaron
        onSuccess();
      } else {
        errorMessage.value = "Los rostros no coinciden. Asegúrate de estar en un lugar con buena iluminación y mirar de frente.";
        // Devolvemos al usuario a la cámara
        resetToCamera();
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Ocurrió un error al procesar la biometría.";
      resetToCamera();
    } finally {
      isProcessing.value = false;
    }
  };

  const resetToCamera = () => {
    step.value = 2;
    photoUrl.value = null;
    startCamera();
  };

  // Limpieza vital: Al salir de la vista, apagamos la cámara y limpiamos memoria RAM
  onBeforeUnmount(() => {
    stopCamera();
    if (documentUrl.value) URL.revokeObjectURL(documentUrl.value);
  });

  return {
    step,
    documentUrl,
    photoUrl,
    isProcessing,
    isModelLoading,
    errorMessage,
    videoRef,
    canvasRef,
    documentImageRef,
    photoImageRef,
    handleDocumentUpload,
    confirmDocument,
    capturePhotoAndCompare,
    resetToCamera
  };
}