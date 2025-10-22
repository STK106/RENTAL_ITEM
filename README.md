# FILE 39: README.md

# Chaniya Choli Rental Management System

A complete web application for managing traditional Chaniya Choli rentals with date-based availability tracking.

## Features

✅ **User Authentication** - Secure login/registration system
✅ **Item Management** - Add, edit, delete items with photos
✅ **Smart Booking System** - Prevents double-booking with date overlap detection
✅ **Availability Checker** - Real-time availability validation
✅ **Advanced Filtering** - Search and filter items by price, name, etc.
✅ **Reports & Analytics** - View booking statistics and trends
✅ **Export Functionality** - Export reports to CSV/PDF
✅ **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18
- **Backend**: Supabase (PostgreSQL + Authentication + Storage)
- **Styling**: Custom CSS
- **Libraries**: 
  - react-router-dom (routing)
  - jspdf & jspdf-autotable (PDF export)
  - papaparse (CSV export)
  - lucide-react (icons)

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL and anon key from Project Settings > API

### 2. Setup Database

Run the following SQL in your Supabase SQL Editor:
```sql
-- Create items table
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  description TEXT,
  rent_price DECIMAL(10, 2) NOT NULL,
  rent_type VARCHAR(20) DEFAULT 'per_day',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_mobile VARCHAR(15) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rent_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for items
CREATE POLICY "Users can view own items" ON items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" ON items
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_bookings_dates ON bookings(item_id, start_date, end_date);
```

### 3. Setup Storage Bucket

In Supabase Dashboard:
1. Go to Storage
2. Create a new bucket named `item-photos`
3. Make it public
4. Set up policies:
```sql
-- Storage policies
CREATE POLICY "Users can upload item photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'item-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view item photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'item-photos');
```

### 4. Install and Run Project
```bash
# Clone or create the project
npx create-react-app chaniya-choli-rental
cd chaniya-choli-rental

# Install dependencies
npm install @supabase/supabase-js react-router-dom jspdf jspdf-autotable papaparse lucide-react

# Create .env file in root directory
# Add your Supabase credentials:
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Copy all the provided files to their respective locations

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## Usage

1. **Register** - Create a new seller account
2. **Add Items** - Add your Chaniya Choli items with photos and pricing
3. **Create Bookings** - Record customer bookings with automatic availability checking
4. **View Reports** - Track your business performance and export data

## Project Structure
```
chaniya-choli-rental/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Booking/
│   │   ├── Reports/
│   │   └── Layout/
│   ├── services/
│   ├── utils/
│   ├── hooks/
│   ├── context/
│   ├── App.jsx
│   └── index.js
├── .env
└── package.json
```

## Key Features Explained

### Double-Booking Prevention
The system automatically checks for date overlaps when creating bookings:
- Compares start and end dates with existing bookings
- Shows conflict details if dates overlap
- Prevents booking creation if conflict exists

### Date Validation
- End date must be >= start date
- Cannot book past dates
- Automatic price calculation based on duration

### Export Functionality
- **CSV Export**: Download booking data in Excel-compatible format
- **PDF Export**: Generate professional reports with tables and summaries

## Support

For issues or questions, please check:
- Supabase documentation: https://supabase.com/docs
- React documentation: https://react.dev

## License

MIT License - Feel free to use this project for personal or commercial purposes.