import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://murad-sweets-user-frontend.onrender.com/';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    // Attempt to fetch products for dynamic menu routes
    const response = await fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } });
    if (response.ok) {
      const products = await response.json();
      const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
        url: `${baseUrl}/menu/${product.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      return [...routes, ...productRoutes];
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  return routes;
}
