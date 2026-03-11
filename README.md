# Koda - Gestor de Finanzas Personales

Koda es un gestor de finanzas personales diseñado para llevar un registro de ingresos, gastos y monedas personalizadas por usuario, con capacidades integradas de conversión multimoneda.

## Tecnologías

- **Framework:** Next.js 16
- **Librería de UI:** React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **Backend y Base de Datos:** Supabase (PostgreSQL + Auth)
- **Internacionalización:** `next-intl`

## Comenzando

### Requisitos Previos

Asegúrate de tener instalado `pnpm` en tu sistema.

### Instalación

1. Clona el repositorio e instala las dependencias:
   ```bash
   pnpm install
   ```

2. Configura las variables de entorno. Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

### Otros Comandos

- `pnpm build`: Crea una build de producción (los errores de TypeScript se ignoran durante el proceso de build, configurado en `next.config.mjs`).
- `pnpm lint`: Ejecuta ESLint para analizar la calidad del código.

## Arquitectura

### Enrutamiento e Internacionalización

La aplicación utiliza enrutamiento internacionalizado con `next-intl`. Todas las rutas canónicas activas se encuentran bajo `app/[locale]/` (por ejemplo, `/es/dashboard`, `/en/auth/login`).
- Idiomas soportados: `es` (predeterminado) y `en`.
- `middleware.ts` gestiona la resolución del idioma y actualiza las sesiones de Supabase en cada petición.
- Existen rutas heredadas (legacy) en `app/dashboard/` y `app/auth/`, pero las rutas canónicas son las variantes con `[locale]`.

### Capa de Datos

La aplicación utiliza un enfoque híbrido para la obtención de datos:
1. **Hooks SWR (`lib/hooks/use*.ts`):** Utilizados para la obtención de datos en el cliente mediante el cliente de Supabase para el navegador. Después de las mutaciones, se llama a `mutate()` para desencadenar la revalidación.
2. **Server Actions (`lib/actions/*.ts`):** Utilizadas para mutaciones en el servidor. Estas funciones con `'use server'` usan el cliente de Supabase para el servidor y llaman a `revalidatePath()` después de realizar escrituras.

**Clientes de Supabase:**
- `lib/supabase/client.ts` — Cliente del navegador (para componentes/hooks `'use client'`).
- `lib/supabase/server.ts` — Cliente del servidor (para Server Components y Server Actions).
- `lib/supabase/proxy.ts` — Utilizado exclusivamente en el middleware para la actualización de sesiones.

### Esquema de la Base de Datos

Las tablas principales incluyen: `profiles`, `monedas`, `ingresos`, `gastos`.
- **Row Level Security (RLS):** Todas las tablas aplican RLS, asegurando que los usuarios solo puedan acceder a sus propios datos.
- **Monedas (`monedas`):** Almacena las tasas de cambio personalizadas por usuario. El campo `precio` representa cuántas unidades de la moneda base equivalen a 1 unidad de esta moneda (por ejemplo, si la base es BS y 1 USD = 500 BS, entonces `precio = 500`).
- **Moneda Base:** Una moneda se designa como base (usando `is_base = true` en el perfil o una bandera similar — ver `scripts/005_add_base_currency.sql`).

## Guías de Desarrollo

### Añadir una Nueva Entidad

Para introducir una nueva entidad en la aplicación, sigue este flujo de trabajo estándar:

1. Añade una migración SQL en el directorio `scripts/` y ejecútala en el SQL Editor de Supabase.
2. Crea un hook SWR en `lib/hooks/`.
3. Crea server actions en `lib/actions/`.
4. Crea un componente de formulario en `components/forms/`.
5. Crea un componente de lista/visualización en `components/dashboard/`.
6. Añade las claves de traducción correspondientes tanto en `messages/es.json` como en `messages/en.json`.

### Componentes de UI

El proyecto utiliza shadcn/ui.
- Los componentes de UI se encuentran en `components/ui/`. **No los edites manualmente**; utiliza el CLI de shadcn cuando añadas o actualices componentes.
- Los componentes específicos del negocio están organizados en `components/dashboard/` y `components/forms/`.

### Especificaciones (Specs)

Para cambios complejos, refactorizaciones o nuevas características, genera una especificación de planificación (spec) antes de la implementación:
1. Crea un archivo spec en el directorio `specs/` usando la convención de nombres `[XX]_[nombre_del_spec].md` (por ejemplo, `00_refactor_entities.md`).
2. Define los cambios en el esquema de la base de datos, entidades, características o planes de arquitectura dentro del spec para cumplir con la solicitud.
3. Obtén aprobación sobre el spec antes de proceder con la implementación.

### Ejecución de Specs y Seguimiento de Estado

Para evitar la pérdida de contexto durante ejecuciones largas de specs a través de múltiples sesiones:
1. Crea un archivo de seguimiento de estado dentro de `.agents/spec_execution/status/` usando la convención de nombres `[XX]_[nombre_del_spec]_status.md`.
2. Desglosa el spec aprobado en una lista de tareas detallada con casillas de verificación (ej. `- [ ] Tarea 1`).
3. Organiza las tareas en fases lógicas (ej. Fase 1: Base de Datos, Fase 2: Capa de Datos, Fase 3: UI).
4. Actualiza el rastreador (cambiando `[ ]` a `[x]`) a medida que completas las tareas.
5. Si la sesión termina, en la nueva sesión instruye al agente para que apunte al archivo de estado y reanude el trabajo exactamente donde se dejó.
