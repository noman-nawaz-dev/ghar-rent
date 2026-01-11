-- Create enum type for user status
do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type user_status as enum ('active', 'suspended');
  end if;
end $$;

-- Add status column to users table
alter table users 
add column if not exists status user_status not null default 'active';

-- Create index for faster status queries
create index if not exists idx_users_status on users(status);

-- Create index for role and status combination
create index if not exists idx_users_role_status on users(role, status);

-- Comment on the column
comment on column users.status is 'User account status: active or suspended';
