-- Remove all RLS policies

-- Remove admin policies
drop policy if exists "Admins can view all data" on users;
drop policy if exists "Admins can view all properties" on properties;
drop policy if exists "Admins can view all rental requests" on rental_requests;

-- Remove users table policies
drop policy if exists "Users can view their own profile" on users;
drop policy if exists "Users can update their own profile" on users;
drop policy if exists "Users can insert their own profile" on users;

-- Remove properties table policies
drop policy if exists "Anyone can view available properties" on properties;
drop policy if exists "Users can view their own properties" on properties;
drop policy if exists "Sellers can insert their own properties" on properties;
drop policy if exists "Sellers can update their own properties" on properties;
drop policy if exists "Sellers can delete their own properties" on properties;

-- Remove rental requests table policies
drop policy if exists "Buyers can view their own requests" on rental_requests;
drop policy if exists "Sellers can view requests for their properties" on rental_requests;
drop policy if exists "Buyers can insert their own requests" on rental_requests;
drop policy if exists "Sellers can update requests for their properties" on rental_requests;

-- Disable Row Level Security on all tables
alter table users disable row level security;
alter table properties disable row level security;
alter table rental_requests disable row level security; 