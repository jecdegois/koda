# Estado de Ejecución: 00_refactor_entities.md

## Fases del Plan

- [x] **Fase 1: Migraciones SQL de Base de Datos**
  - [x] Crear el archivo `scripts/006_refactor_entities.sql`.
  - [x] Modificar tabla `profiles` (renombrar `first_name` a `full_name`, agregar `email`, `avatar_url`, eliminar `default_currency`, `preferred_exchange_rate_type`, `base_currency_id`).
  - [x] Crear tabla `configuracion` (id, user_id, config JSONB, timestamps) con índice GIN y políticas RLS optimizadas `((select auth.uid()) = user_id)`.
  - [x] Ajustar tabla `gastos` e `ingresos` (garantizar `FOREIGN KEY ... ON DELETE RESTRICT`).
  - [x] Actualizar/recrear políticas RLS (usando el patrón optimizado de Supabase con `(select auth.uid()) = user_id`) y crear índices B-Tree en columnas de RLS/FK.
  - [x] Actualizar el trigger `handle_new_user()` para insertar `full_name` y `email`.

- [x] **Fase 2: Capa de Datos (Hooks y Actions)**
  - [x] Actualizar tipos e interfaces en `lib/hooks/useProfile.ts`.
  - [x] Crear `lib/hooks/useConfig.ts` para obtener la configuración del usuario.
  - [x] Crear `lib/actions/config.ts` (Server Action) para actualizar la configuración.
  - [x] Refactorizar `lib/hooks/useCurrencyConversion.ts` para buscar `is_base === true`.
  - [x] Refactorizar `lib/actions/set-base-currency.ts` para actualizar `monedas` (establecer `is_base` false para todas, true para la seleccionada) en lugar de usar `profiles`.

- [x] **Fase 3: Ajustes UI y Autenticación**
  - [x] Refactorizar `app/[locale]/auth/sign-up/page.tsx` para usar "Full Name" (o "Nombre Completo") y pasarlo en el metadata.
  - [x] Refactorizar `components/dashboard/header.tsx` para usar `profile?.full_name`.
  - [x] Refactorizar `app/[locale]/dashboard/settings/page.tsx` para migrar configuraciones a `useConfig`.

## Registro de Eventos
* [x] **Inicio:** Spec creado y validado con Best Practices de Supabase (RLS y JSONB indexes). Carpetas de seguimiento creadas.
* [x] **Fase 1 Completada:** Script `006_refactor_entities.sql` generado con todas las instrucciones de migración, índices GIN y B-Tree optimizados, ajustes en foreign keys y reestructuración del trigger de creación de usuarios.
* [x] **Fase 2 Completada:** Creados hook y server action para la nueva tabla configuracion. Interfaces de TypeScript actualizadas para ajustarse a los nuevos campos y lógica de moneda base movida a la tabla monedas.
* [x] **Fase 3 Completada:** Componentes actualizados (`sign-up/page.tsx`, `header.tsx`, `settings/page.tsx`) para usar el nuevo estado `full_name` y la entidad de configuración. Compilación validada sin errores. Spec finalizado con éxito.