-- Create the profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS for the profiles table (REQUIRED for security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table: users can only access their own profile
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE TO authenticated USING (auth.uid() = id);

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Trigger the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user_id column to the existing claims table
ALTER TABLE public.claims
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing claims to have a user_id (e.g., assign to a default user or null)
-- For a live system, you'd migrate existing data carefully.
-- For this demo, we'll set existing claims' user_id to NULL or a specific user if available.
-- If you have existing claims, you might want to run an UPDATE statement here
-- For example: UPDATE public.claims SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Update RLS policies for the claims table
-- First, drop existing policies if they are too permissive
DROP POLICY IF EXISTS "Allow authenticated users to delete claims" ON public.claims;
DROP POLICY IF EXISTS "Allow authenticated users to update claims" ON public.claims;
DROP POLICY IF EXISTS "Allow authenticated users to insert claims" ON public.claims;
DROP POLICY IF EXISTS "Allow authenticated users to read all claims" ON public.claims;

-- Enable RLS (if not already enabled)
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- New RLS Policies for claims table:
-- Authenticated users can read all claims (for dashboard views)
CREATE POLICY "Authenticated users can view all claims" ON public.claims
FOR SELECT TO authenticated USING (true);

-- Users can only insert their own claims
CREATE POLICY "Users can insert their own claims" ON public.claims
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can only update their own claims
CREATE POLICY "Users can update their own claims" ON public.claims
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can only delete their own claims
CREATE POLICY "Users can delete their own claims" ON public.claims
FOR DELETE TO authenticated USING (auth.uid() = user_id);