import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cjrkryplyxkvjdfywyqg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcmtyeXBseXhrdmpkZnl3eXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDEwMjYsImV4cCI6MjA5MDA3NzAyNn0.Qwa75a7iEAvOLzfFT90MxUtj1Aldrc2dggaqUYMHBPw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase URL:", supabaseUrl);
