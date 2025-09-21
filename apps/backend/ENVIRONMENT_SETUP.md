# Backend Environment Setup

Create a `.env` file in the `apps/backend` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:54322/postgres"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
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

# CORS
FRONTEND_URL="http://localhost:3000"
```

## Environment Variables Explanation

### Database
- `DATABASE_URL`: PostgreSQL connection string for Prisma

### JWT Authentication
- `JWT_SECRET`: Secret key for signing JWT tokens (use a strong, unique secret in production)
- `JWT_EXPIRES_IN`: Token expiration time (e.g., "7d", "24h", "60m")

### Supabase Configuration
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous/public API key
- `SUPABASE_SERVICE_KEY`: Supabase service role key (for admin operations)

### Cloudinary (File Upload)
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Google Gemini AI
- `GEMINI_API_KEY`: Google Gemini API key for AI price suggestions

### Server Configuration
- `PORT`: Port number for the backend server (default: 3001)
- `NODE_ENV`: Environment mode ("development", "production", "test")
- `FRONTEND_URL`: Frontend application URL for CORS configuration

## Setup Instructions

1. Copy the environment variables above into a new `.env` file
2. Replace all placeholder values with your actual credentials
3. Make sure your database is running and accessible
4. Run `npx prisma migrate deploy` to set up the database schema
5. Run `npx prisma generate` to generate the Prisma client
6. Start the backend with `npm run start:dev`

## Security Notes

- Never commit the `.env` file to version control
- Use strong, unique secrets for JWT_SECRET in production
- Restrict database access to necessary IPs only
- Use environment-specific API keys for different deployment stages
