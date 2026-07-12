export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;         // base price (0 for dry-sweets since they are Mix & Match)
  unit?: string;         // e.g. "per box (4pc)", "per cake (8oz)"
  images: string[];
  inStock: boolean;
  preOrderOnly?: boolean;
  minOrderQty?: number;  // for Pitha (10)
  isMixMatch?: boolean;  // for Dry Sweets box
  product_type?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'kalojam',
    name: 'Kalojam',
    category: 'dry-sweets',
    description: 'Traditional deep-fried milk-solid dumplings soaked in cardamom-infused sugar syrup, featuring a dark, caramelized outer layer.',
    price: 0,
    images: ['/KaloJam.webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '2',
    slug: 'brown-chom-chom',
    name: 'Brown Chom Chom',
    category: 'dry-sweets',
    description: 'Classic Bangladeshi oval-shaped sweet made of dense chenna (curdled milk), slowly cooked to a rich mahogany brown color.',
    price: 0,
    images: ['/BrownChomChom.webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '3',
    slug: 'white-chom-chom',
    name: 'White Chom Chom',
    category: 'dry-sweets',
    description: 'Delicate, ivory-white chom chom made of soft chenna, simmered in light sugar syrup, offering a moist texture.',
    price: 0,
    images: ['/WhiteChomChom.webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '4',
    slug: 'kalojam-sandwich',
    name: 'Kalojam Sandwich',
    category: 'dry-sweets',
    description: 'An elegant variation of Kalojam, sliced open and filled with a thick layer of sweetened cream (malai).',
    price: 0,
    images: ['/KalujamSandwich.webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '5',
    slug: 'kheer-mouchak',
    name: 'Kheer Mouchak',
    category: 'dry-sweets',
    description: 'A honeycomb-shaped royal delight made with chenna, soaked in saffron syrup, and covered with creamy kheer.',
    price: 0,
    images: ['/KheerMouchak.webp'],
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
    images: ['/MalaiKari.webp'],
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
    images: ['/RajBhog.webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '8',
    slug: 'kathari-bhog',
    name: 'Kathari Bhog',
    category: 'dry-sweets',
    description: 'An artisanal Bangladeshi sweet consisting of small chenna balls cooked in premium date jaggery syrup.',
    price: 0,
    images: ['/KatariBhog.webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '9',
    slug: 'laddu',
    name: 'Laddu',
    category: 'dry-sweets',
    description: 'Aromatic Motichoor Laddus made from tiny chickpea flour globules fried in pure ghee.',
    price: 0,
    images: ['/Laddu.webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '10',
    slug: 'shandesh',
    name: 'Shandesh',
    category: 'dry-sweets',
    description: 'Traditional dry sweet made from fresh paneer and date molasses (Nolen Gur).',
    price: 0,
    images: ['/Shandesh.webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '11',
    slug: 'gulab-jamun-dry',
    name: 'Gulab Jamun',
    category: 'dry-sweets',
    description: 'Soft milk-solid balls fried, sweetened, and rolled in dry desiccated coconut.',
    price: 0,
    images: ['https://items-images-production-f.squarecdn.com/files/e165ec6df7b6a9094b2a46d22efc4d107061e1f8/original.jpeg?width=128&crop=1%3A1&format=webp'],
    inStock: true,
    isMixMatch: true
  },
  {
    id: '12',
    slug: 'peda',
    name: 'Peda',
    category: 'dry-sweets',
    description: 'Rich, semi-soft sweet made of condensed milk, sugar, and traditional flavorings.',
    price: 0,
    images: ['/Peda.webp'],
    inStock: true,
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
    images: ['/RasMalai.webp'],
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
    images: ['/GulabJamun.webp'],
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
    images: ['/MishtiDoi.webp'],
    inStock: true
  },
  {
    id: '16',
    slug: 'small-party-tray',
    name: 'Small Party Tray',
    category: 'party-trays',
    description: 'A beautiful arrangement of 18 assorted premium dry sweets, perfect for family get-togethers and intimate celebrations.',
    price: 30,
    unit: 'per tray (~18 pcs)',
    images: ['/SmallPartyTray.webp'],
    inStock: true,
    product_type: 'custom_box',
    isMixMatch: true
  },
  {
    id: '17',
    slug: 'large-party-tray',
    name: 'Large Party Tray',
    category: 'party-trays',
    description: 'A grand presentation tray with 40 pieces of our finest sweets, featuring an assortment of chom chom, kalojam, shandesh, and laddus.',
    price: 60,
    unit: 'per tray (~40 pcs)',
    images: ['/LargePartyTray.webp'],
    inStock: true,
    product_type: 'custom_box',
    isMixMatch: true
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
    images: ['/murad-logo.jpg'],
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
    images: ['/PuliPitha.webp'],
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
    images: ['/Patishapta.webp'],
    inStock: true
  },
  {
    id: '21',
    slug: 'mpp-brown-chom-chom',
    name: 'Brown Chom Chom',
    category: 'mishti-per-pound',
    description: 'Classic Bangladeshi oval-shaped sweet made of dense chenna (curdled milk), slowly cooked to a rich mahogany brown color.',
    price: 13,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/0a1baff12638918784fd42eec0e02233c57874f2/original.jpeg?width=512&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '22',
    slug: 'mpp-white-chom-chom',
    name: 'White Chom Chom',
    category: 'mishti-per-pound',
    description: 'Delicate, ivory-white chom chom made of soft chenna, simmered in light syrup.',
    price: 12,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/85c894a2cdfa49fc91468a6ed389376d7bd901e1/original.png?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '23',
    slug: 'mpp-kalojam',
    name: 'Kalojam',
    category: 'mishti-per-pound',
    description: 'Traditional deep-fried milk-solid dumplings soaked in sugar syrup, featuring a caramelized outer layer.',
    price: 12,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/ef1d699f951f2db300ae859cc6b39897c79095b8/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '24',
    slug: 'mpp-rajbhog',
    name: 'Rajbhog',
    category: 'mishti-per-pound',
    description: 'Grand-sized chenna spheres stuffed with dry fruits, simmered in saffron syrup.',
    price: 12,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/95c97a84a6f3b0265c89796fe61e83547fc30bbd/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '25',
    slug: 'mpp-malaikari',
    name: 'Malaikari',
    category: 'mishti-per-pound',
    description: 'Plump chenna rounds cooked in syrup and coated with luscious saffron malai reduction.',
    price: 13,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/b1197d7095486976b4b572dbd02f821bfdbca151/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '26',
    slug: 'mpp-shandesh',
    name: 'Shandesh',
    category: 'mishti-per-pound',
    description: 'Traditional dry sweet made from fresh paneer and date molasses.',
    price: 13,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/c3fd77de3125fbebfaf08a34328df9718f044cf9/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '27',
    slug: 'mpp-gulab-jamun',
    name: 'Gulab Jamun',
    category: 'mishti-per-pound',
    description: 'Soft milk-solid balls fried, sweetened, and rolled in desiccated coconut.',
    price: 12,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/e165ec6df7b6a9094b2a46d22efc4d107061e1f8/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '28',
    slug: 'mpp-kheer-mouchak',
    name: 'Kheer Mouchak',
    category: 'mishti-per-pound',
    description: 'Honeycomb-shaped delight made with chenna and covered with creamy reduced milk.',
    price: 12,
    unit: 'per lb',
    images: ['/KheerMouchak.webp'],
    inStock: true
  },
  {
    id: '29',
    slug: 'mpp-kala-jamun-sandwich',
    name: 'Kala Jamun Sandwich',
    category: 'mishti-per-pound',
    description: 'Variation of Kalojam filled with a thick layer of sweetened cream (malai).',
    price: 13,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/1e4a710e5852bebb0ec3993ac604e4dd9dedf4c5/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '30',
    slug: 'mpp-laddu',
    name: 'Laddu',
    category: 'mishti-per-pound',
    description: 'Aromatic Motichoor Laddus made from tiny chickpea flour globules.',
    price: 13,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/3894a89462eb13d67a7d65a15bed28c891501566/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '31',
    slug: 'mpp-katari-bhog',
    name: 'Katari Bhog',
    category: 'mishti-per-pound',
    description: 'Artisanal sweet consisting of textured chenna balls cooked in date jaggery syrup.',
    price: 15,
    unit: 'per lb',
    images: ['https://items-images-production-f.squarecdn.com/files/5f2e1c7cf8e32ecc2c4dec89d5b0add8c62faa72/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  /* {
    id: '32',
    slug: 'mpp-sponge-roshogolla',
    name: 'Sponge RoshoGolla',
    category: 'mishti-per-pound',
    description: 'Light, spongy cottage cheese balls soaked in clear sugar syrup.',
    price: 13,
    unit: 'per lb',
    images: ['/SpongeRoshoGolla.webp'],
    inStock: true
  }, */
  {
    id: '33',
    slug: 'mpp-classic-roshogolla',
    name: 'Classic RoshoGolla',
    category: 'mishti-per-pound',
    description: 'Traditional Bengali melt-in-mouth cottage cheese balls in sweet syrup.',
    price: 12,
    unit: 'per lb',
    images: ['/ClassRoshGolla.webp'],
    inStock: true
  },
  {
    id: '34',
    slug: 'mpp-peda',
    name: 'Peda',
    category: 'mishti-per-pound',
    description: 'Rich, semi-soft sweet made of condensed milk and sugar.',
    price: 12,
    unit: 'per dozen',
    images: ['https://items-images-production-f.squarecdn.com/files/5959be5a1eecc7bcef1982dcc39a1fe151edabd7/original.jpeg?width=640&crop=1%3A1&format=webp'],
    inStock: true
  },
  {
    id: '35',
    slug: 'mpp-katcha-golla',
    name: 'Katcha Golla',
    category: 'mishti-per-pound',
    description: 'Soft, melt-in-the-mouth raw sweet made of fresh chenna and sugar.',
    price: 14,
    unit: 'per lb',
    images: ['/KatchaGolla.webp'],
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
  'mishti-per-pound': {
    tagline: 'Fresh & Traditional',
    title: 'Mishti Per Pound',
    description: 'Select your favorite sweets and buy them by the pound or dozen, prepared fresh daily.',
  },
};

export const CATEGORIES = [
  { id: 'dry-sweets', name: 'Dry Sweets (Mix & Match)', count: 13 },
  { id: 'specialty', name: 'Specialty Items', count: 3 },
  { id: 'party-trays', name: 'Party Trays', count: 2 },
  { id: 'pitha', name: 'Traditional Pitha (Pre-Order Only)', count: 3 },
  { id: 'mishti-per-pound', name: 'Mishti Per Pound', count: 16 }
];
