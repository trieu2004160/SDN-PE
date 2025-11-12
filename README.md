# Recipe Sharing App

A simple recipe sharing web application built with Next.js and Supabase, where users can browse, create, edit, and delete cooking recipes.

## Features

- **Recipe List Page**: Display all recipes with search, filter by tags, and sort functionality
- **Create Recipe**: Add new recipes with title, ingredients, tags, and optional image
- **Edit Recipe**: Modify existing recipes
- **Delete Recipe**: Remove recipes with confirmation prompt
- **Responsive Design**: Modern UI with gradient background and card-based layout

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Supabase** - Database and backend
- **React Hot Toast** - User notifications

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd recipe-sharing-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase-schema.sql` to create the `recipes` table
4. Go to Project Settings > API to get your project URL and anon key

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## Deployment

**📖 Xem hướng dẫn chi tiết tại [DEPLOYMENT.md](DEPLOYMENT.md)**

### Quick Start - Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. **⚠️ QUAN TRỌNG**: Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJ...` (JWT token)
5. Deploy!

**💡 Lỗi "fetch failed"?** Xem [DEPLOYMENT.md](DEPLOYMENT.md) để fix!

### Deploy to Other Platforms

- **Render**: Connect GitHub repo and set environment variables
- **Railway**: Connect GitHub repo and configure environment variables
- **Netlify**: Connect GitHub repo and set build command to `npm run build`

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Toaster
│   ├── page.tsx            # Recipe list page
│   ├── create/
│   │   └── page.tsx        # Create recipe page
│   ├── edit/
│   │   └── [id]/
│   │       └── page.tsx    # Edit recipe page
│   └── globals.css         # Global styles
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── supabase-schema.sql     # Database schema
└── README.md               # This file
```

## Database Schema

The `recipes` table has the following structure:

- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `ingredients` (TEXT, Required)
- `tags` (TEXT[], Optional)
- `image_url` (TEXT, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Features Implementation

### Search
- Search recipes by title (case-insensitive)
- Real-time filtering as you type

### Filter
- Filter recipes by tags
- Dropdown showing all available tags

### Sort
- Sort recipes alphabetically (A-Z or Z-A)

### Create Recipe
- Required fields: Title, Ingredients
- Optional fields: Tags, Image URL
- Tags can be added dynamically
- Image preview before saving

### Edit Recipe
- Pre-populated form with existing recipe data
- Same validation as create
- Redirects to list after saving

### Delete Recipe
- Confirmation dialog before deletion
- Toast notification on success/error

## License

This project is created for educational purposes as part of SDN302 Practical Exam.

