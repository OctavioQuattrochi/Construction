# Backlog — construir SOLO cuando haya usuarios reales

> Estas funciones están **validadas como buenas ideas**, pero construirlas antes de tener
> usuarios sería sobre-ingeniería: agregan complejidad operativa y no se pueden validar
> sin gente usando la plataforma. Retomar en este orden cuando BildAp esté en producción
> con obras reales cargadas.

## 1. Certificación de avance y pagos
Requiere un profesional real certificando y un propietario real pagando.
- Certificado de obra (rubro, cantidad ejecutada, % anterior, avance nuevo, importe).
- Retenciones, descuentos y anticipos.
- Estados: previsto → informado → verificado → certificado → pagado.
- Registro de pagos con comprobante y saldo pendiente.
- Vistas separadas: ejecutado / certificado / pagado / pendiente de certificar / pendiente de pagar.

**Disparador para construirlo:** una obra real con un profesional que necesite certificar.

## 2. Alerta "pagado vs avance"
> *"Se pagó el 72% del contrato, pero el avance físico certificado es del 61%."*

Es la función más valiosa de todo el análisis (previene conflictos), pero **depende de que
alguien cargue avances y pagos de verdad**. Sin datos reales es una alerta vacía.

**Disparador:** cuando existan certificados + pagos cargados en al menos una obra.

## 3. Avance ponderado por rubro
`Avance general = Σ (peso del rubro × avance del rubro)`, con el peso salido del presupuesto.
Correcto técnicamente, pero exige que el presupuesto esté cargado rubro por rubro con
precisión. En el MVP el avance se carga por etapa a mano.

## 4. Órdenes de cambio con aprobación formal
- Solicitud del propietario → análisis del profesional (costo, plazo, materiales) → aprobación.
- Historial inmutable (no se borra: se corrige generando una corrección).
- Actualización automática de presupuesto, cronograma y lista de materiales al aprobar.

**Disparador:** dos partes (propietario + profesional) usando la misma obra.

## 5. Permisos por rol y trazabilidad
Propietario y profesional comparten la información con permisos distintos
(quién certifica, quién aprueba, quién registra pagos). Es el diferencial real de BildAp,
pero no tiene sentido sin dos usuarios distintos en la misma obra.

## 6. Panel profesional multi-obra
Varias obras y clientes, estadísticas de consultas y oportunidades comerciales.
**Disparador:** un profesional con 2+ obras.

## 7. Alertas automáticas
Avance por debajo del previsto, rubro excedido, pago próximo, certificado sin revisar,
material faltante, entrega demorada, cambio pendiente.
**Disparador:** obras activas con cronograma cargado.

## 8. Verificación real de profesionales
Matrícula e identidad verificadas por separado, con constancia.
Recién ahí se puede volver a decir "verificados" (hoy el claim está retirado).
**Disparador:** profesionales reales queriendo sumarse.

## 9. Reseñas de clientes
Sólo de clientes con una obra registrada (evita reseñas falsas).
**Disparador:** obras terminadas.

## 10. Inmuebles con evaluación técnica
Inspección, riesgo de humedad/fisuras, potencial de ampliación, costo estimado de refacción.
Buen diferenciador, pero no es el core hoy.

## 11. Monetización (Mercado Pago)
Suscripción premium, membresías de profesionales, publicación paga de inmuebles.
**Disparador:** tracción demostrada (usuarios volviendo).

## 12. Inteligencia artificial
Comparar presupuestos, detectar ítems faltantes, leer documentos de obra, resumen semanal,
detección de desvíos, asistente técnico.
**Disparador:** datos reales acumulados. Sin obras cargadas la IA no tiene sobre qué operar.

---

## Trabajo de contenido (no de código)
- Ampliar los artículos del blog: son más cortos que el tiempo de lectura declarado.
  Sumar fotos reales, esquemas, errores frecuentes, checklist descargable, costos
  orientativos, "cuándo llamar a un profesional", autor y fecha de revisión técnica.
- Reemplazar los perfiles/inmuebles **Demo** por reales (hoy están correctamente etiquetados).
