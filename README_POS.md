# 🍽️ Plan B Restaurant - POS System

A complete Point of Sale system for restaurant operations with support for dine-in, takeaway, and delivery orders.

## ✨ Features

### Core Functionality
- 📊 **Table Management** - Visual grid with real-time status indicators
- 🛎️ **Multiple Order Types** - Dine-in, Takeaway, Delivery
- 📱 **QR Order Management** - Accept/reject customer QR orders
- 🔍 **Menu Selection** - Search and category-based item selection
- 💰 **Smart Calculations** - Auto-calculate subtotal, tax, discount, total
- 🎫 **Professional Prints** - Kitchen tickets and customer receipts
- 📅 **Business Day Management** - Daily operations and reporting

### Advanced Features
- ✂️ **Split Bill** - Divide orders into multiple bills
- 🔗 **Merge Tables** - Combine orders from different tables
- 💸 **Role-based Discounts** - Cashier (15% max) vs Owner (unlimited)
- 📦 **Inventory Tracking** - Auto-deduct on kitchen print
- 📝 **Complete Audit Trail** - Log all actions with user and timestamp
- 🗑️ **Soft Delete** - No data loss, maintain integrity

## 🎯 Business Logic

### Tax Calculation
```
Tax = 14% for dine-in only
Applied AFTER discount
```

### Order Flow
```
1. Create Order → 2. Add Items → 3. Print Kitchen → 4. Close & Pay
```

### Inventory Management
```
Deducted ONLY when kitchen ticket is printed
Prevents premature stock reduction
```

## 📁 Project Structure

```
src/
├── pages/
│   └── POS.jsx                      # Main POS page
├── components/
│   └── pos/
│       ├── POSHeader.jsx            # Header with business day status
│       ├── TableGrid.jsx            # Table management grid
│       ├── MenuItemSelector.jsx     # Menu browsing
│       ├── OrderPanel.jsx           # Order management
│       ├── QROrdersPanel.jsx        # QR order handling
│       ├── BusinessDayPanel.jsx     # Business operations
│       ├── PrintKitchenTicket.jsx   # Kitchen ticket layout
│       └── PrintReceipt.jsx         # Receipt layout
supabase/
└── pos_schema.sql                   # Complete database schema
docs/
├── POS_SYSTEM.md                    # Technical documentation
├── POS_VISUAL_GUIDE.md              # UI mockups and workflows
└── POS_SETUP.md                     # Installation guide
```

## 🚀 Quick Start

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor
-- File: supabase/pos_schema.sql
```

### 2. Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Create Admin User
```sql
insert into admin_users (user_id, email, role)
values ('auth-user-id', 'admin@example.com', 'owner');
```

### 5. Access POS
1. Login at `/admin/login`
2. Click "POS" in sidebar
3. Open business day
4. Start taking orders! 🎉

## 📖 Documentation

- **[Complete System Docs](docs/POS_SYSTEM.md)** - Full feature documentation
- **[Visual Guide](docs/POS_VISUAL_GUIDE.md)** - UI mockups and workflows  
- **[Setup Guide](docs/POS_SETUP.md)** - Installation instructions

## 🗄️ Database Schema

### Core Tables
- `tables` - Restaurant tables with QR status
- `orders` - Order sessions with totals
- `order_items` - Individual items in orders
- `transactions` - Payment records
- `business_days` - Daily operations tracking
- `inventory` - Stock levels with auto-deduction
- `audit_logs` - Complete action history

### Supporting Tables
- `table_merges` - Table merge history
- `bill_splits` - Bill split records

## 🔐 Security

- ✅ Protected by authentication (AdminRoute)
- ✅ Role-based discount limits
- ✅ Complete audit logging
- ✅ Row Level Security (RLS) policies
- ✅ No SQL injection vectors
- ✅ Soft delete pattern
- ✅ CodeQL security scan passed (0 vulnerabilities)

## 💻 Tech Stack

- **Frontend**: React 18.2, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Routing**: React Router v6

## 📸 Screenshot

![POS Login](https://github.com/user-attachments/assets/c7b5405d-db99-4f0b-aed8-039b6ef25a1c)

*Protected by authentication - admin login required*

## 🎯 Key Workflows

### Daily Operations
```
Morning:
1. Login → 2. Open Business Day → 3. Enter opening balance

During Day:
- Take orders (dine-in/takeaway/delivery)
- Manage QR orders
- Print kitchen tickets
- Process payments

Evening:
1. Review end-of-day report → 2. Count cash → 3. Close business day
```

### Order Management
```
Table Order:
Click table → Add items → Print kitchen → Close & pay

Takeaway:
Click "New Takeaway" → Add items → Close & pay

Delivery:
Click "New Delivery" → Enter details → Add items → Close & pay
```

## 🧪 Testing

### Build Test
```bash
npm run build
# ✓ Build successful - no errors
```

### Security Test
```bash
# CodeQL security scan
# ✓ 0 vulnerabilities found
```

## 🤝 Contributing

This POS system is ready for production use. Suggested enhancements:
- Kitchen Display System (KDS)
- Advanced analytics dashboard
- Customer loyalty integration
- Multi-location support
- Mobile app for orders

## 📝 License

Part of Plan B Restaurant project.

## 🆘 Support

For issues:
1. Check documentation in `/docs`
2. Review Supabase logs
3. Check audit_logs table
4. Verify RLS policies

---

**Built with ❤️ for Plan B Restaurant**

*Ready to serve your customers efficiently!* 🍴
