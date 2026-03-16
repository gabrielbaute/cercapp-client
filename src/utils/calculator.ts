// src/utils/calculator.ts

export const FRECUENCIA = {
  ANUAL: 'anual',
  SEMESTRAL: 'semestral',
  TRIMESTRAL: 'trimestral',
  MENSUAL: 'mensual',
  QUINCENAL: 'quincenal', 
  SEMANAL: 'semanal'
} as const;

export const UNIDAD_TIEMPO = {
  MESES: 'meses',
  ANIOS: 'años'
} as const;

export type FrecuenciaType = typeof FRECUENCIA[keyof typeof FRECUENCIA];
export type UnidadTiempoType = typeof UNIDAD_TIEMPO[keyof typeof UNIDAD_TIEMPO];

export interface RegistroHistorial {
  periodo: number | string;
  acumulado: number;
  aporte: number;
  ganancia: number;
  etiqueta?: string;
}

export class CalculadoraInteresCompuesto {
  private _parsearFrecuencia(frecuencia: FrecuenciaType): number {
      const frecuencias: Record<FrecuenciaType, number> = {
          [FRECUENCIA.ANUAL]: 1,
          [FRECUENCIA.SEMESTRAL]: 2,
          [FRECUENCIA.TRIMESTRAL]: 4,
          [FRECUENCIA.MENSUAL]: 12,
          [FRECUENCIA.QUINCENAL]: 24,
          [FRECUENCIA.SEMANAL]: 52
      };
      return frecuencias[frecuencia] || 12;
  }

  private _tasaInteresPorPeriodo(tasaAnual: number, frecuencia: FrecuenciaType): number {
      const periodosPorAnio = this._parsearFrecuencia(frecuencia);
      return tasaAnual / periodosPorAnio;
  }

  private _totalPeriodos(duracion: number, unidadTiempo: UnidadTiempoType, frecuencia: FrecuenciaType): number {
      const periodosPorAnio = this._parsearFrecuencia(frecuencia);
      
      if (unidadTiempo === UNIDAD_TIEMPO.MESES) {
          switch (frecuencia) {
              case FRECUENCIA.ANUAL: return (duracion/12);
              case FRECUENCIA.SEMESTRAL: return (duracion/6);
              case FRECUENCIA.TRIMESTRAL: return (duracion/3);
              case FRECUENCIA.MENSUAL: return duracion;
              case FRECUENCIA.QUINCENAL: return duracion * 2;
              case FRECUENCIA.SEMANAL: return Math.floor(duracion * 4.33);
              default: return duracion;
          }
      } else {
          return duracion * periodosPorAnio;
      }
  }

  private _numPeriodosParaCap(frecuencia: FrecuenciaType): number {
      switch (frecuencia) {
          case FRECUENCIA.ANUAL: return 1;
          case FRECUENCIA.SEMESTRAL: return 2;
          case FRECUENCIA.TRIMESTRAL: return 4;
          case FRECUENCIA.MENSUAL: return 12;
          case FRECUENCIA.QUINCENAL: return 24;
          case FRECUENCIA.SEMANAL: return 52;
          default: return 1;
      }
  }

  simularCrecimientoPorPeriodo(montoInicial: number, aportePeriodico: number, tasaAnual: number, duracion: number, unidadTiempo: UnidadTiempoType, frecuencia: FrecuenciaType): RegistroHistorial[] {
      if (tasaAnual < 0 || duracion <= 0) throw new Error("La tasa debe ser positiva y la duración mayor a cero.");

      const r = this._tasaInteresPorPeriodo(tasaAnual, frecuencia);
      const n = this._totalPeriodos(duracion, unidadTiempo, frecuencia);
      const historial: RegistroHistorial[] = [];

      let totalAcumulado = montoInicial;
      let saldoCapital = montoInicial;
      let gananciaAcumulada = 0;

      for (let periodo = 0; periodo <= n; periodo++) {
          if (periodo > 0) {
              gananciaAcumulada += (saldoCapital * r);
              totalAcumulado += aportePeriodico + (saldoCapital * r);
              saldoCapital += aportePeriodico;
          }
          historial.push({
              periodo,
              acumulado: Math.round(totalAcumulado * 100) / 100,
              aporte: periodo === 0 ? 0 : aportePeriodico,
              ganancia: Math.round(gananciaAcumulada * 100) / 100,
              etiqueta: this.obtenerEtiquetaPeriodo(periodo, frecuencia, unidadTiempo)
          });
      }
      return historial;
  }

  simularCrecimientoConCapitalizacion(montoInicial: number, aportePeriodico: number, tasaAnual: number, duracion: number, unidadTiempo: UnidadTiempoType, frecuencia: FrecuenciaType): RegistroHistorial[] {
      if (tasaAnual < 0 || duracion <= 0) throw new Error("La tasa debe ser positiva y la duración mayor a cero.");

      const r = this._tasaInteresPorPeriodo(tasaAnual, frecuencia);
      const n = this._totalPeriodos(duracion, unidadTiempo, frecuencia);
      const historial: RegistroHistorial[] = [];

      let totalAcumulado = montoInicial;
      let saldoCapital = montoInicial;
      let gananciaAcumulada = 0;
      let gananciaAcumuladaPeriodoCap = 0;
      let numPeriodosParaCap = this._numPeriodosParaCap(frecuencia);
      let indicePeriodoCapActual = 0;

      for (let periodo = 0; periodo <= n; periodo++) {
          if (periodo > 0) {
              if (indicePeriodoCapActual > numPeriodosParaCap) {
                  saldoCapital += gananciaAcumuladaPeriodoCap;
                  gananciaAcumuladaPeriodoCap = 0;
                  indicePeriodoCapActual = 1;
              }
              gananciaAcumulada += (saldoCapital * r);
              gananciaAcumuladaPeriodoCap += (saldoCapital * r);
              totalAcumulado += aportePeriodico + (saldoCapital * r);
              saldoCapital += aportePeriodico;
          }
          historial.push({
              periodo,
              acumulado: Math.round(totalAcumulado * 100) / 100,
              aporte: periodo === 0 ? 0 : aportePeriodico,
              ganancia: Math.round(gananciaAcumulada * 100) / 100,
              etiqueta: this.obtenerEtiquetaPeriodo(periodo, frecuencia, unidadTiempo)
          });
          indicePeriodoCapActual++;
      }
      return historial;
  }

  obtenerEtiquetaPeriodo(periodo: number, frecuencia: FrecuenciaType, unidadTiempo: UnidadTiempoType): string {
      if (periodo === 0) return "Inicio";
      // Simplificado por brevedad, aquí va tu lógica exacta del legacy
      return `Periodo ${periodo}`;
  }
}