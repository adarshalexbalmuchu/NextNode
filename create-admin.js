// Simple script to create an admin user for testing
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkzzfvdmbswvfkhkdguk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrenpmdmRtYnN3dmZraGtkZ3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NDA1NDQsImV4cCI6MjA0OTIxNjU0NH0.6BN0Q-OOSlCO7cJHhb4LfgfGBLOSdiqKKxHALWqCtQ4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestAdmin() {
  try {
    console.log('Creating test admin user...')
    
    // First, create an auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@test.com',
      password: 'admin123',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return
    }

    console.log('Auth user created:', authData.user?.id)

    // Wait a moment for profile creation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@test.com')
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return
    }

    console.log('Profile found:', profile.id)

    // Make the user admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: profile.id,
        role: 'admin'
      })

    if (roleError) {
      console.error('Role error:', roleError)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@test.com')
    console.log('Password: admin123')

  } catch (error) {
    console.error('Error:', error)
  }
}

createTestAdmin()
