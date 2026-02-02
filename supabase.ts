
import { createClient } from '@supabase/supabase-js';

// NOTE: If GitHub Sync fails, it might be due to these hardcoded strings being flagged as "leaked secrets".
// In a production environment, these should be managed via environment variables.
const supabaseUrl = 'https://nbjvmlkiiodfxixsvywm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ianZtbGtpaW9kZnhpeHN2eXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTQ0NTEsImV4cCI6MjA4NTYzMDQ1MX0.Ndt133x9XPByLqF3AHVuLHZjMOmhIWoqJ-Vw-MaceRc';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
