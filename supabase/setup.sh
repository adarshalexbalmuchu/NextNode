#!/bin/bash

# Database Setup Script for Quantum Read Flow
# This script applies the necessary database migrations for the authentication system

echo "🚀 Setting up Quantum Read Flow Database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g @supabase/cli"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ No Supabase project found. Please run 'supabase init' first."
    exit 1
fi

echo "📁 Applying database migrations..."

# Apply migrations in order
echo "  ⏳ Applying initial setup (RLS policies, triggers)..."
supabase db push --include-all

if [ $? -eq 0 ]; then
    echo "  ✅ Database setup completed successfully!"
    echo ""
    echo "🎉 Your authentication system is now ready with:"
    echo "   • Automatic profile creation on signup"
    echo "   • Row-level security policies"
    echo "   • Role-based access control"
    echo "   • Database functions for user management"
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Start your development server: npm run dev"
    echo "   2. Test user registration and login"
    echo "   3. Verify role-based access control"
    echo "   4. Check admin dashboard functionality"
else
    echo "❌ Failed to apply migrations. Please check the error messages above."
    exit 1
fi
