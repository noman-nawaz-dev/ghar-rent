-- Create enum type for role (safe)
do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('seller', 'buyer', 'admin');
  end if;
end $$;

-- Create users table (safe)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  phone text,
  role user_role not null default 'buyer',
  created_at timestamp with time zone default timezone('utc', now())
);