import { createClient } from '@supabase/supabase-js';

// Substitui pelos teus dados reais do projeto Supabase
// (Idealmente, num projeto real, isto viria de variáveis de ambiente .env)
const SUPABASE_URL = 'https://qrcsmtgswmlpcyivsquu.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyY3NtdGdzd21scGN5aXZzcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDQ2NzAsImV4cCI6MjA3Njg4MDY3MH0.p-mbE4UIOWTGsi_AEfg9dcvZUTJgPb8rAkDeB9hY0MI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);