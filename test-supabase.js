// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vtlbqnevlbpetjbhjgon.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bGJxbmV2bGJwZXRqYmhqZ29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNTk0NzksImV4cCI6MjA2NDgzNTQ3OX0.ifZPL3sJa_KAOCSL8celS5klmSyXPHxYLUeZpeqcpjM";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test profiles table
    const { count: profilesCount, error: profilesError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (profilesError) {
      console.error('Profiles error:', profilesError);
      return;
    }
    
    console.log('✅ Profiles count:', profilesCount);
    
    // Test posts table
    const { count: postsCount, error: postsError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });
    
    if (postsError) {
      console.error('Posts error:', postsError);
      return;
    }
    
    console.log('✅ Posts count:', postsCount);
    
    // Test published posts
    const { count: publishedCount, error: publishedError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);
    
    if (publishedError) {
      console.error('Published posts error:', publishedError);
      return;
    }
    
    console.log('✅ Published posts count:', publishedCount);
    
    console.log('🎉 Supabase connection test successful!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
