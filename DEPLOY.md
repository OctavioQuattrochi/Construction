# Guía de despliegue en Netlify (beta)

La app corre en Netlify con SSR, API routes, server actions y middleware (vía el plugin
oficial de Next.js). El único cambio respecto a tu entorno local es la base de datos:
**en la nube no se puede usar SQLite**, así que pasamos a **PostgreSQL**.

> El código ya quedó listo para Postgres (`prisma/schema.prisma`, `netlify.toml` y
> los binaryTargets de Prisma para las funciones de Netlify).

---

## Paso 1 — Crear una base PostgreSQL (gratis)

Opción recomendada: **Neon** (https://neon.tech) — Postgres serverless, plan gratis.

1. Creá una cuenta y un proyecto.
2. Copiá el **Connection string** (algo como
   `postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`).
3. Guardalo, lo vas a usar en el paso 2 y 4.

> Alternativa: en Netlify, **Project → Integrations → Netlify DB** crea una Neon y te
> inyecta `DATABASE_URL` automáticamente. Si usás esto, salteá el `DATABASE_URL` del paso 4.

---

## Paso 2 — Cargar el esquema y los datos en esa base (desde tu PC)

En la raíz del proyecto:

```bash
# 1) Poné el connection string de Neon en tu .env local
#    DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"

# 2) Generá el cliente y creá las tablas en Neon
npx prisma generate
npx prisma db push

# 3) Cargá admin, categorías, servicios y artículos de ejemplo
npm run db:seed
```

Con esto tu base de producción queda con el usuario admin y el contenido inicial.

> A partir de acá, tu `npm run dev` local también usa Neon. Si querés volver a SQLite
> solo para desarrollo, cambiá `provider = "postgresql"` a `"sqlite"` y el `DATABASE_URL`
> a `file:./dev.db` (pero para el deploy tiene que estar en `postgresql`).

---

## Paso 3 — Subir el código a GitHub

Netlify despliega desde un repo Git (es lo mejor: cada `push` redepliega).

```bash
git init
git add .
git commit -m "Construction — MVP listo para beta"
git branch -M main
# Creá un repo vacío en github.com/new (por ej. "construction") y luego:
git remote add origin https://github.com/TU_USUARIO/construction.git
git push -u origin main
```

> `.env` y `node_modules` ya están en `.gitignore`; tus credenciales NO se suben.

---

## Paso 4 — Importar en Netlify y configurar variables

1. En Netlify: **Add new project → Import an existing project → GitHub** y elegí el repo.
2. Netlify detecta Next.js solo. Dejá el build command en `npm run build`.
3. Antes de deployar, entrá a **Site configuration → Environment variables** y agregá:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | el connection string de Neon (con `?sslmode=require`) |
| `AUTH_SECRET` | un string aleatorio largo (ver abajo) |
| `ADMIN_EMAIL` | `admin@construccion.com.ar` (o el que quieras) |
| `ADMIN_PASSWORD` | tu contraseña de admin |
| `NEXT_PUBLIC_SITE_URL` | `https://TU-SITIO.netlify.app` (lo ajustás tras el 1er deploy) |
| `NEXT_PUBLIC_WHATSAPP` | el número real, formato `549351...` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | el email real del estudio |

Generá el `AUTH_SECRET` con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

4. **Deploy site.**

> Las `NEXT_PUBLIC_*` se "hornean" en el build: si cambiás una, hay que **redeployar**.
> Después del primer deploy vas a saber tu URL `*.netlify.app` → poné esa en
> `NEXT_PUBLIC_SITE_URL` y volvé a deployar (Deploys → Trigger deploy).

---

## Paso 5 — Probar la beta

- Home: `https://TU-SITIO.netlify.app`
- Admin: `https://TU-SITIO.netlify.app/admin` (con `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- Comparador, calculadoras, conocimiento y contacto funcionando.

---

## Actualizar la beta

Cada cambio: `git add . && git commit -m "..." && git push` → Netlify redepliega solo.

Si cambiás el **esquema** de la base (`schema.prisma`), corré de nuevo desde tu PC
(apuntando a Neon): `npx prisma db push`.

---

## Problemas comunes

- **"Prisma Client could not locate the Query Engine"** → ya está resuelto con
  `binaryTargets = ["native", "rhel-openssl-3.0.x"]` en `schema.prisma`. Asegurate de que
  el build corra `prisma generate` (lo hace `npm run build`).
- **`db push` se queda colgado con Neon** → destildá "Pooled connection" en Neon y usá el
  connection string **directo** solo para `db push`/`seed`. Para runtime en Netlify, dejá
  el **pooled**.
- **Login no anda / sesión no persiste** → falta `AUTH_SECRET` en Netlify.
- **Las imágenes de Unsplash no cargan** → ya están permitidas en `next.config.mjs`.
