export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags?: string[];
  calories?: number;
}

export const categories = [
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'sides', name: 'Sides', icon: '🍟' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
  { id: 'desserts', name: 'Desserts', icon: '🍦' },
];

export const products: Product[] = [
  {
    id: 'b1',
    name: 'Midnight Wagyu Burger',
    description: 'Double wagyu beef patties, aged cheddar, caramelized onions, and our secret Ember sauce.',
    price: 18.50,
    category: 'burgers',
    image: '/images/burger-1.jpg',
    tags: ['Bestseller', 'Chef Choice'],
    calories: 850
  },
  {
    id: 'b2',
    name: 'Ember Spicy Chicken',
    description: 'Crispy buttermilk chicken breast, spicy aioli, pickles, and shredded lettuce on brioche.',
    price: 14.99,
    category: 'burgers',
    image: '/images/chicken-1.jpg',
    tags: ['Spicy'],
    calories: 720
  },
  {
    id: 'b3',
    name: 'Truffle Mushroom Swiss',
    description: 'Premium beef patty, sautéed balsamic mushrooms, Swiss cheese, and truffle mayo.',
    price: 16.99,
    category: 'burgers',
    image: '/images/burger-2.jpg',
    calories: 780
  },
  {
    id: 's1',
    name: 'Charcoal Fries',
    description: 'Triple-cooked fries with a dusting of activated charcoal sea salt.',
    price: 5.50,
    category: 'sides',
    image: '/images/fries-1.jpg',
    tags: ['Unique'],
    calories: 320
  },
  {
    id: 's2',
    name: 'Truffle Mac & Cheese',
    description: 'Velvety cheese sauce, white truffle oil, and a panko crust.',
    price: 8.99,
    category: 'sides',
    image: '/images/mac-1.jpg',
    calories: 450
  },
  {
    id: 'd1',
    name: 'Smoked Vanilla Shake',
    description: 'House-made vanilla bean ice cream with a hint of hickory smoke.',
    price: 7.50,
    category: 'drinks',
    image: '/images/shake-1.jpg',
    calories: 520
  }
];
