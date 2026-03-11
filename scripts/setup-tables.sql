-- Create ingresos table
CREATE TABLE IF NOT EXISTS ingresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  moneda_id UUID NOT NULL REFERENCES monedas(id) ON DELETE RESTRICT,
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gastos table
CREATE TABLE IF NOT EXISTS gastos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  moneda_id UUID NOT NULL REFERENCES monedas(id) ON DELETE RESTRICT,
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create monedas table
CREATE TABLE IF NOT EXISTS monedas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  precio DECIMAL(15, 6) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ingresos_user_id ON ingresos(user_id);
CREATE INDEX IF NOT EXISTS idx_ingresos_fecha ON ingresos(fecha);
CREATE INDEX IF NOT EXISTS idx_ingresos_moneda_id ON ingresos(moneda_id);

CREATE INDEX IF NOT EXISTS idx_gastos_user_id ON gastos(user_id);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_moneda_id ON gastos(moneda_id);

CREATE INDEX IF NOT EXISTS idx_monedas_user_id ON monedas(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE monedas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ingresos
CREATE POLICY "Users can only view their own ingresos" ON ingresos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingresos" ON ingresos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingresos" ON ingresos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingresos" ON ingresos
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for gastos
CREATE POLICY "Users can only view their own gastos" ON gastos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gastos" ON gastos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gastos" ON gastos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gastos" ON gastos
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for monedas
CREATE POLICY "Users can only view their own monedas" ON monedas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monedas" ON monedas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monedas" ON monedas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monedas" ON monedas
  FOR DELETE USING (auth.uid() = user_id);
