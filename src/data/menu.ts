export type MenuVariant = {
  name: string
  price: number
}

export type MenuItem = {
  id: string
  name: string
  category: string
  variants: MenuVariant[]
}

export const menuItems: MenuItem[] = [
  // VALUE BURGERS
  {
    id: 'potato-krunch',
    name: 'Potato Krunch',
    category: 'Value Burgers',
    variants: [
      { name: '1 Burger', price: 49 },
      { name: '2 Burgers', price: 89 },
    ],
  },
  {
    id: 'veg-punjabi-makhani',
    name: 'Veg Punjabi Makhani',
    category: 'Value Burgers',
    variants: [
      { name: '1 Burger', price: 89 },
      { name: '2 Burgers', price: 169 },
    ],
  },
  {
    id: 'egg-twisted',
    name: 'Egg Twisted',
    category: 'Value Burgers',
    variants: [
      { name: '1 Burger', price: 99 },
      { name: '2 Burgers', price: 189 },
    ],
  },
  {
    id: 'krunchy-chicken',
    name: 'Krunchy Chicken',
    category: 'Value Burgers',
    variants: [
      { name: '1 Burger', price: 119 },
      { name: '2 Burgers', price: 209 },
    ],
  },

  // WINGS
  {
    id: 'fried-wings',
    name: 'Fried Wings',
    category: 'Wings',
    variants: [
      { name: 'Classic - 4 pcs', price: 159 },
      { name: 'Classic - 6 pcs', price: 219 },
      { name: 'Peri Peri - 4 pcs', price: 169 },
      { name: 'Peri Peri - 6 pcs', price: 229 },
    ],
  },
  {
    id: 'grilled-wings',
    name: 'Grilled Wings',
    category: 'Wings',
    variants: [
      { name: 'Classic - 2 pcs', price: 209 },
      { name: 'Classic - 4 pcs', price: 329 },
      { name: 'Peri Peri - 2 pcs', price: 219 },
      { name: 'Peri Peri - 4 pcs', price: 349 },
    ],
  },

  // QUICK BITES
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    category: 'Quick Bites',
    variants: [
      { name: '6 pcs', price: 149 },
      { name: '9 pcs', price: 199 },
    ],
  },
  {
    id: 'chicken-bites',
    name: 'Chicken Bites',
    category: 'Quick Bites',
    variants: [
      { name: '6 pcs', price: 159 },
      { name: '9 pcs', price: 219 },
    ],
  },
  {
    id: 'crispy-potato-strips',
    name: 'Crispy Potato Strips',
    category: 'Quick Bites',
    variants: [
      { name: '6 pcs', price: 99 },
      { name: '9 pcs', price: 129 },
    ],
  },
  {
    id: 'hash-brown-nuggets',
    name: 'Hash Brown Nuggets',
    category: 'Quick Bites',
    variants: [
      { name: '6 pcs', price: 99 },
      { name: '9 pcs', price: 119 },
    ],
  },
  {
    id: 'chicken-tenders',
    name: 'Chicken Tenders',
    category: 'Quick Bites',
    variants: [
      { name: 'Classic - 3 pcs', price: 169 },
      { name: 'Classic - 5 pcs', price: 249 },
      { name: 'Peri Peri - 3 pcs', price: 179 },
      { name: 'Peri Peri - 5 pcs', price: 259 },
    ],
  },
  {
    id: 'chicken-popcorn',
    name: 'Chicken Popcorn',
    category: 'Quick Bites',
    variants: [
      { name: 'Regular', price: 199 },
      { name: 'Big', price: 299 },
    ],
  },

  // BEAMER
  {
    id: 'beamer',
    name: 'Beamer',
    category: 'Beamer',
    variants: [
      { name: 'Classic Veg', price: 219 },
      { name: 'Classic Chicken', price: 259 },
      { name: 'Cheese Veg', price: 289 },
      { name: 'Cheese Chicken', price: 299 },
    ],
  },

  // THE ORIGINAL
  {
    id: 'the-original',
    name: 'The Original',
    category: 'The Original',
    variants: [
      { name: 'Classic Chicken', price: 289 },
      { name: 'Classic Lamb', price: 359 },
      { name: 'Spicy Chicken', price: 299 },
      { name: 'Spicy Lamb', price: 379 },
      { name: 'Smoked Whole Meat', price: 329 },
    ],
  },

  // BIGG KRUNCH
  {
    id: 'bigg-krunch',
    name: 'Bigg Krunch',
    category: 'Bigg Krunch',
    variants: [
      { name: 'Chicken Burger', price: 229 },
      { name: 'Chicken Meal', price: 378 },
      { name: 'Cheese Chicken Burger', price: 259 },
      { name: 'Cheese Chicken Meal', price: 408 },
      { name: 'Veg Burger', price: 229 },
      { name: 'Veg Meal', price: 378 },
    ],
  },
  {
    id: 'bigg-paneer',
    name: 'Bigg Paneer',
    category: 'Bigg Krunch',
    variants: [
      { name: 'Burger', price: 219 },
      { name: 'Meal', price: 368 },
    ],
  },
  {
    id: 'bigg-cheese-bomb',
    name: 'Bigg Cheese Bomb',
    category: 'Bigg Krunch',
    variants: [
      { name: 'Burger', price: 279 },
      { name: 'Meal', price: 428 },
    ],
  },
  {
    id: 'bigg-club',
    name: 'Bigg Club',
    category: 'Bigg Krunch',
    variants: [
      { name: 'Burger', price: 199 },
      { name: 'Meal', price: 348 },
    ],
  },
  {
    id: 'paneer-twisted',
    name: 'Paneer Twisted',
    category: 'Bigg Krunch',
    variants: [
      { name: 'Burger', price: 239 },
      { name: 'Meal', price: 388 },
    ],
  },
  {
    id: 'paneer-cheese-burst',
    name: 'Paneer Cheese Burst',
    category: 'Bigg Krunch',
    variants: [
      { name: 'Burger', price: 299 },
      { name: 'Meal', price: 448 },
    ],
  },

  // CLASSIC BURGERS
  {
    id: 'exotic-burger',
    name: 'Exotic Burger',
    category: 'Classic Burgers',
    variants: [
      { name: 'Classic Burger', price: 219 },
      { name: 'Classic Meal', price: 368 },
      { name: 'Paneer Burger', price: 249 },
      { name: 'Paneer Meal', price: 398 },
    ],
  },
  {
    id: 'volcano-cheese-burger',
    name: 'Volcano Cheese Burger',
    category: 'Classic Burgers',
    variants: [
      { name: 'Burger', price: 219 },
      { name: 'Meal', price: 368 },
    ],
  },
  {
    id: 'afghani-burger',
    name: 'Afghani Burger',
    category: 'Classic Burgers',
    variants: [
      { name: 'Chicken Burger', price: 199 },
      { name: 'Chicken Meal', price: 348 },
      { name: 'Lamb Burger', price: 259 },
      { name: 'Lamb Meal', price: 408 },
    ],
  },
  {
    id: 'american-cheese-chicken',
    name: 'American Cheese Chicken Burger',
    category: 'Classic Burgers',
    variants: [
      { name: 'Burger', price: 219 },
      { name: 'Meal', price: 368 },
    ],
  },

  // BIGG WRAPS
  {
    id: 'bigg-wraps',
    name: 'Bigg Wraps',
    category: 'Bigg Wraps',
    variants: [
      { name: 'Bigg Club Veg', price: 199 },
      { name: 'Cheese Paneer', price: 249 },
      { name: 'Veg Shroom', price: 189 },
      { name: 'Whole Meat Chicken', price: 219 },
      { name: 'Cheese Chicken', price: 269 },
      { name: 'Krunchy Chicken Wrap', price: 179 },
      { name: 'Egg Wrap', price: 169 },
    ],
  },

  // RICE BOWLS
  {
    id: 'rice-bowls',
    name: 'Rice Bowls',
    category: 'Rice Bowls',
    variants: [
      { name: 'Veg Popcorn Rice Bowl', price: 149 },
      { name: 'Egg Rice Bowl', price: 139 },
      { name: 'Chicken Rice Bowl', price: 189 },
    ],
  },

  // FRIES
  {
    id: 'crinkle-fries',
    name: 'Crinkle Fries',
    category: 'Fries',
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Cheesy', price: 169 },
    ],
  },
  {
    id: 'loaded-fries',
    name: 'Loaded Fries',
    category: 'Fries',
    variants: [
      { name: 'Paneer', price: 219 },
      { name: 'Chicken', price: 219 },
    ],
  },

  // BEVERAGES
  {
    id: 'beverages',
    name: 'Beverages',
    category: 'Beverages',
    variants: [
      { name: 'Lime N Mint', price: 99 },
      { name: 'Blue Heaven', price: 99 },
      { name: 'Coke', price: 99 },
    ],
  },

  // DESSERTS
  {
    id: 'desserts',
    name: 'Desserts',
    category: 'Desserts',
    variants: [
      { name: 'Choco Lava Cake', price: 129 },
      { name: 'Warm Chocolate Brownie', price: 129 },
      { name: 'Warm Chocolate Brownie + Ice Cream', price: 169 },
    ],
  },

  // THICK SHAKES
  {
    id: 'thick-shakes',
    name: 'Thick Shakes',
    category: 'Thick Shakes',
    variants: [
      { name: 'Cold Coffee', price: 139 },
      { name: 'Belgian Chocolate Shake', price: 179 },
      { name: 'Mixberry Shake', price: 179 },
      { name: 'Choco Brownie Shake', price: 179 },
    ],
  },
]

export const addOns: MenuVariant[] = [
  { name: 'Cheese', price: 25 },
  { name: 'Peri Peri', price: 9 },
  { name: 'Water Bottle', price: 29 },
]

export const makeItAMeal = {
  name: 'Make It A Meal',
  originalPrice: 198,
  price: 149,
  options: [
    'Fries + Lime N Mint',
    '1 Piece Wing + Lime N Mint',
  ],
  shakeUpgrade: 40,
}