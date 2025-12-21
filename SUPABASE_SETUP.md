# Supabase Setup Guide for MASHUB

## Step 1: Create Supabase Project

1. **Go to** https://supabase.com and sign up
2. **Create a new project:**
   - Click "New project"
   - Choose a name (e.g., "mashub")
   - Choose a strong password (save it!)
   - Select your region
   - Click "Create new project"
3. **Wait** for project to initialize (2-3 minutes)

## Step 2: Create Database Tables

In Supabase, go to **SQL Editor** and run these queries:

### Create Usrah Table
```sql
CREATE TABLE usrah (
  usrah_id TEXT PRIMARY KEY,
  usrah_name TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Create People Table
```sql
CREATE TABLE people (
  person_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  usrah_id TEXT NOT NULL REFERENCES usrah(usrah_id),
  active BOOLEAN DEFAULT TRUE,
  is_member BOOLEAN DEFAULT FALSE,
  development_plan BOOLEAN DEFAULT FALSE,
  leadership BOOLEAN DEFAULT FALSE,
  join_date TEXT,
  brotherhood_rating INTEGER DEFAULT 0,
  quran_progress INTEGER DEFAULT 0,
  activism_rating INTEGER DEFAULT 0,
  leadership_rating INTEGER DEFAULT 0,
  chapter_involvement INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_people_usrah ON people(usrah_id);
```

### Create Weeks Table
```sql
CREATE TABLE weeks (
  week_id TEXT PRIMARY KEY,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Create Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL REFERENCES people(person_id),
  week_id TEXT NOT NULL REFERENCES weeks(week_id),
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'excused')),
  reported_by TEXT NOT NULL REFERENCES usrah(usrah_id),
  reported_at TEXT,
  brotherhood INTEGER DEFAULT 0,
  pdpCompliance INTEGER DEFAULT 0,
  quran INTEGER DEFAULT 0,
  activism INTEGER DEFAULT 0,
  leadership INTEGER DEFAULT 0,
  chapter INTEGER DEFAULT 0,
  membership INTEGER DEFAULT 0,
  overall_brotherhood INTEGER DEFAULT 0,
  overall_curriculum INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(person_id, week_id, reported_by)
);

CREATE INDEX idx_attendance_person ON attendance(person_id);
CREATE INDEX idx_attendance_week ON attendance(week_id);
CREATE INDEX idx_attendance_reported_by ON attendance(reported_by);
```

## Step 3: Enable RLS (Row Level Security) - Optional but Recommended

Go to **Authentication** > **Policies** and set up policies for each table to restrict access.

For now, you can disable RLS during development:

```sql
ALTER TABLE usrah DISABLE ROW LEVEL SECURITY;
ALTER TABLE people DISABLE ROW LEVEL SECURITY;
ALTER TABLE weeks DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
```

## Step 4: Seed Initial Data

In **SQL Editor**, insert sample data:

```sql
INSERT INTO usrah (usrah_id, usrah_name, region) VALUES
  ('u1', 'North River', 'Southeast'),
  ('u2', 'East Grove', 'Southeast'),
  ('u3', 'Westfield', 'West');

INSERT INTO people (person_id, name, usrah_id, active, join_date) VALUES
  ('p1', 'Aisha Rahman', 'u1', true, '2024-09-15'),
  ('p2', 'Fatimah Khan', 'u1', true, '2024-08-20'),
  ('p3', 'Yusuf Malik', 'u1', true, '2024-07-10'),
  ('p4', 'Ismail Odeh', 'u2', true, '2024-10-01'),
  ('p5', 'Maryam Said', 'u2', true, '2024-09-05'),
  ('p7', 'Omar Saleh', 'u3', true, '2024-08-15'),
  ('p8', 'Sarah Idris', 'u3', true, '2024-07-20'),
  ('p9', 'Bilal Karim', 'u3', true, '2024-06-30');

INSERT INTO weeks (week_id, start_date, end_date) VALUES
  ('2025-W09', '2025-03-03', '2025-03-09'),
  ('2025-W10', '2025-03-10', '2025-03-16'),
  ('2025-W11', '2025-03-17', '2025-03-23'),
  ('2025-W12', '2025-03-24', '2025-03-30'),
  ('2025-W13', '2025-03-31', '2025-04-06'),
  ('2025-W14', '2025-04-07', '2025-04-13'),
  ('2025-W15', '2025-04-14', '2025-04-20'),
  ('2025-W16', '2025-04-21', '2025-04-27');
```

## Step 5: Get API Keys

1. Go to **Project Settings** > **API**
2. Copy your project URL (looks like `https://xxxxx.supabase.co`)
3. Copy **anon public** key (for frontend use)
4. Copy **service_role secret** (for backend only - keep secret!)

## Step 6: Configure Frontend

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Or for non-Vite projects, update the constants in HTML:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key-here'
```

## Step 7: Test Connection

In browser console:
```javascript
const { data } = await supabaseAPI.loadUsrah()
console.log(data) // Should show your usrah
```

## Step 8: Deploy

### Option 1: Vercel (Recommended for static sites)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Option 2: Netlify
1. Push code to GitHub
2. Connect to Netlify
3. Add environment variables in Build & Deploy settings
4. Deploy

### Option 3: GitHub Pages
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Use `gh-pages` branch

## Database Schema Overview

### usrah
- `usrah_id` - Primary key (e.g., "u1")
- `usrah_name` - Group name
- `region` - Geographic region

### people
- `person_id` - Primary key
- `name` - Full name
- `usrah_id` - Foreign key to usrah
- `active` - Currently active member
- `join_date` - When they joined
- Ratings fields (brotherhood, quran, activism, etc.)

### weeks
- `week_id` - Primary key (e.g., "2025-W09")
- `start_date` - Week start
- `end_date` - Week end

### attendance
- `id` - UUID primary key
- `person_id` - Who attended
- `week_id` - Which week
- `status` - 'present', 'absent', or 'excused'
- `reported_by` - Which usrah reported
- All metric fields (brotherhood, quran, activism, etc.)
- `overall_brotherhood` - Usrah-level metric
- `overall_curriculum` - Usrah-level metric

## Features

✅ Real-time database (changes sync across clients)
✅ Built-in authentication (optional)
✅ Row Level Security for fine-grained access control
✅ Auto-generated API
✅ Real-time subscriptions
✅ Free tier with generous limits

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [SQL Examples](https://supabase.com/docs/guides/database/overview)
- [Authentication](https://supabase.com/docs/guides/auth)

## Troubleshooting

### CORS Errors
1. Go to **Project Settings** > **API**
2. Update **CORS Allowed Origins** to include your domain

### Connection Refused
- Check API keys are correct
- Verify table names match exactly (case-sensitive)
- Check RLS policies aren't blocking access

### Data Not Showing
- Verify tables have data (check in Supabase dashboard)
- Check browser console for errors
- Test API keys in Supabase SQL editor

## Support

For issues:
1. Check Supabase status page
2. Review [documentation](https://supabase.com/docs)
3. Check browser console for errors
4. Verify environment variables are set correctly

Happy building! 🚀
