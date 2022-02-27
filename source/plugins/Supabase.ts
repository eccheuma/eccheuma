
import { createClient, SupabaseClient } from '@supabase/supabase-js';
  
const SUPA_URL = process.env.SUPABASE_API_URL;
const SUPA_KEY = process.env.SUPABASE_API_KEY;

if ( !SUPA_URL || !SUPA_KEY ) throw new Error('ENV ERROR')

const Supabase: SupabaseClient = createClient(SUPA_URL, SUPA_KEY);

export default Supabase;
