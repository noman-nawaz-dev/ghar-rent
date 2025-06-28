-- Enable Row Level Security on all tables
alter table users enable row level security;
alter table properties enable row level security;
alter table rental_requests enable row level security;

-- Users table policies
create policy "Users can view their own profile" on users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on users
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on users
  for insert with check (auth.uid() = id);

-- Properties table policies
create policy "Anyone can view available properties" on properties
  for select using (status = 'Available');

create policy "Users can view their own properties" on properties
  for select using (auth.uid() = seller_id);

create policy "Sellers can insert their own properties" on properties
  for insert with check (auth.uid() = seller_id);

create policy "Sellers can update their own properties" on properties
  for update using (auth.uid() = seller_id);

create policy "Sellers can delete their own properties" on properties
  for delete using (auth.uid() = seller_id);

-- Rental requests table policies
create policy "Buyers can view their own requests" on rental_requests
  for select using (auth.uid() = buyer_id);

create policy "Sellers can view requests for their properties" on rental_requests
  for select using (
    exists (
      select 1 from properties 
      where properties.id = rental_requests.property_id 
      and properties.seller_id = auth.uid()
    )
  );

create policy "Buyers can insert their own requests" on rental_requests
  for insert with check (auth.uid() = buyer_id);

create policy "Sellers can update requests for their properties" on rental_requests
  for update using (
    exists (
      select 1 from properties 
      where properties.id = rental_requests.property_id 
      and properties.seller_id = auth.uid()
    )
  );

-- Admin policies (for admin users)
create policy "Admins can view all data" on users
  for all using (
    exists (
      select 1 from users 
      where users.id = auth.uid() 
      and users.role = 'admin'
    )
  );

create policy "Admins can view all properties" on properties
  for all using (
    exists (
      select 1 from users 
      where users.id = auth.uid() 
      and users.role = 'admin'
    )
  );

create policy "Admins can view all rental requests" on rental_requests
  for all using (
    exists (
      select 1 from users 
      where users.id = auth.uid() 
      and users.role = 'admin'
    )
  ); 