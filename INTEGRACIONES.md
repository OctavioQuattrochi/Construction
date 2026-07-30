# Integraciones — Email, Analytics y Anti-spam

Todo el código ya está implementado. Solo tenés que crear las cuentas externas y
cargar las variables de entorno en **Netlify** (y opcionalmente en tu `.env` local).

> El anti-spam / rate-limit ya funciona **sin configurar nada**.

---

## 1) Email de notificación de leads — Resend

Cada vez que alguien completa el formulario de contacto o se suscribe al
newsletter, te llega un email.

### Pasos

1. Entrá a **https://resend.com** y creá una cuenta **con `octavioq21@gmail.com`**
   (importante para las pruebas: sin dominio propio, Resend solo deja enviar a la
   casilla del dueño de la cuenta).
2. En el panel de Resend → **API Keys** → **Create API Key** (permiso *Sending*).
   Copiá la clave (empieza con `re_...`).
3. En **Netlify → Site configuration → Environment variables**, agregá:

   | Variable | Valor |
   |----------|-------|
   | `RESEND_API_KEY` | tu clave `re_...` |
   | `RESEND_FROM` | `BildAp <onboarding@resend.dev>` |
   | `LEAD_NOTIFY_EMAIL` | `octavioq21@gmail.com` |

4. **Deploys → Trigger deploy** (o pusheá cualquier cambio) para que tome las variables.
5. Probá: completá el formulario en `/contacto`. Debería llegarte el email.

### Cuando tengas dominio propio (opcional, a futuro)
En Resend → **Domains** → verificás `bildap.com.ar` (agregás unos registros DNS).
Después cambiás `RESEND_FROM` a algo como `BildAp <hola@bildap.com.ar>` y vas a
poder enviar a cualquier destinatario (no solo a tu casilla).

---

## 2) Analytics — Google Analytics 4 (o Plausible)

### Opción A — Google Analytics 4 (gratis, la más usada)

1. Entrá a **https://analytics.google.com** → **Administrar → Crear propiedad**.
2. Creá una propiedad para tu sitio, tipo **Web**, con la URL de Netlify.
3. Copiá el **ID de medición** (formato `G-XXXXXXXXXX`).
4. En **Netlify → Environment variables**, agregá:

   | Variable | Valor |
   |----------|-------|
   | `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` |

5. **Trigger deploy**. Listo: en unos minutos vas a ver visitas en tiempo real.

> ⚠️ `NEXT_PUBLIC_GA_ID` se "hornea" en el build → después de cargarla hay que
> **redeployar** para que tome efecto.

### Opción B — Plausible (alternativa liviana, sin cookies, ~pago)
Si preferís algo más simple: creá el sitio en plausible.io y cargá
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN="tu-dominio"`. (Dejá `NEXT_PUBLIC_GA_ID` vacío.)

---

## 3) Anti-spam / Rate limit — ya activo ✅

No requiere configuración. Límites actuales por IP:

| Endpoint | Límite |
|----------|--------|
| `/api/contact` | 5 envíos cada 10 min |
| `/api/newsletter` | 5 cada 10 min |
| `/api/compare` | 20 búsquedas por minuto |

Más el honeypot anti-bots que ya tenían los formularios. Si superás el límite,
la API responde `429` con un mensaje amable.

> Nota técnica: el límite es *en memoria por instancia* (suficiente para la beta).
> Si el sitio crece mucho, se migra a Upstash/Redis sin cambiar la lógica.

---

## Resumen de variables nuevas en Netlify

```
RESEND_API_KEY=re_...
RESEND_FROM=BildAp <onboarding@resend.dev>
LEAD_NOTIFY_EMAIL=octavioq21@gmail.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Después de cargarlas → **Trigger deploy** y a probar. 🚀
