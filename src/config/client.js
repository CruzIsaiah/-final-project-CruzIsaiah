import { createClient } from '@supabase/supabase-js';

const URL = 'https://fxjdschvqggrbebbehcz.supabase.co';
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4amRzY2h2cWdncmJlYmJlaGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzOTMwMjMsImV4cCI6MjAyODk2OTAyM30.s2rGs5tMWw0sEcftTFwss3cvVe0rcj1Mzc5tKk3vSL0"
export const supabase = createClient(URL, API_KEY);
