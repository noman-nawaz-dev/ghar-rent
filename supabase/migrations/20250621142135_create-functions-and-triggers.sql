-- Function to automatically update property status when rental request is approved
create or replace function update_property_status_on_approval()
returns trigger as $$
begin
  if new.status = 'approved' and old.status = 'pending' then
    update properties 
    set status = 'Rented', updated_at = timezone('utc', now())
    where id = new.property_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_property_status
  after update on rental_requests
  for each row
  execute function update_property_status_on_approval();

-- Function to prevent multiple approved requests for the same property
create or replace function prevent_multiple_approved_requests()
returns trigger as $$
begin
  if new.status = 'approved' then
    if exists (
      select 1 from rental_requests 
      where property_id = new.property_id 
      and status = 'approved' 
      and id != new.id
    ) then
      raise exception 'Property already has an approved rental request';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_prevent_multiple_approved_requests
  before insert or update on rental_requests
  for each row
  execute function prevent_multiple_approved_requests();

-- Function to get property statistics
create or replace function get_property_stats(user_id uuid)
returns table (
  total_properties bigint,
  available_properties bigint,
  rented_properties bigint,
  pending_requests bigint
) as $$
begin
  return query
  select 
    count(*) as total_properties,
    count(*) filter (where status = 'Available') as available_properties,
    count(*) filter (where status = 'Rented') as rented_properties,
    (select count(*) from rental_requests rr 
     join properties p on p.id = rr.property_id 
     where p.seller_id = user_id and rr.status = 'pending') as pending_requests
  from properties 
  where seller_id = user_id;
end;
$$ language plpgsql;

-- Function to get buyer statistics
create or replace function get_buyer_stats(user_id uuid)
returns table (
  total_requests bigint,
  pending_requests bigint,
  approved_requests bigint,
  rejected_requests bigint
) as $$
begin
  return query
  select 
    count(*) as total_requests,
    count(*) filter (where status = 'pending') as pending_requests,
    count(*) filter (where status = 'approved') as approved_requests,
    count(*) filter (where status = 'rejected') as rejected_requests
  from rental_requests 
  where buyer_id = user_id;
end;
$$ language plpgsql;

-- Function to search properties with filters
create or replace function search_properties(
  search_term text default null,
  city_filter text default null,
  min_price integer default null,
  max_price integer default null,
  property_type_filter text default null,
  min_bedrooms integer default null,
  has_lawn_filter boolean default null
)
returns table (
  id uuid,
  title text,
  description text,
  price integer,
  area numeric,
  area_unit area_unit,
  bedrooms integer,
  floors integer,
  kitchens integer,
  has_lawn boolean,
  additional_info text,
  address text,
  city text,
  images text[],
  seller_id uuid,
  seller_phone text,
  seller_name text,
  listed_date date,
  status property_status,
  property_type text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) as $$
begin
  return query
  select * from properties
  where status = 'Available'
    and (search_term is null or 
         to_tsvector('english', title || ' ' || description || ' ' || address || ' ' || city) @@ plainto_tsquery('english', search_term))
    and (city_filter is null or city ilike '%' || city_filter || '%')
    and (min_price is null or price >= min_price)
    and (max_price is null or price <= max_price)
    and (property_type_filter is null or property_type ilike '%' || property_type_filter || '%')
    and (min_bedrooms is null or bedrooms >= min_bedrooms)
    and (has_lawn_filter is null or has_lawn = has_lawn_filter)
  order by created_at desc;
end;
$$ language plpgsql; 