import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asagrouglobal.com'
  
  // Tüm sayfalar
  const routes = [
    // Türkçe sayfalar
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.9', changefreq: 'monthly' },
    { path: '/quote', priority: '0.8', changefreq: 'monthly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/airbnb-management', priority: '0.7', changefreq: 'weekly' },
    // İngilizce sayfalar
    { path: '/en', priority: '1.0', changefreq: 'daily' },
    { path: '/en/about', priority: '0.9', changefreq: 'monthly' },
    { path: '/en/quote', priority: '0.8', changefreq: 'monthly' },
    { path: '/en/contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/en/airbnb-management', priority: '0.7', changefreq: 'weekly' },
  ]

  const lastmod = new Date().toISOString().split('T')[0]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path || ''}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
