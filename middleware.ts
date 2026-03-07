import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static dosyalar ve API route'ları için yönlendirme yapma
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/logos') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // Ana sayfa zaten yapım aşamasında, diğer tüm sayfaları ana sayfaya yönlendir
  if (pathname !== '/' && pathname !== '/en') {
    const url = request.nextUrl.clone()
    // Dil prefix'i varsa koru
    if (pathname.startsWith('/en')) {
      url.pathname = '/en'
    } else {
      url.pathname = '/'
    }
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
