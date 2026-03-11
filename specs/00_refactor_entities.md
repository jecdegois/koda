# Spec: Refactorización de Entidades (Koda App)

Este documento define la estructura de base de datos y entidades para la aplicación de finanzas Koda, orientada al manejo multi-moneda de ingresos y gastos por usuario.

## Entidades Principales

### 1. Profiles (Perfiles de Usuario)
Almacena la información extendida del usuario logueado vía Supabase Auth.
- `id` (UUID, Primary Key, Foreign Key -> `auth.users.id`, Delete Cascade)
- `full_name` (TEXT): Nombre completo.
- `last_name` (TEXT): Apellido.
- `avatar_url` (TEXT, Opcional): URL de la foto de perfil.
- `email` (TEXT, Opcional): Correo electrónico del usuario (para evitar joins constantes con `auth.users`).
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. Monedas (Currencies)
Monedas personalizadas o predeterminadas manejadas por el usuario.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `auth.users.id`, Delete Cascade) - Requerido para RLS.
- `descripcion` (TEXT): Nombre o símbolo (ej. "USD", "BS").
- `precio` (DECIMAL): Factor de conversión respecto a la moneda base (Cuántas unidades de la moneda base equivalen a 1 unidad de esta moneda).
- `is_base` (BOOLEAN): Indica si es la moneda base del usuario.
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 3. Gastos (Expenses)
Registro de egresos.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `auth.users.id`, Delete Cascade) - Requerido para RLS.
- `fecha` (DATE): Fecha en la que ocurrió el gasto.
- `descripcion` (TEXT): Motivo o concepto del gasto.
- `monto` (DECIMAL): Cantidad gastada en la moneda especificada.
- `moneda_id` (UUID, Foreign Key -> `monedas.id`, Restrict/Set Null) - Moneda en la que se realizó el gasto.
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 4. Ingresos (Incomes)
Registro de ingresos.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `auth.users.id`, Delete Cascade) - Requerido para RLS.
- `fecha` (DATE): Fecha en la que ocurrió el ingreso.
- `descripcion` (TEXT): Concepto u origen del ingreso.
- `monto` (DECIMAL): Cantidad ingresada en la moneda especificada.
- `moneda_id` (UUID, Foreign Key -> `monedas.id`, Restrict/Set Null) - Moneda en la que se recibió el ingreso.
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 5. Configuracion (Settings)
Preferencias y configuraciones de la aplicación por usuario.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `auth.users.id`, UNIQUE, Delete Cascade) - Relación 1:1 con el usuario.
- `config` (JSONB): Objeto JSON que almacena de forma flexible configuraciones dinámicas (ej: modo oscuro, límites del dashboard, idioma preferido).
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Reglas Generales de Base de Datos
1. **Row Level Security (RLS)**: Todas las tablas (`profiles`, `monedas`, `gastos`, `ingresos`, `configuracion`) deben tener RLS habilitado.
2. **Políticas**: Los usuarios solo deben poder hacer `SELECT`, `INSERT`, `UPDATE` y `DELETE` sobre las filas donde `user_id = auth.uid()`.