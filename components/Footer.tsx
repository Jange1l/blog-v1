import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200/70 dark:border-gray-800/70">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-10 sm:px-6 xl:max-w-5xl xl:px-0">
        <div className="flex space-x-5">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
          <SocialIcon kind="github" href={siteMetadata.github} size={5} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={5} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{siteMetadata.author}</span>
          <span aria-hidden="true">·</span>
          <span>{`© ${new Date().getFullYear()}`}</span>
          <span aria-hidden="true">·</span>
          <Link
            href="/"
            className="rounded-sm transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:hover:text-primary-400"
          >
            {siteMetadata.title}
          </Link>
        </div>
      </div>
    </footer>
  )
}
