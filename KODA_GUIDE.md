# Koda - Gestor de Finanzas Personales

Una aplicación simplificada y moderna de gestión de finanzas personales construida con Next.js 16, Supabase, React y Tailwind CSS.

## Características

### Autenticación Segura
- Autenticación con email/contraseña mediante Supabase
- Creación automática de perfil al registrarse
- Gestión de sesiones segura con cookies HTTP-only
- Rutas protegidas con redirecciones automáticas

### Funcionalidad Principal
- **Dashboard**: Visualización de ingresos, gastos y balance total
- **Monedas Personalizadas**: Cada usuario crea sus propias monedas con tasas de cambio
- **Ingresos**: Registra ingresos con descripción, monto, moneda y fecha
- **Gastos**: Registra gastos con descripción, monto, moneda y fecha
- **Configuración**: Administra tus monedas personalizadas

### Componentes Clave
- **Resumen de Balance**: Tarjetas mostrando totales de ingresos, gastos y balance
- **Formas Rápidas**: Agregar ingresos, gastos y monedas directamente en el dashboard
- **Listas en Tiempo Real**: Ver todos tus registros con opción de eliminar
- **Diseño Responsivo**: Funciona perfectamente en móvil, tablet y desktop

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19.2, TypeScript
- **Estilos**: Tailwind CSS 4.2, componentes shadcn/ui
- **Base de Datos**: Supabase PostgreSQL con Row Level Security
- **Obtención de Datos**: SWR para caching y sincronización del lado del cliente
- **Autenticación**: Supabase Auth
- **Iconos**: Lucide React
- **Validación**: Zod para esquemas de datos

## Estructura del Proyecto

```
app/
├── auth/                          # Páginas de autenticación
│   ├── login/
│   ├── sign-up/
│   ├── sign-up-success/
│   └── error/
├── dashboard/                     # Rutas protegidas del dashboard
│   ├── layout.tsx                 # Layout del dashboard con sidebar
│   ├── page.tsx                   # Dashboard principal
│   └── settings/                  # Configuración de usuario
├── api/                           # Rutas API
└── page.tsx                       # Redirección raíz

components/
├── dashboard/
│   ├── sidebar.tsx                # Barra lateral de navegación
│   ├── header.tsx                 # Encabezado del dashboard
│   ├── ingresos-list.tsx          # Listado de ingresos
│   ├── gastos-list.tsx            # Listado de gastos
│   └── monedas-list.tsx           # Listado de monedas
├── forms/
│   ├── add-ingreso-form.tsx       # Formulario para agregar ingresos
│   ├── add-gasto-form.tsx         # Formulario para agregar gastos
│   └── add-moneda-form.tsx        # Formulario para agregar monedas
└── ui/                            # Componentes shadcn/ui

lib/
├── supabase/
│   ├── client.ts                  # Cliente del navegador
│   ├── server.ts                  # Cliente del servidor
│   └── proxy.ts                   # Proxy de middleware
├── hooks/
│   ├── useMonedas.ts              # Hook para monedas
│   ├── useIngresos.ts             # Hook para ingresos
│   ├── useGastos.ts               # Hook para gastos
│   └── useProfile.ts              # Hook para perfil del usuario
└── utils/
    └── currency.ts                # Utilidades de moneda
```

## Esquema de Base de Datos

### Tablas Principales

#### monedas (Monedas)
```sql
- id: UUID (clave primaria)
- user_id: UUID (referencia al usuario)
- descripcion: TEXT (nombre de la moneda)
- precio: DECIMAL (tasa de cambio)
- created_at / updated_at: TIMESTAMPS
```

#### ingresos (Ingresos)
```sql
- id: UUID (clave primaria)
- user_id: UUID (referencia al usuario)
- descripcion: TEXT (descripción del ingreso)
- monto: DECIMAL (cantidad)
- moneda_id: UUID (referencia a moneda)
- fecha: DATE (fecha del ingreso)
- created_at / updated_at: TIMESTAMPS
```

#### gastos (Gastos)
```sql
- id: UUID (clave primaria)
- user_id: UUID (referencia al usuario)
- descripcion: TEXT (descripción del gasto)
- monto: DECIMAL (cantidad)
- moneda_id: UUID (referencia a moneda)
- fecha: DATE (fecha del gasto)
- created_at / updated_at: TIMESTAMPS
```

Todas las tablas incluyen políticas Row Level Security (RLS) para asegurar que cada usuario solo acceda a sus propios datos.

## Comenzar

### Requisitos Previos
- Node.js 18+
- pnpm (gestor de paquetes)
- Proyecto de Supabase con autenticación habilitada

### Instalación

1. Clona el repositorio e instala las dependencias:
```bash
pnpm install
```

2. Configura las variables de entorno en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_supabase
```

3. Ejecuta las migraciones de la base de datos usando el editor SQL de Supabase con los scripts en la carpeta `/scripts`

4. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Flujo de Autenticación

1. El usuario visita la app → se redirige al login si no está autenticado
2. Registro con email, contraseña, nombre y apellido
3. Los metadatos del usuario se almacenan en la autenticación de Supabase
4. Un trigger de base de datos crea automáticamente una entrada de perfil
5. El usuario puede acceder al dashboard después de confirmar su email
6. El layout del dashboard autentica al usuario en cada sesión

## Gestión de Datos

### Caching del Lado del Cliente (SWR)
- Todos los hooks de datos usan SWR para caching eficiente
- Revalidación automática al enfocar la ventana
- Intervalo de deduplicación de 60 segundos
- Triggers de mutación manual en crear/actualizar/eliminar

### Actualizaciones en Tiempo Real
- Los formularios disparan `mutate()` después de operaciones exitosas
- Los datos se reflejan automáticamente en la UI
- Las actualizaciones optimistas se pueden agregar si es necesario

## Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ Supabase Auth for authentication
- ✅ HTTP-only cookies for sessions
- ✅ Input validation with Zod
- ✅ Protected routes with auth checks
- ✅ Parameterized queries (via Supabase)

## Personalización

### Agregar Nueva Moneda
1. Ve a Configuración → Nueva Moneda
2. Ingresa el nombre (ej: "Dólar Americano")
3. Ingresa la tasa de cambio (ej: 1.0, 850.5)
4. Guarda

Las monedas son personalizadas por usuario, cada uno crea las suyas propias.

### Cambiar Colores y Estilos
- Colores primarios en `/app/globals.css`
- Estilos de componentes en `/components/ui/`
- Estilos específicos del dashboard en la capa de globals.css

### Agregar Nueva Entidad
1. Crea la tabla en Supabase
2. Crea políticas RLS
3. Crea un hook personalizado en `lib/hooks/`
4. Crea un formulario en `components/forms/`
5. Crea un componente de listado en `components/dashboard/`

## Rutas API

### GET `/api/summary`
Retorna un resumen financiero para el usuario autenticado:
```json
{
  "totalIngresos": 5000,
  "totalGastos": 2000,
  "balance": 3000,
  "ingresosCount": 10,
  "gastosCount": 15
}
```

## Performance Optimization

- ✅ Server-side rendering where possible
- ✅ Client-side caching with SWR
- ✅ Lazy loading of components
- ✅ Database indexing on frequently queried fields
- ✅ Responsive image optimization

## Mejoras Futuras

- Exportar ingresos/gastos a CSV
- Reportes y estados PDF
- Gráficos de ingresos vs gastos
- Recordatorios de gastos recurrentes
- Análisis por categoría
- Conversión de monedas en tiempo real
- Panel de análisis e insights
- Soporte para múltiples idiomas
- Aplicación móvil

## Despliegue

### Vercel (Recomendado)
1. Sube el código a GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno
4. Despliega con un clic

### Otras Plataformas
- Asegúrate de que soporte Node.js 18+
- Configura las variables de entorno
- Configura CORS para Supabase
- Base de datos: Usa PostgreSQL alojado en Supabase

## Preguntas Frecuentes

**P: ¿Puedo usar múltiples monedas?**
R: Sí, crea tantas monedas como necesites en Configuración → Nueva Moneda

**P: ¿Los datos se sincronizan en tiempo real?**
R: Sí, usamos SWR para sincronización automática. Los cambios se reflejan al instante.

**P: ¿Puedo exportar mis datos?**
R: Esta funcionalidad está en la lista de mejoras futuras.

**P: ¿Es seguro compartir mi contraseña?**
R: Nuestras contraseñas se manejan directamente con Supabase usando bcrypt. Nunca compartimos contraseñas.

## Soporte

Para reportar problemas o sugerencias, crea un issue en el repositorio.

## Licencia

MIT License - Siéntete libre de usar este proyecto como plantilla para tus propias aplicaciones.
