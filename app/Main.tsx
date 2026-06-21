import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl"
        >
          <div className="mx-auto aspect-[1155/678] w-[36rem] bg-gradient-to-tr from-primary-300 to-primary-600 opacity-20 dark:opacity-10" />
        </div>
        <div className="py-16 sm:py-20 lg:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
            Blog
          </p>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
            {siteMetadata.author}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-gray-600 dark:text-gray-400">
            {siteMetadata.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              Read the blog
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary-400 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
            >
              Explore research
            </Link>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="border-t border-gray-200 pt-12 dark:border-gray-800">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Latest posts
            </h2>
            <p className="mt-2 text-pretty text-base text-gray-600 dark:text-gray-400">
              Notes on engineering, tools, and ideas worth sharing.
            </p>
          </div>
          {posts.length > MAX_DISPLAY && (
            <Link
              href="/blog"
              className="hidden shrink-0 rounded-sm text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-primary-400 dark:hover:text-primary-300 sm:block"
            >
              All posts &rarr;
            </Link>
          )}
        </div>

        <div className="grid gap-6">
          {!posts.length && <p className="text-gray-600 dark:text-gray-400">No posts found.</p>}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <article
                key={slug}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-primary-400 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-primary-500 sm:p-8"
              >
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-sm font-medium tracking-wide text-gray-500 tabular-nums dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                  </dd>
                </dl>
                <h3 className="mt-3 text-2xl font-bold leading-8 tracking-tight">
                  <Link
                    href={`/blog/${slug}`}
                    className="text-gray-900 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                  >
                    {title}
                  </Link>
                </h3>
                {tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                )}
                <p className="mt-4 max-w-none text-pretty text-gray-600 dark:text-gray-400">
                  {summary}
                </p>
                <div className="mt-5 text-base font-medium leading-6">
                  <Link
                    href={`/blog/${slug}`}
                    className="rounded-sm text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
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
              className="rounded-sm text-base font-medium text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
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
