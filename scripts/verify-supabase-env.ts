import { createClient } from "@supabase/supabase-js";
import {
  printSupabaseEnvHelp,
  validateSupabaseEnv,
} from "./lib/validate-supabase-env";

async function main() {
  const validation = validateSupabaseEnv();

  if (!validation.ok) {
    console.error("Supabase env validation failed:\n");
    for (const error of validation.errors) {
      console.error(`- ${error}`);
    }
    printSupabaseEnvHelp();
    process.exit(1);
  }

  const supabase = createClient(validation.url!, validation.serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("site_settings").select("id").limit(1);

  if (error) {
    console.error("Supabase connection failed:", error.message);
    if (error.message.toLowerCase().includes("invalid api key")) {
      printSupabaseEnvHelp();
    } else if (error.message.includes("site_settings")) {
      console.error(
        "\nTables may not exist yet. Run supabase/migrations/001_initial_schema.sql in the Supabase SQL editor first.",
      );
    }
    process.exit(1);
  }

  console.log("Supabase env looks good and site_settings is reachable.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
