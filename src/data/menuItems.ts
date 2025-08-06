import { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  { 
    id: 'barramundi', 
    name: 'Barramundi', 
    price: 12.50, 
    category: 'fish',
    description: 'Premium Australian barramundi, fresh caught and perfectly seasoned',
    image: '🐟',
    popular: true,
    customizations: {
      batter: ['Traditional', 'Tempura', 'Gluten-Free'],
      cooking: ['Fried', 'Grilled']
    }
  },
  { 
    id: 'snapper', 
    name: 'Snapper', 
    price: 13.00, 
    category: 'fish',
    description: 'Local Perth snapper, delicate and flaky with a golden crisp',
    image: '🐟',
    customizations: {
      batter: ['Traditional', 'Tempura', 'Gluten-Free'],
      cooking: ['Fried', 'Grilled']
    }
  },
  { 
    id: 'flathead', 
    name: 'Flathead', 
    price: 11.50, 
    category: 'fish',
    description: 'Sweet and tender flathead with our signature beer batter',
    image: '🐟',
    customizations: {
      batter: ['Traditional', 'Tempura', 'Gluten-Free'],
      cooking: ['Fried', 'Grilled']
    }
  },
  { 
    id: 'whiting', 
    name: 'Whiting', 
    price: 10.50, 
    category: 'fish',
    description: 'Delicate whiting fillets, perfect for first-time fish lovers',
    image: '🐟',
    customizations: {
      batter: ['Traditional', 'Tempura', 'Gluten-Free'],
      cooking: ['Fried', 'Grilled']
    }
  },
  { 
    id: 'regular-chips', 
    name: 'Regular Chips', 
    price: 4.50, 
    category: 'sides',
    description: 'Hand-cut potatoes, crispy outside and fluffy inside',
    image: '🍟',
    popular: true,
    customizations: {
      sauce: ['Tomato', 'Aioli', 'Tartare', 'Vinegar', 'None']
    }
  },
  { 
    id: 'large-chips', 
    name: 'Large Chips', 
    price: 6.50, 
    category: 'sides',
    description: 'Perfect for sharing - our famous hand-cut chips',
    image: '🍟',
    customizations: {
      sauce: ['Tomato', 'Aioli', 'Tartare', 'Vinegar', 'None']
    }
  },
  { 
    id: 'potato-scallops', 
    name: 'Potato Scallops', 
    price: 2.50, 
    category: 'sides',
    description: 'Thinly sliced potato in crispy golden batter - $2.50 each',
    image: '🥔'
  },
  { 
    id: 'dim-sims', 
    name: 'Dim Sims', 
    price: 3.00, 
    category: 'sides',
    description: 'Traditional steamed dim sims with soy dipping sauce - $3.00 each',
    image: '🥟'
  },
  { 
    id: 'prawns', 
    name: 'Prawns (6 pieces)', 
    price: 8.50, 
    category: 'seafood',
    description: 'Succulent tiger prawns in light, crispy batter',
    image: '🦐',
    customizations: {
      batter: ['Traditional', 'Tempura']
    }
  },
  { 
    id: 'calamari', 
    name: 'Calamari Rings', 
    price: 7.50, 
    category: 'seafood',
    description: 'Tender calamari rings, lightly seasoned and perfectly fried',
    image: '🦑'
  },
  { 
    id: 'crab-sticks', 
    name: 'Crab Sticks (4 pieces)', 
    price: 6.00, 
    category: 'seafood',
    description: 'Golden fried crab sticks with sweet chili dipping sauce',
    image: '🦀'
  },
];