-- Create ingresos table for simpler income tracking
CREATE TABLE IF NOT EXISTS public.ingresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  monto DECIMAL(15, 2) NOT NULL,
  moneda_id UUID NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gastos table for simpler expense tracking
CREATE TABLE IF NOT EXISTS public.gastos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  monto DECIMAL(15, 2) NOT NULL,
  moneda_id UUID NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monedas table for currency management
CREATE TABLE IF NOT EXISTS public.monedas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  precio DECIMAL(12, 6) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monedas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ingresos
CREATE POLICY "ingresos_select_own" ON public.ingresos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ingresos_insert_own" ON public.ingresos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ingresos_update_own" ON public.ingresos
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ingresos_delete_own" ON public.ingresos
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for gastos
CREATE POLICY "gastos_select_own" ON public.gastos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "gastos_insert_own" ON public.gastos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "gastos_update_own" ON public.gastos
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "gastos_delete_own" ON public.gastos
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for monedas
CREATE POLICY "monedas_select_own" ON public.monedas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "monedas_insert_own" ON public.monedas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monedas_update_own" ON public.monedas
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monedas_delete_own" ON public.monedas
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ingresos_user_id ON public.ingresos(user_id);
CREATE INDEX IF NOT EXISTS idx_ingresos_fecha ON public.ingresos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_user_id ON public.gastos(user_id);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON public.gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_monedas_user_id ON public.monedas(user_id);
