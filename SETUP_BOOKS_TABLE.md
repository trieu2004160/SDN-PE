# Setup Books Table in Supabase

## Error: "Could not find the table 'public.books' in the schema cache"

This error means the `books` table hasn't been created in your Supabase database yet. Follow these steps:

## Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com and log in
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Run the SQL Script

1. Open the file `supabase-schema.sql` in this project
2. Copy ALL the SQL code from that file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

## Step 3: Verify the Table was Created

After running the SQL, you should see:
- A success message
- The table `books` should now exist

You can verify by:
1. Going to **Table Editor** in the left sidebar
2. You should see the `books` table listed

## Step 4: Test the Application

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```
2. Open your application in the browser
3. The error should be gone and you should be able to create books

## Alternative: Create Table Manually via Table Editor

If you prefer using the UI:

1. Go to **Table Editor** in Supabase
2. Click **New Table**
3. Name it `books`
4. Add the following columns:
   - `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
   - `title` (Text, Required)
   - `author` (Text, Required)
   - `tags` (Array, Text[], Optional)
   - `cover_image` (Text, Optional)
   - `created_at` (Timestamp, Default: `now()`)
   - `updated_at` (Timestamp, Default: `now()`)
5. Click **Save**

Then you'll need to:
1. Enable RLS (Row Level Security) on the table
2. Create a policy to allow all operations (or configure based on your needs)

## Troubleshooting

If you still get errors:
1. Make sure you ran the entire SQL script (not just parts of it)
2. Check that the table name is exactly `books` (lowercase)
3. Verify your `.env.local` has the correct Supabase credentials
4. Restart your Next.js server after creating the table

