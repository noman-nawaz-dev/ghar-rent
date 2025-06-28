-- Create enum types for property status and area unit (safe)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'property_status') then
    create type property_status as enum ('Available', 'Pending', 'Rented');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'area_unit') then
    create type area_unit as enum ('Marla', 'Kanal');
  end if;
end $$;

-- Create properties table (safe)
create table if not exists properties (
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
  seller_id uuid not null references users(id) on delete cascade,
  seller_phone text not null,
  seller_name text not null,
  listed_date date not null default current_date,
  status property_status not null default 'Available',
  property_type text not null,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Create indexes for better performance
create index if not exists idx_properties_seller_id on properties(seller_id);
create index if not exists idx_properties_city on properties(city);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_price on properties(price);
create index if not exists idx_properties_created_at on properties(created_at);

-- Create full-text search index
create index if not exists idx_properties_search on properties using gin(to_tsvector('english', title || ' ' || description || ' ' || address || ' ' || city));

-- Create trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger update_properties_updated_at
  before update on properties
  for each row
  execute function update_updated_at_column(); 