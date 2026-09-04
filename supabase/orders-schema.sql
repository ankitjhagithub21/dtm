create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  address text not null,
  landmark text,
  special_instructions text,
  payment_method text not null check (payment_method in ('cod', 'online')),
  subtotal integer not null,
  delivery_fee integer not null default 0,
  total integer not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  estimated_time text default '30-40 minutes',
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  menu_item_slug text,
  name text not null,
  price integer not null,
  quantity integer not null check (quantity > 0)
);

create index if not exists orders_order_number_idx on public.orders(order_number);
create index if not exists orders_phone_idx on public.orders(phone);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Guests can create orders" on public.orders;
create policy "Guests can create orders"
  on public.orders
  for insert
  to anon
  with check (user_id is null);

drop policy if exists "Guests can view orders by order number" on public.orders;
create policy "Guests can view orders by order number"
  on public.orders
  for select
  to anon
  using (order_number is not null);

drop policy if exists "Guests can create order items" on public.order_items;
create policy "Guests can create order items"
  on public.order_items
  for insert
  to anon
  with check (true);

drop policy if exists "Guests can view order items for confirmation" on public.order_items;
create policy "Guests can view order items for confirmation"
  on public.order_items
  for select
  to anon
  using (true);
