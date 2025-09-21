# Ghar Rent - Property Rental Platform

A modern, full-stack property rental platform built with Next.js, NestJS, and PostgreSQL.

## 🏗️ Architecture

This is a monorepo containing:
- **Frontend**: Next.js application with TypeScript
- **Backend**: NestJS API with TypeScript
- **Shared**: Common types, DTOs, and utilities
- **Database**: PostgreSQL with Prisma ORM

## 📁 Project Structure

```
ghar-rent/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # NestJS API
├── packages/
│   └── shared/            # Shared types and utilities
├── supabase/              # Database migrations and config
└── package.json           # Root workspace configuration
```

## ✨ Features

### Core Features
- 🔐 **Authentication**: JWT-based auth with Supabase integration
- 👥 **User Management**: Role-based access (Admin, Seller, Buyer)
- 🏠 **Property Management**: CRUD operations with advanced search
- 📝 **Rental Requests**: Property booking and approval system
- 📸 **File Upload**: Image management with Cloudinary
- 🤖 **AI Price Suggestions**: Gemini AI-powered pricing
- 📊 **Dashboard**: Role-specific dashboards with analytics

### User Roles
- **Buyers**: Browse properties, make rental requests
- **Sellers**: List properties, manage rental requests
- **Admins**: Full system management and oversight

## 🛠️ Tech Stack

### Frontend
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Zustand for state management

### Backend
- NestJS with TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- Swagger API documentation
- Rate limiting and security

### External Services
- **Supabase**: Authentication and database hosting
- **Cloudinary**: Image storage and optimization
- **Google Gemini**: AI price suggestions
- **Geoapify**: Address autocomplete

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Supabase account
- Cloudinary account
- Google Gemini API key

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd ghar-rent
npm install
```

2. **Set up environment variables:**

**Backend** (`apps/backend/.env`):
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ghar_rent"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Server
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

**Frontend** (`apps/frontend/.env.local`):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Backend API
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

3. **Set up database:**
```bash
cd apps/backend
npx prisma migrate deploy
npx prisma generate
```

4. **Build shared package:**
```bash
cd packages/shared
npm run build
```

### Development

**Start all services:**
```bash
npm run dev
```

**Or start individually:**
```bash
# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend
```

### Production Build

```bash
npm run build
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs
- **API Base**: http://localhost:3001/api

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset

#### Properties
- `GET /api/properties` - List properties with filters
- `GET /api/properties/search` - Search properties
- `POST /api/properties` - Create property (sellers)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

#### Rental Requests
- `POST /api/rental-requests` - Create rental request (buyers)
- `GET /api/rental-requests/my-requests` - Buyer's requests
- `GET /api/rental-requests/my-property-requests` - Seller's requests
- `PUT /api/rental-requests/:id/approve` - Approve request
- `PUT /api/rental-requests/:id/reject` - Reject request

#### File Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image` - Delete image

#### AI Services
- `POST /api/ai/price-suggestion` - Get AI price suggestion

## 🗄️ Database Schema

### Main Tables
- **users** - User accounts and profiles
- **properties** - Property listings
- **rental_requests** - Property booking requests

### Key Features
- Row Level Security (RLS)
- Full-text search indexing  
- Automated triggers for status updates
- Comprehensive foreign key relationships

## 🔒 Security Features

- JWT-based authentication
- Role-based authorization
- Rate limiting (100 requests/minute)
- Input validation and sanitization
- SQL injection protection
- CORS configuration
- File upload validation

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Vercel, Railway, etc.)

### Frontend Deployment  
1. Update API endpoints in environment variables
2. Build the application
3. Deploy to Vercel, Netlify, or similar platform

## 🧪 Testing

```bash
# Run all tests
npm run test

# Frontend tests
npm run test -w apps/frontend

# Backend tests
npm run test -w apps/backend
```

## 📈 Monitoring & Analytics

- Error tracking and logging
- Performance monitoring
- User analytics
- API usage metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review API documentation at `/api/docs`

---

Built with ❤️ using modern web technologies
