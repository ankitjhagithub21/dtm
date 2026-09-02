export type MenuCategory = "Momos" | "Sandwiches" | "Burgers" | "Soya Chaap";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  badge?: string; // e.g. "Bestseller", "New", "Spicy"
  isVeg: boolean;
}

export const categories: MenuCategory[] = [
  "Momos",
  "Sandwiches",
  "Burgers",
  "Soya Chaap",
];

export const menuItems: MenuItem[] = [
  // ── Momos ──────────────────────────────────────
  {
    id: "tandoori-momos",
    name: "Tandoori Momos",
    description:
      "Flame-kissed momos marinated in smoky tandoori spices, charred to perfection in a clay oven and served with fiery red chutney.",
    price: 139,
    category: "Momos",
    image:
      "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&h=400&fit=crop&q=80",
    badge: "Bestseller",
    isVeg: true,
  },
  {
    id: "afgani-momos",
    name: "Afgani Momos",
    description:
      "Creamy, rich and utterly indulgent momos drenched in a velvety cashew-cream sauce with aromatic green cardamom.",
    price: 149,
    category: "Momos",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop&q=80",
    badge: "Chef's Pick",
    isVeg: true,
  },
  {
    id: "achari-momos",
    name: "Achari Momos",
    description:
      "Tangy pickle-spiced momos bursting with the bold flavours of mustard seeds, fennel and nigella — a street-food twist you won't forget.",
    price: 149,
    category: "Momos",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop&q=80",
    badge: "Spicy",
    isVeg: true,
  },

  // ── Sandwiches ─────────────────────────────────
  {
    id: "veg-sandwich",
    name: "Veg Sandwich",
    description:
      "Layers of crisp seasonal vegetables, zesty mint chutney and melted cheese pressed between golden-toasted artisan bread.",
    price: 99,
    category: "Sandwiches",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop&q=80",
    isVeg: true,
  },
  {
    id: "paneer-sandwich",
    name: "Paneer Sandwich",
    description:
      "Thick-cut spiced paneer tikka slabs with caramelised onions, bell peppers and smoky chipotle mayo on sourdough.",
    price: 119,
    category: "Sandwiches",
    image:
      "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=600&h=400&fit=crop&q=80",
    badge: "New",
    isVeg: true,
  },

  // ── Burgers ────────────────────────────────────
  {
    id: "veg-burger",
    name: "Veg Burger",
    description:
      "A crunchy spiced potato-pea patty loaded with fresh lettuce, tomato, pickled jalapeños and our secret tandoori sauce.",
    price: 69,
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop&q=80",
    isVeg: true,
  },
  {
    id: "paneer-burger",
    name: "Paneer Burger",
    description:
      "Marinated paneer steak grilled over open flames, topped with smoked gouda, rocket leaves and a drizzle of saffron aioli.",
    price: 79,
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=80",
    badge: "Popular",
    isVeg: true,
  },

  // ── Soya Chaap ─────────────────────────────────
  {
    id: "soya-chaap",
    name: "Soya Chaap",
    description:
      "Succulent soya chaap skewers slow-roasted in a robust blend of Kashmiri chilli, yoghurt and garam masala — smoky, tender and addictive.",
    price: 179,
    category: "Soya Chaap",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop&q=80",
    badge: "Must Try",
    isVeg: true,
  },
];
