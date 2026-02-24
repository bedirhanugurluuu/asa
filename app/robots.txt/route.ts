import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asagrouglobal.com'
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: ${baseUrl}/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
