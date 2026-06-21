import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-500/20 to-accent-500/20 blur-3xl dark:from-primary-500/10 dark:to-accent-500/10"
        />
        <div className="py-16 sm:py-20 md:py-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">
            {siteMetadata.headerTitle}
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            Building thoughtful software, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              and writing about the journey.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-600"
            >
              Read the blog
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary-400 hover:text-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-500"
            >
              Explore research
            </Link>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="border-t border-gray-200 pt-12 dark:border-gray-700">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Latest posts
            </h2>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Notes on engineering, tools, and ideas worth sharing.
            </p>
          </div>
          {posts.length > MAX_DISPLAY && (
            <Link
              href="/blog"
              className="hidden shrink-0 text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 sm:block"
              aria-label="All posts"
            >
              All posts &rarr;
            </Link>
          )}
        </div>

        <div className="grid gap-6">
          {!posts.length && (
            <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
          )}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <article
                key={slug}
                className="group rounded-2xl border border-gray-200 bg-white/40 p-6 transition-all hover:border-primary-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/30 dark:hover:border-primary-500 sm:p-8"
              >
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                  </dd>
                </dl>
                <h3 className="mt-3 text-2xl font-bold leading-8 tracking-tight">
                  <Link
                    href={`/blog/${slug}`}
                    className="text-gray-900 transition-colors group-hover:text-primary-500 dark:text-gray-100"
                  >
                    {title}
                  </Link>
                </h3>
                {tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-tag-gap">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                )}
                <p className="prose mt-4 max-w-none text-gray-500 dark:text-gray-400">{summary}</p>
                <div className="mt-5 text-base font-medium leading-6">
                  <Link
                    href={`/blog/${slug}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Read more: "${title}"`}
                  >
                    Read more &rarr;
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {posts.length > MAX_DISPLAY && (
          <div className="mt-10 flex justify-center sm:hidden">
            <Link
              href="/blog"
              className="text-base font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="All posts"
            >
              All posts &rarr;
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
