# POS System Documentation

## Overview
The Point of Sale (POS) system provides comprehensive order management for Plan B Restaurant with support for dine-in, takeaway, and delivery orders.

## Features

### 1. Table Management
- Visual table grid with real-time status indicators
  - 🟢 Green: Available
  - 🔴 Red: Occupied
  - 🟡 Yellow: Reserved
  - ⚪ Gray: Disabled
- QR code enable/disable per table
- Pending QR order count badges

### 2. Order Types
- **Dine-in**: Table-based orders with 14% tax
- **Takeaway**: Quick orders without tax
- **Delivery**: Orders with customer details and delivery fee

### 3. QR Order Management
- View all pending QR orders
- Accept or reject customer orders
- Real-time order notifications

### 4. Menu Item Selection
- Category-based filtering
- Search functionality
- Quick add to order
- Image display with pricing

### 5. Order Management
- Add/remove items
- Adjust quantities
- Apply modifications
- Real-time total calculations

### 6. Discount System
- **Cashier**: Maximum 15% discount
- **Owner**: Unlimited discount
- Applied after subtotal, before tax

### 7. Payment & Billing
- Close & Pay workflow
- Multiple payment methods (Cash, Card, Transfer)
- Automatic transaction logging

### 8. Advanced Features
- **Split Bill**: Divide order into multiple bills
- **Merge Tables**: Combine orders from different tables
- **Print Kitchen Ticket**: Send orders to kitchen with inventory deduction
- **Print Receipt**: Generate customer receipt

### 9. Business Day Management
- Open business day with opening balance
- End-of-day report with breakdown by:
  - Total transactions
  - Payment method totals
  - Cash reconciliation
- Close business day

## Tax Calculation
```
Subtotal = Sum of all items
Discount Amount = Subtotal × (Discount % / 100)
After Discount = Subtotal - Discount Amount
Tax = After Discount × 0.14 (only for dine_in)
Total = After Discount + Tax + Delivery Fee
```

## Business Logic

### Inventory Management
- Inventory is deducted **only when kitchen ticket is printed**
- Prevents premature inventory reduction
- Tracks printed items to avoid double deduction

### Soft Delete
- No hard deletes in the system
- Records marked with `is_deleted = true`
- Maintains data integrity and audit trail

### Audit Logging
All critical actions are logged:
- Order creation/modification
- Discount applications
- Table merges
- Bill splits
- Business day open/close
- QR order acceptance/rejection

## Database Schema

### Core Tables
- `tables`: Restaurant table information
- `orders`: Order sessions with totals
- `order_items`: Individual items in orders
- `transactions`: Payment records
- `business_days`: Daily operations tracking
- `inventory`: Stock levels
- `audit_logs`: Complete action history
- `table_merges`: Table merge history
- `bill_splits`: Bill split history

## Access Control
- POS requires authentication (AdminRoute)
- Role-based discount limits
- All actions tied to authenticated user

## Print Layouts

### Kitchen Ticket
- Large, readable format for kitchen staff
- Shows order number, table, time
- Lists items with quantities
- Highlights special modifications
- Marks printed items

### Receipt
- Professional customer receipt
- Restaurant information
- Order details and totals
- Tax breakdown
- Payment information
- Thank you message

## Usage

### Opening a Business Day
1. Click "Business Day" button
2. Enter opening cash balance
3. Click "Open Business Day"

### Creating a Dine-in Order
1. Click on an available table
2. System creates new order
3. Select menu items
4. Manage order in right panel

### Creating Takeaway/Delivery
1. Click "New Takeaway" or "New Delivery"
2. For delivery, enter customer details
3. Select menu items
4. Process payment

### Managing QR Orders
1. Click "QR Orders" badge in header
2. Review pending orders
3. Accept or reject each order
4. Accepted orders become regular orders

### Printing Kitchen Ticket
1. Open order
2. Click "Print Kitchen"
3. Review items to be printed
4. Click "Print Kitchen Ticket"
5. Inventory automatically deducted

### Closing an Order
1. Click "Close & Pay"
2. Confirm payment
3. System generates transaction
4. Print receipt if needed
5. Table status updated to available

### End of Day
1. Click "Business Day" button
2. Review sales report
3. Verify cash count
4. Click "Close Business Day"

## API Endpoints (Supabase)

All operations use Supabase client with the following tables:
- `tables` - CRUD operations
- `orders` - CRUD + RPC functions
- `order_items` - CRUD
- `transactions` - CRUD + RPC functions
- `business_days` - CRUD
- `inventory` - Read + Auto-update via trigger
- `audit_logs` - Create only

## Troubleshooting

### Business Day Not Open
- **Issue**: Cannot create orders
- **Solution**: Open a business day first

### Inventory Not Deducting
- **Check**: Items must be printed (kitchen ticket)
- **Verify**: inventory table has records for menu items

### Tax Not Calculating
- **Check**: Order type must be `dine_in`
- **Verify**: Tax is applied after discount

## Future Enhancements
- Table reservation integration
- Kitchen display system (KDS)
- Advanced reporting and analytics
- Multi-user concurrency handling
- Customer loyalty program integration
- Online order integration
