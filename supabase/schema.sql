create extension if not exists "pgcrypto";

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  price integer not null,
  category text not null check (category in ('Momos', 'Sandwiches', 'Burgers', 'Soya Chaap')),
  image_url text not null,
  badge text,
  is_veg boolean not null default true,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

drop policy if exists "Public can view available menu items" on public.menu_items;
create policy "Public can view available menu items"
  on public.menu_items
  for select
  to anon
  using (is_available = true);

insert into public.menu_items (
  slug, name, description, price, category, image_url, badge, is_veg, is_available, sort_order
) values
  (
    'tandoori-momos',
    'Tandoori Momos',
    'Flame-kissed momos marinated in smoky tandoori spices, charred to perfection in a clay oven and served with fiery red chutney.',
    139, 'Momos',
    'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&h=400&fit=crop&q=80',
    'Bestseller', true, true, 1
  ),
  (
    'afgani-momos',
    'Afgani Momos',
    'Creamy, rich and utterly indulgent momos drenched in a velvety cashew-cream sauce with aromatic green cardamom.',
    149, 'Momos',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop&q=80',
    'Chef''s Pick', true, true, 2
  ),
  (
    'achari-momos',
    'Achari Momos',
    'Tangy pickle-spiced momos bursting with the bold flavours of mustard seeds, fennel and nigella — a street-food twist you won''t forget.',
    149, 'Momos',
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop&q=80',
    'Spicy', true, true, 3
  ),
  (
    'veg-sandwich',
    'Veg Sandwich',
    'Layers of crisp seasonal vegetables, zesty mint chutney and melted cheese pressed between golden-toasted artisan bread.',
    99, 'Sandwiches',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop&q=80',
    null, true, true, 4
  ),
  (
    'paneer-sandwich',
    'Paneer Sandwich',
    'Thick-cut spiced paneer tikka slabs with caramelised onions, bell peppers and smoky chipotle mayo on sourdough.',
    119, 'Sandwiches',
    'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=600&h=400&fit=crop&q=80',
    'New', true, true, 5
  ),
  (
    'veg-burger',
    'Veg Burger',
    'A crunchy spiced potato-pea patty loaded with fresh lettuce, tomato, pickled jalapeños and our secret tandoori sauce.',
    69, 'Burgers',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop&q=80',
    null, true, true, 6
  ),
  (
    'paneer-burger',
    'Paneer Burger',
    'Marinated paneer steak grilled over open flames, topped with smoked gouda, rocket leaves and a drizzle of saffron aioli.',
    79, 'Burgers',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=80',
    'Popular', true, true, 7
  ),
  (
    'soya-chaap',
    'Soya Chaap',
    'Succulent soya chaap skewers slow-roasted in a robust blend of Kashmiri chilli, yoghurt and garam masala — smoky, tender and addictive.',
    179, 'Soya Chaap',
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop&q=80',
    'Must Try', true, true, 8
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category = excluded.category,
  image_url = excluded.image_url,
  badge = excluded.badge,
  is_veg = excluded.is_veg,
  is_available = excluded.is_available,
  sort_order = excluded.sort_order;
