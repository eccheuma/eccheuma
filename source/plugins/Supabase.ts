
  import Vue from 'vue';
  import { createClient, SupabaseClient } from '@supabase/supabase-js';
  
  const SUPA_URL = 'https://unfruhyobjypfbvnncoc.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQyOTQ4MDE0LCJleHAiOjE5NTg1MjQwMTR9.vmYoNzgkXoN0tUr8_q8xbsBbqrOsA0Dy5_pRsOG4TN8';

  const Supabase: SupabaseClient = createClient(SUPA_URL, SUPA_KEY);

  Vue.prototype.$Supabase = Supabase;

  declare module 'vue/types/vue' {
    interface Vue {
      $Supabase: SupabaseClient
    }
  }

  export default Supabase;

