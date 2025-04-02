import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nxkreheabczqsutrzafn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54a3JlaGVhYmN6cXN1dHJ6YWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTExMjMsImV4cCI6MjA1OTEyNzEyM30.RSsT4fo5HN8tppFNdlZB4ss1ocjBqj07faRE75SBJyM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
