
import { Context } from "@nuxt/types";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

declare global {
  var supabase: {
    storage: SupabaseClient["storage"];
  };
}

export default (context?: Context) => {

  global.supabase = Object();

  const SUPA_URL = context?.env.SUPABASE_API_URL || process.env.SUPABASE_API_URL;
  const SUPA_KEY = context?.env.SUPABASE_API_KEY || process.env.SUPABASE_API_KEY;

  if (!SUPA_URL || !SUPA_KEY) throw new Error("Environment is undefined or null");

  const { storage } = createClient(SUPA_URL, SUPA_KEY);

  global.supabase.storage = storage;

};