# Database Schema Documentation

## Overview
Complete database schema for the Ghar Rent rental platform with 3 main tables, RLS policies, and functions.

## Tables

### 1. Users Table
```sql
users (
  id uuid primary key references auth.users(id),
  name text not null,
  email text unique not null,
  phone text,
  role user_role not null default 'buyer',
  created_at timestamp with time zone default now()
)
```

### 2. Properties Table
```sql
properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price integer not null check (price > 0),
  area numeric not null check (area > 0),
  area_unit area_unit not null,
  bedrooms integer not null check (bedrooms >= 0),
  floors integer not null check (floors >= 0),
  kitchens integer not null check (kitchens >= 0),
  has_lawn boolean not null default false,
  additional_info text,
  address text not null,
  city text not null,
  images text[] not null default '{}',
  seller_id uuid not null references users(id),
  seller_phone text not null,
  seller_name text not null,
  listed_date date not null default current_date,
  status property_status not null default 'Available',
  property_type text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

### 3. Rental Requests Table
```sql
rental_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id),
  buyer_id uuid not null references users(id),
  proposed_price integer not null check (proposed_price > 0),
  duration integer not null check (duration > 0),
  message text,
  status request_status not null default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
)
```

## Enums
- `user_role`: 'seller' | 'buyer' | 'admin'
- `property_status`: 'Available' | 'Pending' | 'Rented'
- `request_status`: 'pending' | 'approved' | 'rejected'
- `area_unit`: 'Marla' | 'Kanal'

## Key Features
- Row Level Security (RLS) policies for data protection
- Automatic triggers for status updates and timestamps
- Full-text search capabilities
- Comprehensive indexing for performance
- Type-safe TypeScript definitions

## Relationships

1. **users** → **properties** (1:N)
   - A user can have multiple properties
   - Foreign key: `properties.seller_id` references `users.id`

2. **users** → **rental_requests** (1:N)
   - A user can make multiple rental requests
   - Foreign key: `rental_requests.buyer_id` references `users.id`

3. **properties** → **rental_requests** (1:N)
   - A property can have multiple rental requests
   - Foreign key: `rental_requests.property_id` references `properties.id`

4. **users** → **price_suggestions** (1:N)
   - A user can generate multiple price suggestions
   - Foreign key: `price_suggestions.user_id` references `users.id`

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Users Table
- Users can view, update, and insert their own profile
- Admins can view all user data

### Properties Table
- Anyone can view available properties
- Users can view, update, insert, and delete their own properties
- Admins can view all properties

### Rental Requests Table
- Buyers can view and insert their own requests
- Sellers can view and update requests for their properties
- Admins can view all rental requests

### Price Suggestions Table
- Users can view and insert their own price suggestions
- Admins can view all price suggestions

## Functions and Triggers

### Triggers

1. **update_updated_at_column()**
   - Automatically updates the `updated_at` timestamp when records are modified
   - Applied to `properties` and `rental_requests` tables

2. **update_property_status_on_approval()**
   - Automatically changes property status to 'Rented' when a rental request is approved

3. **prevent_multiple_approved_requests()**
   - Prevents multiple approved requests for the same property

### Functions

1. **get_property_stats(user_id)**
   - Returns statistics for a seller's properties
   - Returns: total_properties, available_properties, rented_properties, pending_requests

2. **get_buyer_stats(user_id)**
   - Returns statistics for a buyer's rental requests
   - Returns: total_requests, pending_requests, approved_requests, rejected_requests

3. **search_properties(search_term, city_filter, min_price, max_price, property_type_filter, min_bedrooms, has_lawn_filter)**
   - Advanced property search with multiple filters
   - Supports full-text search and various property criteria

## Constraints

### Check Constraints
- Property prices must be positive
- Property areas must be positive
- Bedrooms, floors, and kitchens must be non-negative
- Rental request prices and durations must be positive

### Unique Constraints
- User emails must be unique
- Only one pending rental request per buyer per property

### Foreign Key Constraints
- All foreign key relationships are properly defined with cascade delete where appropriate

## Usage Examples

### Creating a Property
```sql
INSERT INTO properties (
  title, description, price, area, area_unit, bedrooms, 
  floors, kitchens, has_lawn, address, city, images, 
  seller_id, seller_phone, seller_name, property_type
) VALUES (
  'Modern Apartment', 'Beautiful 2-bedroom apartment', 
  50000, 8, 'Marla', 2, 1, 1, false, 
  'DHA Phase 5', 'Lahore', 
  ARRAY['image1.jpg', 'image2.jpg'],
  'user-uuid', '+92 300 1234567', 'John Doe', 'Apartment'
);
```

### Creating a Rental Request
```sql
INSERT INTO rental_requests (
  property_id, buyer_id, proposed_price, duration, message
) VALUES (
  'property-uuid', 'buyer-uuid', 48000, 12, 
  'I am interested in renting this property'
);
```

### Searching Properties
```sql
SELECT * FROM search_properties(
  search_term := 'modern apartment',
  city_filter := 'Lahore',
  min_price := 40000,
  max_price := 60000,
  min_bedrooms := 2
);
```

### Getting User Statistics
```sql
-- For sellers
SELECT * FROM get_property_stats('seller-uuid');

-- For buyers
SELECT * FROM get_buyer_stats('buyer-uuid');
```

## Migration Files

The database schema is created through the following migration files:

1. `20250621142130_create-users-table.sql` - Users table
2. `20250621142131_create-properties-table.sql` - Properties table
3. `20250621142132_create-rental-requests-table.sql` - Rental requests table
4. `20250621142133_create-price-suggestions-table.sql` - Price suggestions table
5. `20250621142134_create-rls-policies.sql` - Row Level Security policies
6. `20250621142135_create-functions-and-triggers.sql` - Functions and triggers

## TypeScript Types

The complete TypeScript types for this schema are defined in `types/supabase.ts` and include:

- Full type definitions for all tables
- Insert and Update types for each table
- Relationship definitions
- Enum type definitions

This ensures type safety when working with the database from the Next.js application. 