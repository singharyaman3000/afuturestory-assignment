-- Organization Manager Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create policy to ensure users can only access their own organizations
CREATE POLICY "Users can only access their own organizations" ON organizations
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_user_id ON organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_created_at ON organizations(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data (optional - for testing)
-- Note: You'll need to replace 'your-user-id' with an actual user ID from auth.users
-- This can be done after creating a user account

-- Example demo data insertion (uncomment and modify after creating a user):
/*
INSERT INTO organizations (name, description, user_id, is_active) VALUES
('Tech Startup Inc.', 'A cutting-edge technology startup focused on AI solutions', 'your-user-id', true),
('Local Sports Club', 'Community sports club for football and basketball enthusiasts', 'your-user-id', true),
('Volunteer Organization', 'Non-profit organization dedicated to community service', 'your-user-id', false);
*/