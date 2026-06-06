export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'dry-sweets' | 'specialty' | 'party-trays' | 'pitha';
  description: string;
  price: number;         // base price (0 for dry-sweets since they are Mix & Match)
  unit?: string;         // e.g. "per box (4pc)", "per cake (8oz)"
  images: string[];
  inStock: boolean;
  preOrderOnly?: boolean;
  minOrderQty?: number;  // for Pitha (10)
  isMixMatch?: boolean;  // for Dry Sweets box
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'kalojam',
    name: 'Kalojam',
    category: 'dry-sweets',
    description: 'Traditional deep-fried milk-solid dumplings soaked in cardamom-infused sugar syrup, featuring a dark, caramelized outer layer and a soft, melt-in-your-mouth center.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '2',
    slug: 'brown-chom-chom',
    name: 'Brown Chom Chom',
    category: 'dry-sweets',
    description: 'Classic Bangladeshi oval-shaped sweet made of dense chenna (curdled milk), slowly cooked to a rich mahogany brown color and rolled in mawa crumbs.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1548680373-ab6d4a5b48d7?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '3',
    slug: 'white-chom-chom',
    name: 'White Chom Chom',
    category: 'dry-sweets',
    description: 'Delicate, ivory-white chom chom made of soft chenna, simmered in light sugar syrup, offering a moist texture and mild sweetness.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1589135306090-e5550a6f0a0d?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '4',
    slug: 'kalojam-sandwich',
    name: 'Kalojam Sandwich',
    category: 'dry-sweets',
    description: 'An elegant variation of Kalojam, sliced open and filled with a thick layer of sweetened cream (malai) and garnished with nuts.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1605697040924-852290747ef4?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '5',
    slug: 'kheer-mouchak',
    name: 'Kheer Mouchak',
    category: 'dry-sweets',
    description: 'A honeycomb-shaped royal delight made with chenna, soaked in saffron syrup, and covered with creamy, reduced milk kheer.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '6',
    slug: 'malaikari',
    name: 'Malaikari',
    category: 'dry-sweets',
    description: 'Plump chenna rounds cooked in syrup and then coated with a luscious, rich saffron malai reduction.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1589135306090-e5550a6f0a0d?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '7',
    slug: 'rajbhog',
    name: 'Rajbhog',
    category: 'dry-sweets',
    description: 'Grand-sized chenna spheres stuffed with dry fruits, simmered in a fragrant saffron and cardamom syrup.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '8',
    slug: 'kathari-bhog',
    name: 'Kathari Bhog',
    category: 'dry-sweets',
    description: 'An artisanal Bangladeshi sweet consisting of small, textured chenna balls cooked in premium date jaggery syrup for an earthy, deep flavor.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1548680373-ab6d4a5b48d7?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '9',
    slug: 'laddu',
    name: 'Laddu',
    category: 'dry-sweets',
    description: 'Aromatic Motichoor Laddus made from tiny chickpea flour globules fried in pure ghee, sweetened and shaped into golden spheres.',
    price: 0,
    images: ['/laddu.png'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '10',
    slug: 'shandesh',
    name: 'Shandesh',
    category: 'dry-sweets',
    description: 'Traditional dry sweet made from fresh paneer and date molasses (Nolen Gur), molded into artistic patterns.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1589135306090-e5550a6f0a0d?w=600&auto=format&fit=crop&q=80'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '11',
    slug: 'gulab-jamun-dry',
    name: 'Gulab Jamun (dry)',
    category: 'dry-sweets',
    description: 'Soft milk-solid balls fried, sweetened, and rolled in dry desiccated coconut, making them clean and easy to handle.',
    price: 0,
    images: ['/gulab-jamun.png'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '12',
    slug: 'peda',
    name: 'Peda',
    category: 'dry-sweets',
    description: 'Rich, semi-soft sweet made of condensed milk, sugar, and traditional flavorings including green cardamom and saffron.',
    price: 0,
    images: ['https://images.unsplash.com/photo-1589135306090-e5550a6f0a0d?w=600&auto=format&fit=crop&q=80'],
    inStock: false, // Mark this one as Sold Out for UI validation
    isMixMatch: true
  },
  {
    id: '13',
    slug: 'rasmalai-cake',
    name: 'Rasmalai Cake',
    category: 'specialty',
    description: 'An innovative fusion dessert merging vanilla sponge cake soaked in saffron cardamom milk (ras) and topped with actual Rasmalai pieces and pistachios.',
    price: 7,
    unit: 'per cake (8oz)',
    images: ['/rasmalai.png'],
    inStock: true
  },
  {
    id: '14',
    slug: 'gulab-jamun',
    name: 'Gulab Jamun',
    category: 'specialty',
    description: 'Soft, golden-brown dumplings made of milk solids, deep-fried and soaked in a warm, fragrant sugar syrup with rosewater and cardamom.',
    price: 6,
    unit: 'per box (4pc)',
    images: ['/gulab-jamun.png'],
    inStock: true
  },
  {
    id: '15',
    slug: 'mishti-doi',
    name: 'Mishti Doi',
    category: 'specialty',
    description: 'Classic Bengali fermented sweet yogurt, prepared in traditional clay pots by boiling milk until thickened, sweetening with brown sugar/jaggery, and fermenting overnight.',
    price: 10,
    unit: 'per box (16oz)',
    images: ['/mishti-doi.png'],
    inStock: true
  },
  {
    id: '16',
    slug: 'small-party-tray',
    name: 'Small Party Tray',
    category: 'party-trays',
    description: 'A beautiful arrangement of 15-18 assorted premium dry sweets, perfect for family get-togethers and intimate celebrations.',
    price: 30,
    unit: 'per tray (~18 pcs)',
    images: ['https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80'],
    inStock: true
  },
  {
    id: '17',
    slug: 'large-party-tray',
    name: 'Large Party Tray',
    category: 'party-trays',
    description: 'A grand presentation tray with 35-40 pieces of our finest sweets, featuring an assortment of chom chom, kalojam, shandesh, and laddus.',
    price: 60,
    unit: 'per tray (~40 pcs)',
    images: ['https://images.unsplash.com/photo-1601356616077-695728ecf769?w=600&auto=format&fit=crop&q=80'],
    inStock: true
  },
  {
    id: '18',
    slug: 'jhal-pitha',
    name: 'Jhal Pitha',
    category: 'pitha',
    description: 'Savory, spicy steamed rice cakes flavored with green chilies, coriander, onion, and a hint of traditional spices. Perfect for winter evenings.',
    price: 4,
    unit: 'per pc',
    preOrderOnly: true,
    minOrderQty: 10,
    images: ['https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&auto=format&fit=crop&q=80'],
    inStock: true
  },
  {
    id: '19',
    slug: 'puli-pitha',
    name: 'Puli Pitha',
    category: 'pitha',
    description: 'Sweet, half-moon shaped dumplings stuffed with coconut and liquid date molasses (khejur gur), steamed to perfection.',
    price: 3,
    unit: 'per pc',
    preOrderOnly: true,
    minOrderQty: 10,
    images: ['https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&auto=format&fit=crop&q=80'],
    inStock: true
  },
  {
    id: '20',
    slug: 'patishapta',
    name: 'Patishapta',
    category: 'pitha',
    description: 'Delicate, thin crepes made from rice flour batter, filled with a rich mixture of coconut, milk reduction (kheer), and cardamom, rolled beautifully.',
    price: 2.5,
    unit: 'per pc',
    preOrderOnly: true,
    minOrderQty: 10,
    images: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80'],
    inStock: true
  }
];

export const MIX_MATCH_PRICES = {
  3: 5,
  6: 10,
  9: 15
} as const;

export const ASSORTED_BOX_PRICES = {
  3: 5,
  6: 10,
  9: 15
} as const;

export type AssortedBoxSize = keyof typeof ASSORTED_BOX_PRICES;

export type SweetDisplayMeta = {
  color: string;
  bgClass: string;
  flavorType: string;
};

export const SWEET_DISPLAY_META: Record<string, SweetDisplayMeta> = {
  kalojam: { color: '#9B59B6', bgClass: 'bg-purple-100', flavorType: 'Cardamom' },
  'brown-chom-chom': { color: '#C49A7A', bgClass: 'bg-amber-100', flavorType: 'Chenna' },
  'white-chom-chom': { color: '#F5E6D3', bgClass: 'bg-orange-50', flavorType: 'Chenna' },
  'kalojam-sandwich': { color: '#8E44AD', bgClass: 'bg-violet-100', flavorType: 'Malai' },
  'kheer-mouchak': { color: '#E67E22', bgClass: 'bg-orange-100', flavorType: 'Saffron' },
  malaikari: { color: '#F39C12', bgClass: 'bg-yellow-100', flavorType: 'Malai' },
  rajbhog: { color: '#14B8A6', bgClass: 'bg-teal-100', flavorType: 'Saffron' },
  'kathari-bhog': { color: '#795548', bgClass: 'bg-stone-100', flavorType: 'Jaggery' },
  laddu: { color: '#D4A341', bgClass: 'bg-amber-50', flavorType: 'Motichoor' },
  shandesh: { color: '#E8C8C8', bgClass: 'bg-rose-100', flavorType: 'Nolen Gur' },
  'gulab-jamun-dry': { color: '#7B1E2B', bgClass: 'bg-red-100', flavorType: 'Rose' },
  peda: { color: '#FADBD8', bgClass: 'bg-pink-50', flavorType: 'Cardamom' },
  'rasmalai-cake': { color: '#F6DCDC', bgClass: 'bg-blush', flavorType: 'Fusion' },
  'gulab-jamun': { color: '#681628', bgClass: 'bg-red-50', flavorType: 'Rose' },
  'mishti-doi': { color: '#FFF4EE', bgClass: 'bg-orange-50', flavorType: 'Fermented' },
  'small-party-tray': { color: '#541523', bgClass: 'bg-red-50', flavorType: 'Assorted' },
  'large-party-tray': { color: '#4A0F17', bgClass: 'bg-stone-100', flavorType: 'Assorted' },
  'jhal-pitha': { color: '#27AE60', bgClass: 'bg-green-100', flavorType: 'Savory' },
  'puli-pitha': { color: '#8A5A2B', bgClass: 'bg-amber-100', flavorType: 'Coconut' },
  patishapta: { color: '#D4A341', bgClass: 'bg-yellow-50', flavorType: 'Kheer' },
};

export const COLLECTION_MODAL_COPY: Record<
  Product['category'],
  { tagline: string; title: string; description: string }
> = {
  'dry-sweets': {
    tagline: 'Mix & Match',
    title: 'Build Your Assorted Box',
    description: 'Choose a box size, fill each slot with your favorite sweets, and add your custom assortment to cart.',
  },
  'party-trays': {
    tagline: 'Celebrations',
    title: 'Curate Your Party Tray',
    description: 'Select a tray size and hand-pick the sweets that will make your gathering unforgettable.',
  },
  specialty: {
    tagline: 'Premium Picks',
    title: 'Craft Your Specialty Box',
    description: 'Mix our finest specialty items into a personalized box made just for you.',
  },
  pitha: {
    tagline: 'Heritage',
    title: 'Build Your Pitha Box',
    description: 'Choose your box size and fill it with traditional pitha favorites, made the authentic way.',
  },
};

export const CATEGORIES = [
  { id: 'dry-sweets', name: 'Dry Sweets (Mix & Match)', count: 12 },
  { id: 'specialty', name: 'Specialty Items', count: 3 },
  { id: 'party-trays', name: 'Party Trays', count: 2 },
  { id: 'pitha', name: 'Traditional Pitha (Pre-Order Only)', count: 3 }
];
