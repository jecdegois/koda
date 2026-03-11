# Database Setup Instructions

## El problema

La aplicación requiere que se creen las siguientes tablas en tu base de datos Supabase:
- `ingresos` - Para registrar ingresos
- `gastos` - Para registrar gastos  
- `monedas` - Para gestionar monedas/tipos de cambio

## Solución

### Paso 1: Accede a Supabase SQL Editor

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Haz clic en "SQL Editor" en la barra lateral izquierda

### Paso 2: Ejecuta las migraciones en orden

Ejecuta los siguientes scripts SQL **en este orden exacto**:

#### Script 1: Crear tablas base (001_create_tables.sql)
```sql
-- Copia el contenido de scripts/001_create_tables.sql
-- Pégalo aquí en el SQL Editor
-- Haz clic en "Run"
```

#### Script 2: Crear políticas RLS (002_create_rls_policies.sql)
```sql
-- Copia el contenido de scripts/002_create_rls_policies.sql
-- Pégalo aquí en el SQL Editor
-- Haz clic en "Run"
```

#### Script 3: Crear triggers de perfil (003_profile_trigger.sql)
```sql
-- Copia el contenido de scripts/003_profile_trigger.sql
-- Pégalo aquí en el SQL Editor
-- Haz clic en "Run"
```

#### Script 4: Crear tablas simples (004_create_simple_tables.sql)
```sql
-- Copia el contenido de scripts/004_create_simple_tables.sql
-- Pégalo aquí en el SQL Editor
-- Haz clic en "Run"
```

#### Script 5: Configurar moneda base (005_add_base_currency.sql)
```sql
-- Copia el contenido de scripts/005_add_base_currency.sql
-- Pégalo aquí en el SQL Editor
-- Haz clic en "Run"
```

### Paso 3: Configura tu moneda base

**IMPORTANTE:** El sistema requiere una moneda base para funcionar correctamente.

#### Ejemplo: Configurar BS (Bolívares) como moneda base

1. Ingresa a la aplicación
2. Ve al dashboard
3. Crea una moneda llamada "BS" (o tu moneda base)
4. Establécela como moneda base con el botón "Usar como Base"

#### Entender las tasas de cambio

El campo `precio` en cada moneda representa: **Cuántas unidades de la moneda base equivalen a 1 unidad de esa moneda**

**Ejemplo:**
- Moneda base: BS (Bolívares)
- Moneda secundaria: USD (Dólares)
- Tasa de cambio: 1 USD = 500 BS
- Entonces: El `precio` del USD debe ser `500`

**Cálculos:**
- Si tienes 1 USD y la base es BS: `1 * 500 = 500 BS`
- Si tienes 1000 BS y quieres convertir a USD: `1000 / 500 = 2 USD`

### Paso 4: Verifica que todo funciona

Recarga la página de la aplicación. Si todo está correcto:
- Desaparecerá el mensaje de error
- Podrás crear ingresos, gastos y monedas
- Los datos se guardarán automáticamente en la BD
- Los cálculos se mostrarán en tu moneda base

## ¿Qué hacen los scripts?

- **001_create_tables.sql**: Crea las tablas principales (profiles, accounts, transactions, etc.)
- **002_create_rls_policies.sql**: Añade seguridad Row Level Security para que solo veas tus datos
- **003_profile_trigger.sql**: Crea un trigger para crear automáticamente perfiles al registrarse
- **004_create_simple_tables.sql**: Crea las tablas específicas para ingresos, gastos y monedas
- **005_add_base_currency.sql**: Añade campos para configurar la moneda base

## ¿Necesitas ayuda?

Si tienes problemas:
1. Verifica que copiaste el SQL completo
2. Asegúrate de ejecutarlos en el orden correcto
3. No ignores los errores - si aparece alguno, lee el mensaje y revisa la sintaxis
4. Si falta crear alguna tabla, el script te lo indicará cuando intentes guardar datos

## Conexión desde Vercel (si la desplegaste)

Los env vars ya están configurados automáticamente en tu proyecto. Solo necesitas ejecutar los scripts SQL una vez en Supabase.

