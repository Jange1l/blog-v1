import archiveData from '@/data/archiveData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Archive' })

export default function Archive() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Archive
          </h1>
          <p className="text-lg leading-7 text-gray-600 dark:text-gray-400">
            Older projects I built over the years. They are no longer actively maintained and may
            not work as intended, but I keep them here for posterity.
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {archiveData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
