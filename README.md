# Construction — Plataforma de referencia en construcción

Plataforma de información para la industria de la construcción (Argentina · Córdoba), del estudio del **Arquitecto Juan Carlos Quattrochi**. Contenido técnico, calculadoras de materiales, comparador de precios de proveedores, consultoría profesional y un pequeño CMS.

Construida con **Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Prisma**.

## Stack

| Área | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Lenguaje | TypeScript (strict) |
| Estilos | Tailwind CSS + sistema de diseño propio |
| Animaciones | Framer Motion |
| Base de datos | Prisma (SQLite en dev · PostgreSQL en prod) |
| Auth | JWT (jose) en cookie httpOnly + bcrypt |
| Validación | Zod |

## Puesta en marcha

```bash
npm install            # instala dependencias y genera el cliente Prisma
cp .env.example .env   # configurá tus variables (ya hay un .env de dev incluido)
npm run db:push        # crea el esquema en SQLite
npm run db:seed        # carga admin, categorías, servicios y artículos
npm run dev            # http://localhost:3000
```

### Producción

```bash
npm run build
npm run start
```

## Credenciales de administración (seed)

- URL: `/admin`
- Email: `admin@construccion.com.ar`
- Password: `Construccion2024!`

> Cambiá `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `AUTH_SECRET` en `.env` antes de producir.

## Estructura

```
src/
  app/
    (marketing)/        # sitio público (home, conocimiento, calculadoras, comparador, contacto)
    admin/              # CMS: login + dashboard (artículos, categorías, servicios, mensajes)
    api/                # auth, compare, contact
  components/           # ui/ (design system), layout/, sections/, comparator/, calculators/, admin/
  lib/
    providers/          # motor del comparador de precios (ver abajo)
    calculators.ts      # fórmulas de las calculadoras
    auth.ts db.ts ...
prisma/                 # schema + seed
```

## Comparador de precios — arquitectura

El motor consume **solo datos normalizados**; cada proveedor es independiente.

```
lib/providers/
  types.ts        # NormalizedProduct, Provider, CompareResult
  base.ts         # BaseProvider: fetchLive() + normalización + fallback
  catalog.ts      # catálogo de referencia de materiales
  casa-manrique.ts / ferrocons.ts / easy.ts / sodimac.ts
  registry.ts     # registro de proveedores
  engine.ts       # compare(): consulta en paralelo + ordena por precio
```

### Estado de integración por proveedor

| Proveedor | Modo | Fuente |
|-----------|------|--------|
| **Easy Argentina** | 🟢 En vivo | API pública (VTEX) |
| **Sodimac Argentina** | 🟢 En vivo | `__NEXT_DATA__` de la búsqueda (Next.js) |
| **Casa Manrique** | 🟢 En vivo | WooCommerce Store API (según catálogo) |
| **Ferrocons** | 🟡 Referencia | Catálogo interno (PrestaShop tras Cloudflare, requiere navegador headless) |

Cuando un proveedor "en vivo" no tiene resultados para una búsqueda, cae automáticamente a su catálogo de referencia. En la interfaz, cada oferta se marca **En vivo** o **Referencia**.

### Agregar un proveedor nuevo

1. Creá `lib/providers/mi-proveedor.ts` extendiendo `BaseProvider`.
2. Implementá `fallback()` (obligatorio) y opcionalmente `fetchLive()` para scraping real.
3. Registralo en `registry.ts`.

**No hay que tocar el motor ni la UI.** El comparador lo toma automáticamente.

Cada proveedor puede hacer scraping real en `fetchLive()`; si falla o no hay red,
se usa un catálogo de referencia para que el comparador siga siendo funcional.

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:push` | Sincroniza el esquema con la base |
| `npm run db:seed` | Carga datos iniciales |
| `npm run db:studio` | Prisma Studio |
| `npm run db:reset` | Resetea y re-siembra la base |

## Migrar a PostgreSQL (producción)

En `prisma/schema.prisma` cambiá `provider = "sqlite"` por `"postgresql"` y actualizá `DATABASE_URL`, luego `npm run db:push && npm run db:seed`.
