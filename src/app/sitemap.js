import { getPrices } from '@/services/price-methods';
import { getPosts } from '@/services/blog-methods';

const URL = 'https://bereketlimetal.online';

export default async function sitemap() {
  let prices = [];
  let posts = [];
  
  try {
    prices = await getPrices();
    posts = await getPosts();
  } catch(err) {
    console.error("Sitemap fetch error:", err);
  }

  const priceUrls = prices.map((price) => ({
    url: `${URL}/${price.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const blogUrls = posts.map((post) => ({
    url: `${URL}/blog/${post.slug}`,
    lastModified: post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${URL}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...priceUrls,
    ...blogUrls,
  ];
}
