# POS System Setup Guide

## Prerequisites
- Supabase account and project
- Node.js installed
- Restaurant menu items already configured in database

## Step 1: Database Setup

Run the POS schema SQL file in your Supabase SQL editor:

```bash
# Navigate to your Supabase project's SQL Editor
# Copy and paste the contents of: supabase/pos_schema.sql
# Execute the SQL script
```

This will create:
- ✅ All POS tables (tables, orders, order_items, transactions, etc.)
- ✅ Database functions (generate_order_number, generate_transaction_number)
- ✅ Triggers for auto-calculations and inventory deduction
- ✅ Row Level Security policies
- ✅ 10 default tables (T1-T10)
- ✅ Sample inventory records for existing menu items

## Step 2: Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
1. Go to Supabase Dashboard
2. Settings → API
3. Copy Project URL and anon/public key

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Create Admin User

In Supabase SQL Editor, create an admin user:

```sql
-- First, sign up a user through your app or Supabase Auth
-- Then add them to admin_users table:

insert into admin_users (user_id, email, role)
values (
  'user-id-from-auth-users',
  'admin@restaurant.com',
  'owner'  -- or 'cashier'
);
```

**Role Options:**
- `owner` - Unlimited discounts, full access
- `cashier` - Max 15% discount, POS access

## Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## Step 6: Login and Access POS

1. Navigate to `/admin/login`
2. Sign in with your admin credentials
3. Click "POS" in the sidebar (green button)
4. You're now in the POS system!

## Step 7: Open Your First Business Day

Before taking orders:

1. Click "Business Day" button in the header
2. Enter your opening cash balance (e.g., 200.00)
3. Click "Open Business Day"

You're now ready to take orders! 🎉

## Verification Checklist

✅ Database schema installed without errors
✅ Environment variables configured
✅ Admin user created and can login
✅ Can access `/pos` route
✅ Business day can be opened
✅ Tables are visible in the grid
✅ Menu items load in selector
✅ Can create a test order

## Common Issues

### "Missing Supabase env vars" Warning
- Check your `.env` file exists and has correct values
- Restart dev server after adding `.env`

### "Checking access..." Loops Forever
- Ensure your user is in the `admin_users` table
- Check Supabase Auth user ID matches `admin_users.user_id`

### No Menu Items Showing
- Ensure `menu_items` table has records
- Check `is_available = true` for items
- Verify menu categories exist

### Inventory Not Deducting
- Check `inventory` table has records for your menu items
- Verify trigger `deduct_inventory_trigger` is installed
- Items must be printed (Print Kitchen) to deduct inventory

### Business Day Can't Open
- Check `business_days` table exists
- Ensure no active business day already exists
- Check user has permission to insert

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Already configured with netlify.toml
netlify deploy --prod
```

### Environment Variables in Netlify
1. Site settings → Environment variables
2. Add `VITE_SUPABASE_URL`
3. Add `VITE_SUPABASE_ANON_KEY`

## Database Backup

Regularly backup your database:

```sql
-- Export transactions
copy (
  select * from transactions 
  where created_at >= '2026-01-01'
) to '/tmp/transactions.csv' csv header;

-- Export orders
copy (
  select * from orders 
  where created_at >= '2026-01-01'
) to '/tmp/orders.csv' csv header;
```

Or use Supabase dashboard:
1. Database → Backups
2. Enable automatic daily backups

## Support

For issues or questions:
1. Check `docs/POS_SYSTEM.md` for complete documentation
2. Review `docs/POS_VISUAL_GUIDE.md` for UI reference
3. Check Supabase logs for errors
4. Verify RLS policies are correct

## Next Steps

After setup:
1. Add your actual restaurant tables (modify SQL or UI)
2. Configure menu items and pricing
3. Set up receipt printer (if physical)
4. Train staff on POS workflows
5. Test complete order flow end-to-end
6. Set up regular database backups
7. Monitor audit logs for issues

## Tips for Success

💡 **Open business day every morning** - Required to take orders
💡 **Close business day every night** - Generates reports and resets
💡 **Print kitchen tickets immediately** - Deducts inventory and notifies kitchen
💡 **Review end-of-day reports** - Track sales and reconcile cash
💡 **Check audit logs** - Monitor all POS activities
💡 **Keep inventory updated** - Regular stock counts and adjustments

## Maintenance

### Daily
- Open/close business day
- Review sales reports
- Check for QR orders

### Weekly
- Review audit logs
- Check inventory levels
- Backup database

### Monthly
- Analyze sales trends
- Update menu items/prices
- Review discount usage
- Clean up old soft-deleted records

---

**Ready to go!** Your POS system is now fully operational. Happy selling! 🍽️
