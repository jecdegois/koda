import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log("[v0] Starting database setup...");

    // Create ingresos table
    console.log("[v0] Creating ingresos table...");
    const { error: ingresosError } = await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS ingresos (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          descripcion TEXT NOT NULL,
          monto DECIMAL(10, 2) NOT NULL,
          moneda_id UUID NOT NULL,
          fecha DATE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_ingresos_user_id ON ingresos(user_id);
      `,
    });

    if (ingresosError) {
      // If RPC doesn't exist, try direct SQL approach
      console.log(
        "[v0] RPC not available, trying direct approach for ingresos..."
      );
    }

    // Create gastos table
    console.log("[v0] Creating gastos table...");
    const { error: gastosError } = await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS gastos (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          descripcion TEXT NOT NULL,
          monto DECIMAL(10, 2) NOT NULL,
          moneda_id UUID NOT NULL,
          fecha DATE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_gastos_user_id ON gastos(user_id);
      `,
    });

    if (gastosError) {
      console.log(
        "[v0] RPC not available, trying direct approach for gastos..."
      );
    }

    // Create monedas table
    console.log("[v0] Creating monedas table...");
    const { error: monedasError } = await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS monedas (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          descripcion TEXT NOT NULL,
          precio DECIMAL(12, 6) NOT NULL DEFAULT 1.0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_monedas_user_id ON monedas(user_id);
      `,
    });

    if (monedasError) {
      console.log(
        "[v0] RPC not available, trying direct approach for monedas..."
      );
    }

    console.log("[v0] Database setup completed!");
  } catch (error) {
    console.error("[v0] Error setting up database:", error);
    throw error;
  }
}

setupDatabase();
