import { Metadata } from 'next';
import { getProductBySlug } from '@/app/lib/api';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const slug = params.slug;

  try {
    const product = await getProductBySlug(slug);
    
    if (product) {
      return {
        title: `${product.name} | Authentic Bengali Mithai | Murad Sweets`,
        description: product.description || `Order authentic ${product.name}, a premium Bangladeshi Mishti. Handcrafted with traditional recipes and premium ingredients.`,
        keywords: [
          product.name,
          "Bengali Mithai",
          "Bangladeshi Mishti",
          "Buy Mithai Online",
          "Halal Sweets USA"
        ]
      };
    }
  } catch (error) {
    console.error(`Failed to fetch metadata for product: ${slug}`, error);
  }

  // Fallback metadata if API fails
  return {
    title: "Premium Bangladeshi Mishti | Bengali Mithai | Murad Sweets",
    description: "Discover our authentic, hand-crafted Bangladeshi sweets and Bengali Mithai. Enjoy the taste of tradition.",
  };
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
