import { ReactNode } from 'react'
import { genPageMetadata } from 'app/seo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProviders } from '../theme-providers'
import { SearchProvider } from 'pliny/search'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({
  title: '3D Snake Game',
  description: 'Play a 3D Snake game built with React Three Fiber',
})

interface LayoutProps {
  children: ReactNode
}

export default function SnakeGameLayout({ children }: LayoutProps) {
  // Use the SectionContainer with fullWidth prop to allow full width
  return (
    <>
      <div className="flex flex-col justify-between font-sans">
        <SearchProvider searchConfig={siteMetadata.search as any}>
          <main className="mb-auto">{children}</main>
        </SearchProvider>
      </div>
    </>
  )
}
