import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gquxcmuosnranvjrwtif.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdXhjbXVvc25yYW52anJ3dGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MjI5NjksImV4cCI6MjA2NjQ5ODk2OX0.t-ukvPbq254mKIgKvu2ufgCumd1TGA6e7w3o0xwI0cw'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})