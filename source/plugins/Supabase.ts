
import { Context } from '@nuxt/types'

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseStorageClient } from '@supabase/storage-js'

declare global {
  var supabase: {
    storage: SupabaseStorageClient
  };
}
 
export default ({ env }: Context) => {

  global.supabase = Object();

  const SUPA_URL = env.SUPABASE_API_URL;
  const SUPA_KEY = env.SUPABASE_API_KEY;
  
  if ( !SUPA_URL || !SUPA_KEY ) throw new Error('Environment is undefined or null');

  const { storage }: SupabaseClient = createClient(SUPA_URL, SUPA_KEY);
  
  global.supabase.storage = storage;
 
}