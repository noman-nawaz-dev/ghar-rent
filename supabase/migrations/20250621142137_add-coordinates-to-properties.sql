-- Add coordinates field to properties table
-- This field will store latitude and longitude as a JSON object
-- Example: {"latitude": 33.6844, "longitude": 73.0479}

-- Add coordinates column to properties table
alter table properties 
add column if not exists coordinates jsonb;

-- Add comment to document the field structure
comment on column properties.coordinates is 'JSON object containing latitude and longitude coordinates. Format: {"latitude": number, "longitude": number}';

-- Add a check constraint to ensure coordinates have the required structure
alter table properties 
add constraint check_coordinates_structure 
check (
  coordinates is null or (
    jsonb_typeof(coordinates) = 'object' and
    coordinates ? 'latitude' and 
    coordinates ? 'longitude' and
    jsonb_typeof(coordinates->'latitude') = 'number' and
    jsonb_typeof(coordinates->'longitude') = 'number' and
    (coordinates->>'latitude')::numeric between -90 and 90 and
    (coordinates->>'longitude')::numeric between -180 and 180
  )
);
