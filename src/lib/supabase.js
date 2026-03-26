import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fkrkqifldssamfzobnko.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcmtxaWZsZHNzYW1mem9ibmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjg1MjksImV4cCI6MjA4OTgwNDUyOX0.QFrMQ8UKHynRvl18-sVlg-H47GbwTJbf-bpvCORX9kI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);