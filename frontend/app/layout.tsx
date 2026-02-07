import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { DynamicSEO } from '@/components/dynamic-seo'
import { DynamicTheme } from '@/components/dynamic-theme'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://durgarajchauhan.vercel.app'),
  title: {
    default: 'Portfolio - Full Stack Developer',
    template: '%s | Portfolio',
  },
  description: 'A modern portfolio website showcasing my work and skills',
  keywords: ['portfolio', 'web development', 'full stack', 'developer', 'software engineer'],
  authors: [{ name: 'Durgaraj Chauhan' }],
  creator: 'Durgaraj Chauhan',
  publisher: 'Durgaraj Chauhan',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Portfolio - Full Stack Developer',
    description: 'A modern portfolio website showcasing my work and skills',
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Full Stack Developer',
    description: 'A modern portfolio website showcasing my work and skills',
    creator: '@yourusername',
  },
  verification: {
    google: 'verification_token',
    // yandex: 'verification_token',
    // bing: 'verification_token',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <DynamicSEO />
            <DynamicTheme />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
