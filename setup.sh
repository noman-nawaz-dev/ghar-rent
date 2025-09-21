#!/bin/bash

# Ghar Rent Monorepo Setup Script

echo "🏠 Setting up Ghar Rent Monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

print_status "npm version $(npm -v) detected"

# Install root dependencies
print_info "Installing root dependencies..."
if npm install; then
    print_status "Root dependencies installed"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

# Build shared package
print_info "Building shared package..."
cd packages/shared
if npm install && npm run build; then
    print_status "Shared package built successfully"
    cd ../..
else
    print_error "Failed to build shared package"
    exit 1
fi

# Check if .env files exist
print_info "Checking environment configuration..."

BACKEND_ENV_EXISTS=false
FRONTEND_ENV_EXISTS=false

if [ -f "apps/backend/.env" ]; then
    BACKEND_ENV_EXISTS=true
    print_status "Backend .env file found"
else
    print_warning "Backend .env file not found"
fi

if [ -f "apps/frontend/.env.local" ]; then
    FRONTEND_ENV_EXISTS=true
    print_status "Frontend .env.local file found"
else
    print_warning "Frontend .env.local file not found"
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
cd apps/backend
if npm install; then
    print_status "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Check if database is configured
if [ "$BACKEND_ENV_EXISTS" = true ]; then
    print_info "Generating Prisma client..."
    if npx prisma generate; then
        print_status "Prisma client generated"
        
        print_info "Checking database connection..."
        if npx prisma db push --accept-data-loss; then
            print_status "Database schema deployed"
        else
            print_warning "Could not deploy database schema. Please check your DATABASE_URL in .env"
        fi
    else
        print_error "Failed to generate Prisma client"
        exit 1
    fi
else
    print_warning "Skipping database setup - no .env file found"
fi

cd ../..

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd apps/frontend
if npm install; then
    print_status "Frontend dependencies installed"
    cd ../..
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Setup complete
echo
echo "🎉 Setup complete!"
echo
echo "📋 Next steps:"
echo

if [ "$BACKEND_ENV_EXISTS" = false ]; then
    echo "1. Create apps/backend/.env file with your configuration"
    echo "   (See apps/backend/ENVIRONMENT_SETUP.md for details)"
fi

if [ "$FRONTEND_ENV_EXISTS" = false ]; then
    echo "2. Create apps/frontend/.env.local file with your configuration"
fi

echo "3. Start the development servers:"
echo "   npm run dev                 # Start both frontend and backend"
echo "   npm run dev:frontend        # Start frontend only"
echo "   npm run dev:backend         # Start backend only"
echo
echo "4. Visit the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001/api"
echo "   API Documentation: http://localhost:3001/api/docs"
echo
echo "📚 For more information, see README.md"
echo
print_status "Happy coding! 🚀"
