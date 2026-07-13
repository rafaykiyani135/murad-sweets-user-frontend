import { create } from 'zustand';
import { getCategories, getProducts } from '../lib/api';
import { Product } from '../data/products';

interface CatalogState {
  products: Product[];
  categories: any[];
  isLoading: boolean;
  error: string | null;
  fetchCatalog: () => Promise<void>;
}

export const useCatalog = create<CatalogState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  fetchCatalog: async (force = false) => {
    if (get().isLoading) return; // Prevent parallel fetches
    if (!force && get().products.length > 0) return; // Prevent duplicate fetches if not forced
    set({ isLoading: true, error: null });
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      const mappedProds: Product[] = prods.map((p: any) => {
        const cat = cats.find((c: any) => c.id === p.category_id);
        const rawBundles = p.metadata?.bundle_items || [];
        const enrichedBundles = rawBundles.map((bi: any) => {
          const found = prods.find((pr: any) => pr.id === bi.id);
          return { ...bi, name: found ? found.name : 'Unknown Item' };
        });

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: cat ? cat.slug : 'specialty',
          description: p.description,
          price: p.base_price_cents / 100,
          unit: p.unit_label,
          images: (p.metadata?.images || []).map((img: string) => img.replace(/\.png$/i, '.webp')),
          inStock: p.is_in_stock,
          minOrderQty: p.min_quantity,
          product_type: p.product_type,
          bundle_items: enrichedBundles,
          quantityOnHand: p.quantity_on_hand
        };
      });
      set({ categories: cats, products: mappedProds, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch catalog', err);
      set({ error: 'Failed to fetch catalog', isLoading: false });
    }
  }
}));
