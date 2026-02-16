# Plan B Restaurant Management System

Premium restaurant & cafe website and management system for Plan B, built with Vite, React, TailwindCSS, React Router, and Supabase.

## Features

### Customer-Facing Website
- Modern, responsive design
- Menu browsing with categories
- Online booking system
- Events showcase
- Photo gallery
- Contact information

### Point of Sale (POS) System
- Table management with visual grid
- QR order management
- Multiple session types (dine-in, takeaway, delivery)
- Menu item selection
- Order management with modifiers
- Discount application (role-based)
- Split bill functionality
- Table merging
- Kitchen ticket printing
- Receipt printing
- Business day management
- Inventory deduction on print

### Admin Dashboard

#### Standard Admin Features
- Reservation management
- Event request handling
- Customer management
- Menu management (categories, items, prices)
- Gallery management

#### Owner-Only Features (👑)
- **Modifiers**: Manage menu item add-ons
- **Inventory**: Track ingredients, recipes, stock levels
- **Purchases**: Supplier orders and stock replenishment
- **Expenses**: Track operational and administrative costs
- **Waste Logs**: Monitor ingredient waste and spoilage
- **Reports**: Comprehensive business analytics
  - Business day reports
  - Sales by order type
  - Tax collection reports
  - Profit analysis (Revenue - COGS - Expenses)

## Documentation

- [POS System Documentation](docs/POS_SYSTEM.md)
- [Admin Dashboard Documentation](docs/ADMIN_DASHBOARD.md)

## Technology Stack

- **Frontend**: React 18.2 + Vite 5
- **Styling**: TailwindCSS 3.4
- **Routing**: React Router 6
- **Animation**: Framer Motion 11
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file locally (or set in Netlify) with:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase Setup

### 1. Create a New Supabase Project

Visit [https://supabase.com](https://supabase.com) and create a new project.

### 2. Run Database Migrations

Execute the following SQL files in order in the Supabase SQL editor:

1. `supabase/gallery.sql` - Gallery system
2. `supabase/menu_gallery_updates.sql` - Menu categories and items
3. `supabase/pos_schema.sql` - POS system tables
4. `supabase/admin_dashboard_schema.sql` - Admin dashboard tables

### 3. Create Admin User

1. Sign up at `/admin/login`
2. Get your `user_id` from Supabase → Authentication → Users
3. Insert into admin_users table:

```sql
-- For owner with full access
insert into admin_users (user_id, role) 
values ('YOUR_USER_ID', 'owner');

-- For staff with limited access
insert into admin_users (user_id, role) 
values ('STAFF_USER_ID', 'staff');
```

### 4. Set Up Storage

The gallery SQL script creates the storage bucket automatically. For manual setup:

1. Go to Supabase → Storage
2. Create bucket named `gallery`
3. Set as public
4. Apply RLS policies from SQL

## Key Features

### Business Logic

- **Tax**: 14% only on dine-in orders
- **Tax Application**: After discount
- **Inventory**: Deducted only when kitchen ticket is printed
- **Soft Delete**: No hard deletes, all records marked with `is_deleted`
- **Audit Logging**: All critical actions logged

### Role-Based Access

- **Owner**: Full access to all features including financial reports
- **Staff/Admin**: Access to customer-facing management (reservations, events, menu)
- **Cashier**: Access to POS system

### Security

- Supabase RLS policies on all tables
- Role-based route protection
- Session-based authentication
- Audit trail for all actions

## Deploy to Netlify

1. Push this repo to GitHub
2. In Netlify: **New site from Git** and select the repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

### Supabase Auth Redirect URLs

Update your Supabase Auth settings:
- Supabase dashboard → Authentication → URL Configuration
- Add your Netlify URL and `http://localhost:5173` to **Redirect URLs**

The `netlify.toml` file includes SPA redirects for React Router.

## Project Structure

```
src/
├── components/
│   ├── pos/              # POS system components
│   ├── layout/           # Layout components
│   ├── ui/               # Reusable UI components
│   ├── AdminRoute.jsx    # Admin authentication guard
│   ├── OwnerRoute.jsx    # Owner-only route guard
│   └── AdminLayout.jsx   # Admin dashboard layout
├── pages/
│   ├── admin/            # Admin dashboard pages
│   ├── POS.jsx           # Point of Sale page
│   └── ...               # Public pages
├── context/
│   └── LoadingContext.jsx
├── lib/
│   └── supabaseClient.js
└── App.jsx

supabase/
├── gallery.sql                    # Gallery tables
├── menu_gallery_updates.sql       # Menu system
├── pos_schema.sql                 # POS tables & triggers
└── admin_dashboard_schema.sql     # Admin tables & views

docs/
├── POS_SYSTEM.md          # POS documentation
└── ADMIN_DASHBOARD.md     # Admin documentation
```

## Routes

### Public Routes
- `/` - Home
- `/menu` - Menu
- `/booking` - Reservations
- `/events` - Events
- `/gallery` - Gallery
- `/about` - About Us
- `/contact` - Contact

### Admin Routes (Requires Authentication)
- `/admin/login` - Admin login
- `/admin` - Overview dashboard
- `/admin/reservations` - Manage reservations
- `/admin/events` - Manage events
- `/admin/customers` - Customer management
- `/admin/menu` - Menu management
- `/admin/gallery` - Gallery management

### Owner-Only Routes (Requires Owner Role)
- `/admin/modifiers` - Modifier management
- `/admin/inventory` - Inventory & recipes
- `/admin/purchases` - Purchase orders
- `/admin/expenses` - Expense tracking
- `/admin/waste` - Waste logs
- `/admin/reports` - Business reports

### POS Route (Requires Authentication)
- `/pos` - Point of Sale system

## License

Private - All rights reserved

## Support

For issues or questions, contact the development team.
