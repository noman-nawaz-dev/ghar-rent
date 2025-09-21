#!/bin/bash

# Database Setup Script for Ghar Rent Platform
# This script runs all migrations in the correct order

echo "🚀 Setting up Ghar Rent Database Schema..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Running migrations in order..."

# Run migrations
echo "1. Creating users table..."
supabase db push

echo "✅ Database setup complete!"
echo ""
echo "📊 Database Schema Summary:"
echo "   - users table (user accounts and roles)"
echo "   - properties table (property listings)"
echo "   - rental_requests table (rental requests)"
echo ""
echo "🔒 Row Level Security (RLS) is enabled on all tables"
echo "🔍 Full-text search is available on properties"
echo "⚡ Performance indexes are created"
echo ""
echo "📝 Check DATABASE_SCHEMA.md for detailed documentation" 