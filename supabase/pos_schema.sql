-- POS System Database Schema
-- This schema supports the complete POS functionality for Plan B Restaurant

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Tables in the restaurant
create table if not exists tables (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique,
  qr_enabled boolean not null default true,
  status text not null default 'available' check (status in ('available', 'occupied', 'reserved', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders (sessions)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  table_id uuid references tables(id),
  session_type text not null check (session_type in ('dine_in', 'takeaway', 'delivery', 'qr_order')),
  customer_name text,
  customer_phone text,
  customer_address text,
  delivery_fee numeric(10,2) default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  subtotal numeric(10,2) not null default 0,
  discount_percent numeric(5,2) default 0,
  discount_amount numeric(10,2) default 0,
  tax_amount numeric(10,2) default 0,
  total numeric(10,2) not null default 0,
  notes text,
  is_qr_order boolean default false,
  qr_order_status text check (qr_order_status in ('pending', 'accepted', 'rejected')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  is_deleted boolean not null default false
);

-- Order items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  item_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null,
  modifications text,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'ready', 'served')),
  printed_at timestamptz,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- Transactions (payments)
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_number text not null unique,
  order_id uuid not null references orders(id),
  amount numeric(10,2) not null,
  payment_method text not null check (payment_method in ('cash', 'card', 'transfer', 'other')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'refunded')),
  reference_number text,
  created_by uuid,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- Business days
create table if not exists business_days (
  id uuid primary key default gen_random_uuid(),
  opened_at timestamptz not null,
  closed_at timestamptz,
  opening_balance numeric(10,2) default 0,
  closing_balance numeric(10,2) default 0,
  total_sales numeric(10,2) default 0,
  total_transactions integer default 0,
  cash_sales numeric(10,2) default 0,
  card_sales numeric(10,2) default 0,
  transfer_sales numeric(10,2) default 0,
  other_sales numeric(10,2) default 0,
  opened_by uuid,
  closed_by uuid,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Inventory
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id),
  quantity numeric(10,2) not null default 0,
  unit text not null default 'unit',
  low_stock_threshold numeric(10,2) default 10,
  updated_at timestamptz not null default now(),
  is_active boolean not null default true,
  unique(menu_item_id)
);

-- Audit logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  table_name text,
  record_id uuid,
  user_id uuid,
  user_email text,
  details jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- Table merge history
create table if not exists table_merges (
  id uuid primary key default gen_random_uuid(),
  source_table_id uuid not null references tables(id),
  target_order_id uuid not null references orders(id),
  merged_by uuid,
  merged_at timestamptz not null default now()
);

-- Bill splits
create table if not exists bill_splits (
  id uuid primary key default gen_random_uuid(),
  original_order_id uuid not null references orders(id),
  split_order_id uuid not null references orders(id),
  split_by uuid,
  split_at timestamptz not null default now()
);

-- Create indexes for better performance
create index if not exists idx_orders_table_id on orders(table_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_session_type on orders(session_type);
create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_menu_item_id on order_items(menu_item_id);
create index if not exists idx_transactions_order_id on transactions(order_id);
create index if not exists idx_audit_logs_created_at on audit_logs(created_at);
create index if not exists idx_audit_logs_user_id on audit_logs(user_id);
create index if not exists idx_business_days_is_active on business_days(is_active);

-- Enable Row Level Security
alter table tables enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table transactions enable row level security;
alter table business_days enable row level security;
alter table inventory enable row level security;
alter table audit_logs enable row level security;
alter table table_merges enable row level security;
alter table bill_splits enable row level security;

-- RLS Policies for authenticated users (cashiers/admin)
create policy "authenticated users can view tables"
  on tables for select
  to authenticated
  using (true);

create policy "authenticated users can manage tables"
  on tables for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can view orders"
  on orders for select
  to authenticated
  using (true);

create policy "authenticated users can manage orders"
  on orders for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can view order items"
  on order_items for select
  to authenticated
  using (true);

create policy "authenticated users can manage order items"
  on order_items for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can view transactions"
  on transactions for select
  to authenticated
  using (true);

create policy "authenticated users can manage transactions"
  on transactions for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can view business days"
  on business_days for select
  to authenticated
  using (true);

create policy "authenticated users can manage business days"
  on business_days for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can view inventory"
  on inventory for select
  to authenticated
  using (true);

create policy "authenticated users can manage inventory"
  on inventory for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can view audit logs"
  on audit_logs for select
  to authenticated
  using (true);

create policy "authenticated users can create audit logs"
  on audit_logs for insert
  to authenticated
  with check (true);

create policy "authenticated users can view table merges"
  on table_merges for select
  to authenticated
  using (true);

create policy "authenticated users can create table merges"
  on table_merges for insert
  to authenticated
  with check (true);

create policy "authenticated users can view bill splits"
  on bill_splits for select
  to authenticated
  using (true);

create policy "authenticated users can create bill splits"
  on bill_splits for insert
  to authenticated
  with check (true);

-- Function to generate order number
create or replace function generate_order_number()
returns text as $$
declare
  new_number text;
  counter integer;
begin
  select coalesce(max(cast(substring(order_number from 4) as integer)), 0) + 1
  into counter
  from orders
  where order_number like 'ORD%'
    and created_at >= current_date;
  
  new_number := 'ORD' || lpad(counter::text, 6, '0');
  return new_number;
end;
$$ language plpgsql;

-- Function to generate transaction number
create or replace function generate_transaction_number()
returns text as $$
declare
  new_number text;
  counter integer;
begin
  select coalesce(max(cast(substring(transaction_number from 4) as integer)), 0) + 1
  into counter
  from transactions
  where transaction_number like 'TXN%'
    and created_at >= current_date;
  
  new_number := 'TXN' || lpad(counter::text, 6, '0');
  return new_number;
end;
$$ language plpgsql;

-- Function to update order totals
create or replace function update_order_totals()
returns trigger as $$
declare
  order_subtotal numeric(10,2);
  order_record record;
  target_order_id uuid;
begin
  -- Determine which order_id to use
  if TG_OP = 'DELETE' then
    target_order_id := OLD.order_id;
  else
    target_order_id := NEW.order_id;
  end if;
  
  -- Calculate subtotal from order items
  select coalesce(sum(total_price), 0)
  into order_subtotal
  from order_items
  where order_id = target_order_id and is_deleted = false;
  
  -- Get order details
  select * into order_record from orders where id = target_order_id;
  
  -- Update order totals
  update orders
  set
    subtotal = order_subtotal,
    discount_amount = order_subtotal * (discount_percent / 100),
    tax_amount = case
      when session_type = 'dine_in' then
        (order_subtotal - (order_subtotal * (discount_percent / 100))) * 0.14
      else 0
    end,
    total = case
      when session_type = 'dine_in' then
        order_subtotal - (order_subtotal * (discount_percent / 100)) + 
        ((order_subtotal - (order_subtotal * (discount_percent / 100))) * 0.14) +
        coalesce(delivery_fee, 0)
      else
        order_subtotal - (order_subtotal * (discount_percent / 100)) + coalesce(delivery_fee, 0)
    end,
    updated_at = now()
  where id = target_order_id;
  
  return NEW;
end;
$$ language plpgsql;

-- Trigger to update order totals when items change
drop trigger if exists update_order_totals_trigger on order_items;
create trigger update_order_totals_trigger
  after insert or update or delete on order_items
  for each row
  execute function update_order_totals();

-- Function to deduct inventory on print
create or replace function deduct_inventory_on_print()
returns trigger as $$
begin
  if NEW.printed_at is not null and OLD.printed_at is null then
    update inventory
    set
      quantity = quantity - NEW.quantity,
      updated_at = now()
    where menu_item_id = NEW.menu_item_id;
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Trigger to deduct inventory when order item is printed
drop trigger if exists deduct_inventory_trigger on order_items;
create trigger deduct_inventory_trigger
  after update on order_items
  for each row
  execute function deduct_inventory_on_print();

-- Insert default tables (10 tables for the restaurant)
insert into tables (number, qr_enabled, status)
select
  generate_series(1, 10),
  true,
  'available'
on conflict (number) do nothing;

-- Insert sample inventory for existing menu items
insert into inventory (menu_item_id, quantity, unit, low_stock_threshold)
select id, 100, 'unit', 10
from menu_items
on conflict (menu_item_id) do nothing;
