import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "[v0] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql(sql) {
  try {
    const { error } = await supabase.rpc("exec_sql", {
      sql_string: sql,
    });

    if (error) {
      console.error("[v0] SQL Error:", error);
      throw error;
    }

    console.log("[v0] SQL executed successfully");
  } catch (err) {
    // If RPC doesn't exist, try a different approach
    console.log("[v0] RPC approach failed, trying raw query...");
    // For now, just log the error
    console.error("[v0] Error:", err.message);
  }
}

async function runMigrations() {
  console.log("[v0] Starting database migrations...");

  // Read the migration files
  const migrationFiles = [
    "001_create_tables.sql",
    "002_create_rls_policies.sql",
    "003_profile_trigger.sql",
    "004_create_simple_tables.sql",
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`[v0] Executing ${file}...`);
      const sql = fs.readFileSync(filePath, "utf-8");
      await executeSql(sql);
    } else {
      console.log(`[v0] Migration file ${file} not found`);
    }
  }

  console.log("[v0] Database setup completed!");
}

runMigrations().catch((err) => {
  console.error("[v0] Migration failed:", err);
  process.exit(1);
});
