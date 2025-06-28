-- Create enum type for request status (safe)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'request_status') then
    create type request_status as enum ('pending', 'approved', 'rejected');
  end if;
end $$;

-- Create rental_requests table (safe)
create table if not exists rental_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  buyer_id uuid not null references users(id) on delete cascade,
  proposed_price integer not null check (proposed_price > 0),
  duration integer not null check (duration > 0),
  message text,
  status request_status not null default 'pending',
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Create indexes for better performance
create index if not exists idx_rental_requests_property_id on rental_requests(property_id);
create index if not exists idx_rental_requests_buyer_id on rental_requests(buyer_id);
create index if not exists idx_rental_requests_status on rental_requests(status);
create index if not exists idx_rental_requests_created_at on rental_requests(created_at);

-- Create unique constraint to prevent duplicate requests from same buyer for same property
create unique index if not exists idx_rental_requests_unique_buyer_property 
  on rental_requests(buyer_id, property_id) 
  where status = 'pending';

-- Create trigger to update updated_at timestamp
create trigger update_rental_requests_updated_at
  before update on rental_requests
  for each row
  execute function update_updated_at_column(); 