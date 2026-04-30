-- Seed data for the user amahchibu@gmail.com
-- This script creates the user account and all associated data

-- First, create the auth user (this would typically be done via Supabase Auth)
-- For manual seeding, you might need to use the Supabase Dashboard or CLI

-- Insert user record (assuming auth user already exists)
-- You'll need to get the actual UUID from auth.users after creating the auth account
-- For now, we'll use a placeholder UUID - replace with actual user ID

-- Get the user ID from email (this assumes the auth user exists)
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'amahchibu@gmail.com';
  
  IF user_uuid IS NOT NULL THEN
    -- Insert into users table
    INSERT INTO public.users (id, email)
    VALUES (user_uuid, 'amahchibu@gmail.com')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert user profile
    INSERT INTO public.user_profiles (user_id, first_name, last_name, phone, bio, profile_image_url, location)
    VALUES (
      user_uuid,
      'Amah',
      'Precious',
      '08034826276',
      'CEO | Founder, Tech tailblazer Academy',
      '/belo.png',
      'CEO | PH, Nigeria'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone = EXCLUDED.phone,
      bio = EXCLUDED.bio,
      profile_image_url = EXCLUDED.profile_image_url,
      location = EXCLUDED.location,
      updated_at = NOW();
    
    -- Insert business links
    INSERT INTO public.business_links (user_id, platform, url, display_name, description, icon_url, sort_order)
    VALUES 
      (
        user_uuid,
        'meta_business',
        'https://business.facebook.com/latest/home?nav_ref=bm_home_redirect&business_id=1984480999152309&asset_id=110220428843203',
        'Meta Business',
        'Manage your business accounts',
        '/icons/facebook.png',
        1
      ),
      (
        user_uuid,
        'whatsapp',
        'https://chat.whatsapp.com/Bi5XuFToVdjBPRvIawWz5W',
        'WhatsApp Group',
        'Manage your community',
        '/icons/whatsappi.png',
        2
      )
    ON CONFLICT (user_id, platform) DO UPDATE SET
      url = EXCLUDED.url,
      display_name = EXCLUDED.display_name,
      description = EXCLUDED.description,
      icon_url = EXCLUDED.icon_url,
      updated_at = NOW();
    
    -- Insert social media links
    INSERT INTO public.social_links (user_id, platform, url, icon_url)
    VALUES 
      (user_uuid, 'facebook', '#', '/icons/facebook.png'),
      (user_uuid, 'twitter', '#', '/icons/twitter.png'),
      (user_uuid, 'instagram', '#', '/icons/instagram.png')
    ON CONFLICT (user_id, platform) DO UPDATE SET
      url = EXCLUDED.url,
      icon_url = EXCLUDED.icon_url,
      updated_at = NOW();
    
    RAISE NOTICE 'User data seeded successfully for amahchibu@gmail.com';
  ELSE
    RAISE NOTICE 'User amahchibu@gmail.com not found in auth.users. Please create the auth user first.';
  END IF;
END $$;

-- Alternative approach: If you need to create the auth user manually
-- Use this in Supabase SQL Editor after creating the auth user:

-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from auth.users
/*
-- Get the UUID from auth.users table first
SELECT id, email FROM auth.users WHERE email = 'amahchibu@gmail.com';

-- Then run the inserts with the actual UUID
INSERT INTO public.users (id, email)
VALUES ('YOUR_USER_UUID_HERE', 'amahchibu@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Continue with profile and links as above...
*/
