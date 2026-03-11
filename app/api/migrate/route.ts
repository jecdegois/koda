import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST() {
  try {
    console.log("[v0] Starting database migration...");

    // Create monedas table
    const { error: monedasError } = await supabase.from("monedas").select("id").limit(1);
    
    if (monedasError?.code === "42P01") {
      console.log("[v0] Creating monedas table...");
      
      // Since we can't execute raw SQL via the client SDK in a simple way,
      // we'll need to use the Supabase SQL Editor or the API directly
      // For now, let's return a message instructing the user
      return NextResponse.json(
        {
          status: "manual_setup_required",
          message: "Please run the SQL migrations manually in your Supabase SQL Editor",
          steps: [
            "1. Go to your Supabase project",
            "2. Navigate to SQL Editor",
            "3. Run each script in scripts/ folder in order: 001, 002, 003, 004",
          ],
        },
        { status: 202 }
      );
    }

    return NextResponse.json({ status: "tables_exist", message: "Tables already created" });
  } catch (error) {
    console.error("[v0] Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed", details: error.message },
      { status: 500 }
    );
  }
}
