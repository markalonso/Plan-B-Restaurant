# Admin Dashboard Documentation

## Overview
The Admin Dashboard provides comprehensive business management tools for Plan B Restaurant, with owner-only features for advanced operations including inventory, purchases, expenses, waste tracking, and detailed financial reporting.

## Access Control

### Roles
- **Owner**: Full access to all admin features including owner-only sections
- **Staff**: Access to basic admin features (reservations, events, customers, menu, gallery)

### Role Assignment
The `admin_users` table includes a `role` column:
- Set `role = 'owner'` for full access
- Set `role = 'staff'` for limited access

### Protected Routes
Owner-only routes are protected by `OwnerRoute` component and include:
- Modifiers Management
- Inventory Management
- Purchases
- Expenses
- Waste Logs
- Business Reports

## Features

### 1. Modifier Management (Owner Only)
**Path**: `/admin/modifiers`

Manage add-ons and options for menu items:
- Create modifiers linked to menu items
- Set additional prices
- Control availability
- Organize by menu item
- Soft delete

**Use Cases**:
- Extra cheese (+$2.00)
- Large size (+$3.50)
- Extra toppings
- Special preparations

### 2. Inventory Management (Owner Only)
**Path**: `/admin/inventory`

Comprehensive ingredient and recipe management:

**Ingredients Tab**:
- Track all ingredients with units (kg, g, l, ml, unit)
- Set cost per unit
- Monitor current stock levels
- Define reorder levels
- Manage supplier information
- Low stock alerts

**Recipes Tab**:
- Link ingredients to menu items
- Define quantity needed per item
- Calculate COGS automatically
- Manage ingredient requirements

**Features**:
- Automatic stock updates
- Reorder alerts when stock ≤ reorder level
- Dual-view interface
- Supplier tracking

### 3. Purchases Management (Owner Only)
**Path**: `/admin/purchases`

Track supplier orders and inventory replenishment:

**Features**:
- Create purchase orders with multiple items
- Link to ingredients
- Track supplier information
- Monitor purchase status (pending/received/cancelled)
- Automatic stock updates when marked as received
- Auto-calculate totals

**Workflow**:
1. Create new purchase order
2. Select ingredients and quantities
3. Enter unit costs
4. Save as "pending"
5. Mark as "received" to update stock

**Auto-Generated Numbers**: PUR000001, PUR000002, etc.

### 4. Expenses Management (Owner Only)
**Path**: `/admin/expenses`

Track all business expenses:

**Categories**:
- Operational (day-to-day operations)
- Administrative (office, admin costs)
- Utilities (electricity, water, internet)
- Maintenance (repairs, upkeep)
- Marketing (advertising, promotions)
- Other

**Features**:
- Expense entry with categories
- Date filtering (today, week, month, all)
- Category filtering
- Payment method tracking
- Summary cards by category
- Total expense calculations

**Auto-Generated Numbers**: EXP000001, EXP000002, etc.

### 5. Waste Logs (Owner Only)
**Path**: `/admin/waste`

Track ingredient waste and spoilage:

**Waste Reasons**:
- Spoiled (gone bad)
- Expired (past expiration date)
- Damaged (physical damage)
- Overproduction (excess prep)
- Other

**Features**:
- Log waste with quantities
- Automatic stock deduction
- Waste statistics by reason
- Top wasted ingredients
- Date filtering
- Cost tracking

**Analytics**:
- Waste by reason breakdown
- Top 5 wasted ingredients
- Historical tracking

### 6. Business Reports (Owner Only)
**Path**: `/admin/reports`

Unified reporting dashboard with 4 report types:

#### 6.1 Business Day Reports
- Daily sales summaries
- Transaction counts
- Payment method breakdown (cash, card, transfer)
- Day-by-day comparison
- Aggregate totals

#### 6.2 Sales Reports by Order Type
- Sales breakdown by:
  - Dine-in
  - Takeaway
  - Delivery
- Order counts per type
- Average order value
- Discount tracking
- Tax collected

#### 6.3 Tax Collected Reports
- Total tax collected (14% on dine-in)
- Tax by date breakdown
- Order count with tax
- Historical tracking

#### 6.4 Profit Analysis
Comprehensive profitability reporting:
- **Total Revenue**: All completed orders
- **COGS**: Calculated from recipes and ingredient costs
- **Operating Expenses**: From expenses table
- **Gross Profit**: Revenue - COGS
- **Net Profit**: Gross Profit - Expenses
- **Profit Margin %**: (Net Profit / Revenue) × 100

**Date Range Filtering**: All reports support custom date ranges

## Database Schema

### New Tables

#### `modifiers`
- Links to `menu_items`
- Stores additional prices
- Availability control

#### `ingredients`
- Name, unit, cost per unit
- Current stock tracking
- Reorder levels
- Supplier information

#### `recipes`
- Links ingredients to menu items
- Quantity needed per item
- Used for COGS calculation

#### `purchases`
- Purchase orders
- Supplier tracking
- Status management
- Auto-generated numbers

#### `purchase_items`
- Individual items in purchase
- Quantity and cost tracking
- Links to ingredients

#### `expenses`
- Category-based expense tracking
- Date and payment method
- Auto-generated numbers

#### `waste_logs`
- Ingredient waste tracking
- Reason codes
- Auto stock deduction

### Database Triggers

#### Stock Management
1. **Purchase Received**: Updates ingredient stock when purchase status = 'received'
2. **Waste Logged**: Deducts stock when waste is logged
3. **Print Kitchen**: Deducts stock based on recipes (from POS system)

#### Total Calculations
1. **Purchase Totals**: Auto-calculates total from purchase items
2. **Order Totals**: Auto-calculates from order items (POS)

### Views

#### `sales_by_order_type`
Pre-calculated sales breakdowns by session type

#### `tax_collected_summary`
Aggregated tax data by date

#### `low_stock_ingredients`
Ingredients at or below reorder level

## Business Logic

### Tax Calculation
- **14% tax** applied only to dine-in orders
- Tax calculated after discount
- Formula: (Subtotal - Discount) × 0.14

### Inventory Deduction
- Stock deducted when:
  1. Kitchen ticket printed (POS)
  2. Waste logged
- Stock increased when:
  1. Purchase marked as received

### COGS Calculation
```
For each order item:
  COGS = Sum of (ingredient quantity × cost per unit)
  Total COGS = Sum across all order items
```

### Profit Calculation
```
Gross Profit = Revenue - COGS
Net Profit = Gross Profit - Expenses
Profit Margin = (Net Profit / Revenue) × 100
```

### Soft Delete
All tables use `is_deleted` flag instead of hard deletes:
- Maintains data integrity
- Preserves audit trail
- Allows recovery if needed

## UI Features

### Navigation
- Owner-only items marked with 👑 crown icon
- Purple styling for owner-only sections
- Filtered based on user role
- POS highlighted in green

### Responsive Design
- Mobile-friendly interfaces
- Adaptive layouts
- Overflow handling for tables

### Loading States
- Global loading indicator
- Skeleton screens where appropriate
- Progress feedback

### Form Validation
- Required field indicators
- Type validation (numbers, dates)
- Unique constraints

## Integration with POS

The admin dashboard seamlessly integrates with the POS system:

1. **Menu Items**: Managed in admin, used in POS
2. **Modifiers**: Created in admin, selectable in POS
3. **Inventory**: Tracked in admin, deducted in POS
4. **Orders**: Created in POS, reported in admin
5. **Business Days**: Managed in POS, reported in admin

## Security

### Authentication
- Requires Supabase authentication
- Session-based access control

### Authorization
- Role-based access (owner vs staff)
- Route-level protection
- Database RLS policies

### Audit Logging
All sensitive actions logged:
- User ID and email
- Action type
- Timestamp
- Related record IDs
- Additional details (JSON)

## Best Practices

### For Owners

1. **Daily Tasks**:
   - Review low stock alerts
   - Check waste logs
   - Monitor expenses

2. **Weekly Tasks**:
   - Review sales reports
   - Analyze profit margins
   - Create purchase orders for low stock

3. **Monthly Tasks**:
   - Comprehensive profit analysis
   - Expense review and categorization
   - Inventory optimization

### For Staff

1. **Manage**:
   - Customer reservations
   - Event requests
   - Menu updates (non-financial)
   - Gallery images

2. **Limited Access**:
   - Cannot view financial data
   - Cannot manage inventory
   - Cannot access reports

## Troubleshooting

### Low Stock Not Showing
- **Check**: Reorder level settings in ingredients
- **Verify**: Current stock is updated

### COGS Not Calculating
- **Ensure**: Recipes are created for menu items
- **Check**: Ingredient costs are entered
- **Verify**: Ingredients have cost_per_unit set

### Reports Showing Zero
- **Check**: Date range includes completed orders
- **Verify**: Orders have status = 'completed'
- **Ensure**: Business days are properly closed

### Owner-Only Pages Not Visible
- **Check**: User role in admin_users table
- **Verify**: Role is set to 'owner' not 'staff'
- **Refresh**: Browser to reload navigation

## Future Enhancements

Potential additions:
- Recipe cost calculator
- Supplier performance tracking
- Predictive ordering based on sales
- Waste reduction recommendations
- Detailed expense categorization
- Budget planning and forecasting
- Inventory valuation reports
- Supplier comparison tools
- Automated reorder suggestions
- Integration with accounting software
