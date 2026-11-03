# BildAp — notas de continuidad (Claude Code)

Snapshot corto para retomar sin redescubrir el proyecto. Detalle en `PLAN.md`, `BACKLOG-POST-USUARIOS.md`, `DEPLOY.md`, `INTEGRACIONES.md`.

## Qué es
Plataforma de construcción para Argentina/Córdoba. El núcleo es **Mi Obra**: seguir una obra semana a semana (etapas/avance, dinero, materiales, libro de obra). Alrededor: calculadoras, comparador de precios y contenido.

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind + Framer Motion + Prisma.
- DB: Neon Postgres. Schema con `npx prisma db push` (sin migrations); el build de Netlify solo corre `prisma generate`.
- Hosting: Netlify, auto-deploy en push a `main`. Producción: `https://bildap.com.ar` (`PRODUCTION_URL` en `src/lib/site.ts`).
- Auth: miembros con Google OAuth (`src/lib/member-auth.ts`; en producción la redirect URI es siempre `https://bildap.com.ar/api/auth/google/callback`); admin `/admin` con JWT propio.
- Integraciones: Resend (leads), GA4, Sentry (no hace nada sin DSN), Netlify Scheduled Function de precios cada 6 h (`/api/cron/refresh-prices`, requiere `CRON_SECRET`).

## Funcionalidad existente
- Mi Obra (`/mi-obra`): obras con etapas, avance ponderado, gastos, materiales, libro de obra, editores invitados, informe.
- Calculadoras por etapa → "agregar a mi obra".
- Comparador: scraping en vivo (Casa Manrique, Easy, Sodimac, Merlino, De Diego); precios de referencia ocultos por defecto. Índice/histórico de precios, lista de compra.
- `/mi-cuenta`: favoritos, presupuestos guardados, presupuesto de obra con precios reales.
- Contenido: Centro de Conocimiento (blog), noticias, profesionales, inmuebles, newsletter, contacto (form + email). Todo administrable por el CMS admin.

## Estado / pendientes
- WhatsApp público **eliminado** (b133cb4). Falta el número nuevo: hay que volver a agregar el canal cuando el usuario lo pase.
- Pendiente del usuario en Netlify (verificar): `CRON_SECRET`, `NEXT_PUBLIC_SENTRY_DSN`. Backups de Neon sin verificar.
- Comparador: falta monitoreo persistente, Ferrocons (headless), La Obra/Maconta vía JSON-LD.
- Deploys: unos minutos de 404 por deploy (posible `force-dynamic` en el layout marketing).
- Próximas prioridades: consolidar Mi Obra con usuarios reales → robustez del comparador → monetización (Mercado Pago) solo con tracción.

## Reglas de trabajo
- Correr `npm run build` (incluye lint + tipos) antes de cada push a `main`; push = deploy a producción.
- No hacer polling de Netlify después del push: el usuario confirma.
- Secretos solo en env vars de Netlify; nunca en git.
- No inventar precios ni cifras: solo datos ciertos.
- No sobredimensionar: lo diferido está en `BACKLOG-POST-USUARIOS.md`. Cambios mínimos, sin refactors no pedidos.
- El usuario tiene límite bajo de uso: ser eficiente en tokens.
