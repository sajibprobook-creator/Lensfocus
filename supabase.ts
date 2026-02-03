
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nbjvmlkiiodfxixsvywm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ianZtbGtpaW9kZnhpeHN2eXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTQ0NTEsImV4cCI6MjA4NTYzMDQ1MX0.Ndt133x9XPByLqF3AHVuLHZjMOmhIWoqJ-Vw-MaceRc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'moment-chronicles-auth',
    flowType: 'pkce'
  }
});
