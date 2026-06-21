import researchData from '@/data/researchData'
import Image from '@/components/Image'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Research' })

export default function Research() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Research
          </h1>
          <p className="text-lg leading-7 text-gray-600 dark:text-gray-400">
            Write-ups and experiments exploring questions I find interesting.
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {researchData.map((d) => (
              <div key={d.title} className="max-w-[544px] p-4 md:w-1/2">
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read ${d.title}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-primary-500"
                >
                  {d.imgSrc && (
                    <Image
                      alt={d.title}
                      src={d.imgSrc}
                      className="object-cover object-center md:h-36 lg:h-48"
                      width={544}
                      height={306}
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {d.meta && (
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                        {d.meta}
                      </p>
                    )}
                    <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                      {d.title}
                    </h2>
                    <p className="mb-3 max-w-none flex-1 text-pretty text-gray-600 dark:text-gray-400">
                      {d.description}
                    </p>
                    <span className="text-base font-medium leading-6 text-primary-600 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300">
                      Read more &rarr;
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
