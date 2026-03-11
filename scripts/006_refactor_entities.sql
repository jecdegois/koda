-- 1. Actualizar tabla profiles
ALTER TABLE public.profiles
RENAME COLUMN first_name TO full_name;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
DROP COLUMN IF EXISTS default_currency,
DROP COLUMN IF EXISTS preferred_exchange_rate_type,
DROP COLUMN IF EXISTS base_currency_id;

-- 2. Crear tabla configuracion
CREATE TABLE IF NOT EXISTS public.configuracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para configuracion
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- 3. Actualizar función del trigger de registro para reflejar los nuevos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'first_name', ''),
    new.email
  );
  
  -- Crear configuración por defecto
  INSERT INTO public.configuracion (user_id, config)
  VALUES (new.id, '{"theme": "system"}'::jsonb);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ajustar tablas gastos e ingresos para asegurar integridad referencial
-- Primero eliminamos la posible constraint anterior (si existe) y luego la creamos correctamente
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'gastos_moneda_id_fkey') THEN
    ALTER TABLE public.gastos DROP CONSTRAINT gastos_moneda_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'ingresos_moneda_id_fkey') THEN
    ALTER TABLE public.ingresos DROP CONSTRAINT ingresos_moneda_id_fkey;
  END IF;
END $$;

ALTER TABLE public.gastos
ADD CONSTRAINT gastos_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id) ON DELETE RESTRICT;

ALTER TABLE public.ingresos
ADD CONSTRAINT ingresos_moneda_id_fkey FOREIGN KEY (moneda_id) REFERENCES public.monedas(id) ON DELETE RESTRICT;

-- 5. Optimización de Políticas RLS y Mejoras de Rendimiento (Supabase Best Practices)
-- Borrar políticas viejas de perfiles (si existen)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Crear políticas optimizadas para profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (((SELECT auth.uid()) = id));

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (((SELECT auth.uid()) = id)) WITH CHECK (((SELECT auth.uid()) = id));

-- Políticas optimizadas para configuracion
CREATE POLICY "config_select_own" ON public.configuracion
  FOR SELECT USING (((SELECT auth.uid()) = user_id));

CREATE POLICY "config_insert_own" ON public.configuracion
  FOR INSERT WITH CHECK (((SELECT auth.uid()) = user_id));

CREATE POLICY "config_update_own" ON public.configuracion
  FOR UPDATE USING (((SELECT auth.uid()) = user_id)) WITH CHECK (((SELECT auth.uid()) = user_id));

CREATE POLICY "config_delete_own" ON public.configuracion
  FOR DELETE USING (((SELECT auth.uid()) = user_id));

-- Recrear políticas optimizadas para monedas, ingresos y gastos (reemplazando las creadas en 004)
DROP POLICY IF EXISTS "ingresos_select_own" ON public.ingresos;
DROP POLICY IF EXISTS "ingresos_insert_own" ON public.ingresos;
DROP POLICY IF EXISTS "ingresos_update_own" ON public.ingresos;
DROP POLICY IF EXISTS "ingresos_delete_own" ON public.ingresos;

CREATE POLICY "ingresos_select_own" ON public.ingresos FOR SELECT USING (((SELECT auth.uid()) = user_id));
CREATE POLICY "ingresos_insert_own" ON public.ingresos FOR INSERT WITH CHECK (((SELECT auth.uid()) = user_id));
CREATE POLICY "ingresos_update_own" ON public.ingresos FOR UPDATE USING (((SELECT auth.uid()) = user_id)) WITH CHECK (((SELECT auth.uid()) = user_id));
CREATE POLICY "ingresos_delete_own" ON public.ingresos FOR DELETE USING (((SELECT auth.uid()) = user_id));

DROP POLICY IF EXISTS "gastos_select_own" ON public.gastos;
DROP POLICY IF EXISTS "gastos_insert_own" ON public.gastos;
DROP POLICY IF EXISTS "gastos_update_own" ON public.gastos;
DROP POLICY IF EXISTS "gastos_delete_own" ON public.gastos;

CREATE POLICY "gastos_select_own" ON public.gastos FOR SELECT USING (((SELECT auth.uid()) = user_id));
CREATE POLICY "gastos_insert_own" ON public.gastos FOR INSERT WITH CHECK (((SELECT auth.uid()) = user_id));
CREATE POLICY "gastos_update_own" ON public.gastos FOR UPDATE USING (((SELECT auth.uid()) = user_id)) WITH CHECK (((SELECT auth.uid()) = user_id));
CREATE POLICY "gastos_delete_own" ON public.gastos FOR DELETE USING (((SELECT auth.uid()) = user_id));

DROP POLICY IF EXISTS "monedas_select_own" ON public.monedas;
DROP POLICY IF EXISTS "monedas_insert_own" ON public.monedas;
DROP POLICY IF EXISTS "monedas_update_own" ON public.monedas;
DROP POLICY IF EXISTS "monedas_delete_own" ON public.monedas;

CREATE POLICY "monedas_select_own" ON public.monedas FOR SELECT USING (((SELECT auth.uid()) = user_id));
CREATE POLICY "monedas_insert_own" ON public.monedas FOR INSERT WITH CHECK (((SELECT auth.uid()) = user_id));
CREATE POLICY "monedas_update_own" ON public.monedas FOR UPDATE USING (((SELECT auth.uid()) = user_id)) WITH CHECK (((SELECT auth.uid()) = user_id));
CREATE POLICY "monedas_delete_own" ON public.monedas FOR DELETE USING (((SELECT auth.uid()) = user_id));

-- 6. Índices para optimización de consultas
-- (Nota: idx_ingresos_user_id, idx_gastos_user_id y idx_monedas_user_id ya existían, pero verificamos/creamos los faltantes)
CREATE INDEX IF NOT EXISTS idx_configuracion_user_id ON public.configuracion(user_id);
CREATE INDEX IF NOT EXISTS idx_gastos_moneda_id ON public.gastos(moneda_id);
CREATE INDEX IF NOT EXISTS idx_ingresos_moneda_id ON public.ingresos(moneda_id);

-- GIN Index para JSONB (mejora radicalmente búsquedas de configuraciones específicas)
CREATE INDEX IF NOT EXISTS idx_configuracion_config_gin ON public.configuracion USING gin (config);