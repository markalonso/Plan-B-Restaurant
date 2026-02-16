-- Admin Dashboard Schema Enhancement
-- This schema adds support for owner-only features including modifiers, inventory, purchases, expenses, and reports

-- Add role to admin_users table
alter table if exists admin_users 
add column if not exists role text not null default 'staff' check (role in ('owner', 'staff'));

-- Modifiers for menu items
create table if not exists modifiers (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- Ingredients for inventory management
create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  unit text not null default 'kg',
  cost_per_unit numeric(10,2) not null default 0,
  current_stock numeric(10,2) not null default 0,
  reorder_level numeric(10,2) not null default 10,
  supplier_name text,
  supplier_contact text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- Recipes (link ingredients to menu items with quantities)
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete restrict,
  quantity_needed numeric(10,2) not null check (quantity_needed > 0),
  notes text,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false,
  unique(menu_item_id, ingredient_id)
);

-- Purchases (supplier orders)
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  purchase_number text not null unique,
  supplier_name text not null,
  supplier_contact text,
  total_cost numeric(10,2) not null default 0,
  purchase_date date not null default current_date,
  received_date date,
  status text not null default 'pending' check (status in ('pending', 'received', 'cancelled')),
  notes text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- Purchase items (individual items in a purchase order)
create table if not exists purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references purchases(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id),
  quantity numeric(10,2) not null check (quantity > 0),
  unit_cost numeric(10,2) not null,
  total_cost numeric(10,2) not null,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- Expenses tracking
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  expense_number text not null unique,
  category text not null check (category in ('operational', 'administrative', 'utilities', 'maintenance', 'marketing', 'other')),
  amount numeric(10,2) not null check (amount >= 0),
  description text not null,
  expense_date date not null default current_date,
  payment_method text check (payment_method in ('cash', 'card', 'transfer', 'other')),
  receipt_url text,
  created_by uuid,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- Waste logs
create table if not exists waste_logs (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references ingredients(id),
  quantity numeric(10,2) not null check (quantity > 0),
  reason text not null check (reason in ('spoiled', 'expired', 'damaged', 'overproduction', 'other')),
  description text,
  waste_date date not null default current_date,
  logged_by uuid,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- Indexes for performance
create index if not exists idx_modifiers_menu_item_id on modifiers(menu_item_id);
create index if not exists idx_recipes_menu_item_id on recipes(menu_item_id);
create index if not exists idx_recipes_ingredient_id on recipes(ingredient_id);
create index if not exists idx_purchase_items_purchase_id on purchase_items(purchase_id);
create index if not exists idx_purchase_items_ingredient_id on purchase_items(ingredient_id);
create index if not exists idx_expenses_date on expenses(expense_date);
create index if not exists idx_expenses_category on expenses(category);
create index if not exists idx_waste_logs_ingredient_id on waste_logs(ingredient_id);
create index if not exists idx_waste_logs_date on waste_logs(waste_date);

-- Enable Row Level Security
alter table modifiers enable row level security;
alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table purchases enable row level security;
alter table purchase_items enable row level security;
alter table expenses enable row level security;
alter table waste_logs enable row level security;

-- RLS Policies - Owner only access
create policy "authenticated users can view modifiers"
  on modifiers for select
  to authenticated
  using (true);

create policy "owners can manage modifiers"
  on modifiers for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "authenticated users can view ingredients"
  on ingredients for select
  to authenticated
  using (true);

create policy "owners can manage ingredients"
  on ingredients for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "authenticated users can view recipes"
  on recipes for select
  to authenticated
  using (true);

create policy "owners can manage recipes"
  on recipes for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "owners can view purchases"
  on purchases for select
  to authenticated
  using (is_admin());

create policy "owners can manage purchases"
  on purchases for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "owners can view purchase items"
  on purchase_items for select
  to authenticated
  using (is_admin());

create policy "owners can manage purchase items"
  on purchase_items for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "owners can view expenses"
  on expenses for select
  to authenticated
  using (is_admin());

create policy "owners can manage expenses"
  on expenses for all
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "owners can view waste logs"
  on waste_logs for select
  to authenticated
  using (is_admin());

create policy "owners can manage waste logs"
  on waste_logs for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- Function to generate purchase number
create or replace function generate_purchase_number()
returns text as $$
declare
  new_number text;
  counter integer;
begin
  select coalesce(max(cast(substring(purchase_number from 4) as integer)), 0) + 1
  into counter
  from purchases
  where purchase_number like 'PUR%'
    and created_at >= current_date;
  
  new_number := 'PUR' || lpad(counter::text, 6, '0');
  return new_number;
end;
$$ language plpgsql;

-- Function to generate expense number
create or replace function generate_expense_number()
returns text as $$
declare
  new_number text;
  counter integer;
begin
  select coalesce(max(cast(substring(expense_number from 4) as integer)), 0) + 1
  into counter
  from expenses
  where expense_number like 'EXP%'
    and created_at >= current_date;
  
  new_number := 'EXP' || lpad(counter::text, 6, '0');
  return new_number;
end;
$$ language plpgsql;

-- Function to update purchase totals
create or replace function update_purchase_totals()
returns trigger as $$
declare
  purchase_total numeric(10,2);
begin
  select coalesce(sum(total_cost), 0)
  into purchase_total
  from purchase_items
  where purchase_id = NEW.purchase_id and is_deleted = false;
  
  update purchases
  set total_cost = purchase_total, updated_at = now()
  where id = NEW.purchase_id;
  
  return NEW;
end;
$$ language plpgsql;

-- Trigger to update purchase totals when items change
drop trigger if exists update_purchase_totals_trigger on purchase_items;
create trigger update_purchase_totals_trigger
  after insert or update or delete on purchase_items
  for each row
  execute function update_purchase_totals();

-- Function to update ingredient stock on purchase received
create or replace function update_ingredient_stock_on_purchase()
returns trigger as $$
begin
  if NEW.status = 'received' and (OLD.status is null or OLD.status != 'received') then
    update ingredients i
    set current_stock = i.current_stock + pi.quantity,
        updated_at = now()
    from purchase_items pi
    where pi.purchase_id = NEW.id
      and pi.ingredient_id = i.id
      and pi.is_deleted = false;
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Trigger to update ingredient stock when purchase is received
drop trigger if exists update_stock_on_purchase_trigger on purchases;
create trigger update_stock_on_purchase_trigger
  after update on purchases
  for each row
  execute function update_ingredient_stock_on_purchase();

-- Function to deduct ingredient stock on waste log
create or replace function deduct_ingredient_stock_on_waste()
returns trigger as $$
begin
  update ingredients
  set current_stock = current_stock - NEW.quantity,
      updated_at = now()
  where id = NEW.ingredient_id;
  
  return NEW;
end;
$$ language plpgsql;

-- Trigger to deduct stock when waste is logged
drop trigger if exists deduct_stock_on_waste_trigger on waste_logs;
create trigger deduct_stock_on_waste_trigger
  after insert on waste_logs
  for each row
  execute function deduct_ingredient_stock_on_waste();

-- Views for reporting

-- Sales by order type view
create or replace view sales_by_order_type as
select
  session_type,
  count(*) as order_count,
  sum(subtotal) as total_subtotal,
  sum(discount_amount) as total_discount,
  sum(tax_amount) as total_tax,
  sum(total) as total_sales,
  date_trunc('day', completed_at) as sales_date
from orders
where status = 'completed' and is_deleted = false
group by session_type, date_trunc('day', completed_at);

-- Tax collected view
create or replace view tax_collected_summary as
select
  date_trunc('day', completed_at) as tax_date,
  sum(tax_amount) as total_tax_collected,
  count(*) as order_count
from orders
where status = 'completed' and is_deleted = false and tax_amount > 0
group by date_trunc('day', completed_at)
order by tax_date desc;

-- Low stock ingredients view
create or replace view low_stock_ingredients as
select
  id,
  name,
  unit,
  current_stock,
  reorder_level,
  cost_per_unit,
  supplier_name,
  (reorder_level - current_stock) as shortage
from ingredients
where current_stock <= reorder_level and is_deleted = false
order by (reorder_level - current_stock) desc;
