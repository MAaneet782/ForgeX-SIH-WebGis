UPDATE public.profiles
SET
  first_name = 'Forest',
  last_name = 'Official',
  avatar_url = 'https://example.com/avatar.jpg', -- Replace with a real avatar URL if desired
  updated_at = NOW()
WHERE id = auth.uid();