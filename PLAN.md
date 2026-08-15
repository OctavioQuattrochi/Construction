# BildAp — Plan de producto (análisis crítico de la devolución)

> Devolución externa procesada, deduplicada y filtrada. Cada punto tiene veredicto:
> ✅ aplicar · 🟡 aplicar con cambios · ⏸️ diferir · ❌ descartar · ✔️ ya hecho

---

## A. Verificado contra el código (hechos, no opiniones)

| Afirmación | ¿Cierto? | Evidencia |
|---|---|---|
| Datos demo con teléfonos `...1111111` | **SÍ** | `prisma/seed.ts`: 5493511111111 … 5493517777777 |
| Dice "verificados" sin verificar | **SÍ** | `/profesionales`, `/inmuebles`, `tools.tsx` |
| Metadatos apuntan a dominio equivocado | **SÍ** | `NEXT_PUBLIC_SITE_URL` mal seteada en Netlify |
| No hay URL canónica | **SÍ** | `layout.tsx` sólo tiene `metadataBase` |
| Identidad mezclada estudio/plataforma | **SÍ** | "Un solo estudio…" + "40+ años" |
| Calculadora: total tapado tras registro | **SÍ** | `budget-panel.tsx` blurea el total |
| Comparador mezcla productos distintos | **PARCIAL** | Hay matching + EXCLUDE, pero falla en casos (ver B-4) |
| "Falta crear sitemap" | **NO** | Ya existen `sitemap.ts` y `robots.ts` |
| "Índice 3/8/2026, refresca cada 6 h" = inconsistencia | **NO** | Es el comportamiento correcto del cron |

---

## B. Etapa 1 — Corregir ANTES de promocionar (barato + alto impacto)

**B-1. Datos demo ✅**
Teléfonos/emails falsos evidentes destruyen la confianza en una plataforma que maneja
presupuestos. Acción: datos realistas + etiqueta **"Demo"** visible mientras no haya
perfiles reales.

**B-2. Quitar "verificados" ✅**
Hoy es publicitariamente falso (y en AR puede leerse como publicidad engañosa).
Cambiar por "de la red BildAp" hasta que exista verificación real de matrícula.

**B-3. SEO/dominio ✅**
Canonical + `NEXT_PUBLIC_SITE_URL` correcta + OG/JSON-LD apuntando al dominio real.
Se aplica junto con el dominio propio (ver E).

**B-4. Comparador: comparación válida ✅ (el más importante)**
El problema real no es "mezcla productos", es que **inventa un ahorro que no existe**
cuando agrupa cosas distintas (ej. Sika dentro de "Cemento 25 kg" → "ahorro" de $45.000).
Eso es exactamente lo que decidimos no hacer nunca.
Acción: (a) **precio por unidad comparable** ($/kg, $/u, $/m²), (b) no mostrar "ahorrás"
si la dispersión es sospechosa, (c) endurecer el agrupado.
⏸️ La taxonomía completa (categoría/subcategoría/marca/uso) es sobre-ingeniería para hoy.

**B-5. Promesa de precios honesta ✅**
Copy explícito: "Precios en vivo de N proveedores · referencia de otros M".
(Ya ocultamos referencia por defecto; falta ajustar el texto.)

**B-6. Separar plataforma de estudio ✅**
BildAp = plataforma. El estudio = un servicio dentro. Juan Carlos = fundador/aval.
Quita la contradicción "un solo estudio" vs "red".

**B-7. Invertir el muro de la calculadora ✅**
Hoy: total tapado → fricción antes de demostrar valor.
Mejor: **mostrar el total gratis** y pedir cuenta para *guardar, exportar, actualizar
precios, alertas y sumarlo a una obra*. Se regala el valor, se cobra la persistencia.

**B-8. Eventos de analítica ✅** (cálculo hecho, búsqueda, registro, obra creada).
Sin esto no sabemos qué funciona.

---

## C. Etapa 2 — "Mi Obra": el producto real

**Veredicto: ✅ dirección correcta, 🟡 alcance recortado.**

*Por qué sí:* las herramientas son de un solo uso (calculo y me voy). Una obra **retiene**:
el usuario vuelve todas las semanas. Es lo que convierte visitas en usuarios.

*Por qué recortado:* lo descrito (certificados con retenciones, avance ponderado por
rubro, cadenas de aprobación, historial inmutable, permisos por rol) es un **Procore
argentino** — meses de trabajo y complejidad operativa real. Construirlo entero **sin un
solo usuario** es el error clásico.

### MVP propuesto (rebana vertical, no las 7 pestañas)
1. **Crear obra** (nombre, ubicación, fecha estimada).
2. **Materiales**: "Agregar a mi obra" desde calculadora y comparador.
3. **Presupuesto vs gastado**: presupuestado / pagado / pendiente.
4. **Diario de obra**: foto + fecha + nota.

Eso ya entrega el bucle completo: *calculo → guardo en mi obra → sigo el gasto → registro
el avance*. Recién con eso usándose de verdad, sumar:

⏸️ Certificados y retenciones · avance ponderado por rubro · órdenes de cambio con
aprobación · estados de material (8 estados) · panel profesional · permisos propietario
vs profesional · alertas automáticas.

> El dato más valioso de toda la devolución: **"pagado 72% vs avance 61%"**. Es la alerta
> que previene conflictos y justifica la plataforma. Pero requiere que alguien cargue
> avance y pagos de verdad — o sea, requiere el MVP funcionando primero.

---

## D. Diferido / descartado

⏸️ **Inmuebles con inspección técnica** — buen diferenciador, pero no es el core.
⏸️ **Perfiles profesionales completos + reseñas** — necesita profesionales reales antes.
⏸️ **Ampliar artículos del blog** — cierto (son cortos), pero es trabajo de contenido, no de código.
⏸️ **Panel profesional multi-obra** — Etapa 3.
❌ **Etapa 4 (IA: leer documentos, resumen semanal, detectar desvíos)** — prematuro sin datos reales cargados.
❌ **Reescribir toda la navegación ya** — 🟡 sí simplificar, pero recién cuando "Mi Obra" exista y sea el centro.

---

## E. Dominio (NIC.ar → producción)

**Recomendación: Cloudflare como DNS, Netlify como hosting.**
1. En Cloudflare: crear el sitio → te da 2 nameservers.
2. En NIC.ar: reemplazar los delegadores por los de Cloudflare.
3. En Cloudflare DNS: `CNAME www → <sitio>.netlify.app` y raíz según lo que indique Netlify.
4. Poner los registros en **DNS only (nube gris)**, no proxy — con proxy naranja Netlify
   puede fallar el SSL. (Si se usa proxy: SSL en modo **Full (strict)**.)
5. En Netlify: agregar el dominio personalizado y esperar el certificado.
6. **Requiere un deploy** (queda para el 25/08): actualizar `NEXT_PUBLIC_SITE_URL` y
   agregar la nueva redirect URI en Google OAuth.

*Alternativa más simple:* nameservers de Netlify directamente (menos control, sin CDN
extra de Cloudflare).

---

## F. Orden de ejecución acordado

1. **Etapa 1 completa** (B-1 … B-8) — local, listo para deployar el 25/08.
2. **MVP de Mi Obra** (C) — el producto que retiene.
3. Dominio + SEO en el primer deploy disponible.
4. Recién después: certificados, órdenes de cambio, panel profesional.
