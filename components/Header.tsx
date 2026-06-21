'use client'

import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur-md backdrop-saturate-150 dark:border-gray-800/70 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6 xl:max-w-5xl xl:px-0">
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          className="rounded-sm text-lg font-bold tracking-tight text-gray-900 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:text-gray-100 dark:hover:text-primary-400 sm:text-xl"
        >
          {siteMetadata.headerTitle}
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden items-center sm:flex" aria-label="Main navigation">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => {
                const isActive =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-gray-100'
                    }`}
                  >
                    {link.title}
                  </Link>
                )
              })}
          </nav>
          <div className="ml-1 flex items-center gap-1">
            <SearchButton />
            <ThemeSwitch />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
