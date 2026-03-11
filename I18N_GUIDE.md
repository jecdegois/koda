# Koda - Internacionalización (i18n) Implementada

La aplicación Koda ahora soporta dos idiomas: **Español** (es) e **Inglés** (en).

## Características de Internacionalización

### Cambio de Idioma
- **Selector en la Barra Lateral**: Los usuarios pueden cambiar el idioma fácilmente desde el icono de globo en la sidebar
- **Persistencia de Ruta**: Al cambiar de idioma, la ruta se actualiza automáticamente (ej: `/es/dashboard` → `/en/dashboard`)
- **Idioma Predeterminado**: El idioma predeterminado es **Español** (es)

### Archivos de Traducción
- `messages/es.json` - Traducción al español
- `messages/en.json` - Traducción al inglés

### Componentes Traducidos
- ✅ Páginas de autenticación (login, signup)
- ✅ Dashboard principal
- ✅ Formularios (ingresos, gastos, monedas)
- ✅ Componentes de listado
- ✅ Barra lateral de navegación
- ✅ Página de configuración
- ✅ Todos los mensajes y etiquetas

### Tecnología Utilizada
- **next-intl**: Framework de internacionalización para Next.js
- **Middleware**: Detección automática y redirección de locale
- **useTranslations()**: Hook para acceder a las traducciones en componentes

## Cómo Agregar Nuevas Traducciones

1. Abre `messages/es.json` y `messages/en.json`
2. Agrega la nueva clave en ambos archivos:

```json
// messages/es.json
{
  "nuevaSeccion": {
    "nuevaClaves": "Nuevo texto en español"
  }
}

// messages/en.json
{
  "nuevaSeccion": {
    "nuevaClaves": "New text in English"
  }
}
```

3. En tu componente, importa y usa:

```tsx
import { useTranslations } from 'next-intl'

export function MiComponente() {
  const t = useTranslations()
  return <p>{t('nuevaSeccion.nuevaClaves')}</p>
}
```

## Estructura de Rutas

Todas las rutas ahora incluyen el locale en la URL:

- `/es/` - Página de inicio en español
- `/en/` - Página de inicio en inglés
- `/es/auth/login` - Login en español
- `/en/auth/login` - Login en inglés
- `/es/dashboard` - Dashboard en español
- `/en/dashboard` - Dashboard en inglés

## Notas Importantes

- El middleware automáticamente detecta el locale preferido del usuario
- Si el usuario accede a `/` sin locale, se redirige al locale predeterminado (español)
- El cambio de idioma es instantáneo sin necesidad de recargar la página
- Las fechas se formatean automáticamente en el idioma seleccionado

## Próximos Pasos

- Agregar más idiomas (francés, portugués, etc.)
- Implementar detección automática del idioma del navegador
- Agregar selector de idioma en la página de login
