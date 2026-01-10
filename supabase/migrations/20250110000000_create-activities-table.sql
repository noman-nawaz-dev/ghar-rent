-- Create activity_type enum
CREATE TYPE activity_type AS ENUM (
  'property_listed',
  'property_updated',
  'property_deleted',
  'rental_request_created',
  'rental_request_approved',
  'rental_request_rejected',
  'rental_request_cancelled',
  'profile_updated'
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  related_entity_id UUID,
  related_entity_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_user_created ON activities(user_id, created_at DESC);
CREATE INDEX idx_activities_type ON activities(activity_type);

-- Add comments for documentation
COMMENT ON TABLE activities IS 'Stores user activity logs for dashboard display';
COMMENT ON COLUMN activities.user_id IS 'Reference to the user who performed the activity';
COMMENT ON COLUMN activities.activity_type IS 'Type of activity performed';
COMMENT ON COLUMN activities.title IS 'Short title/summary of the activity';
COMMENT ON COLUMN activities.description IS 'Detailed description of the activity';
COMMENT ON COLUMN activities.metadata IS 'Additional JSON data related to the activity';
COMMENT ON COLUMN activities.related_entity_id IS 'ID of related entity (property, rental request, etc.)';
COMMENT ON COLUMN activities.related_entity_type IS 'Type of related entity (property, rental_request, etc.)';

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own activities
CREATE POLICY "Users can view their own activities"
ON activities FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own activities
CREATE POLICY "Users can insert their own activities"
ON activities FOR INSERT
WITH CHECK (auth.uid() = user_id);

