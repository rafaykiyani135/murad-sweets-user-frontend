import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://murad-sweets-user-frontend.onrender.com/';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/history', '/cart', '/checkout', '/login', '/reset-password', '/order-confirmation'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
