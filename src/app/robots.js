export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/login'],
    },
    sitemap: 'https://bereketlimetal.online/sitemap.xml',
  }
}
