import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      } overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-primary-400 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-primary-500`}
    >
      {imgSrc &&
        (href ? (
          <Link
            href={href}
            aria-label={`Link to ${title}`}
            className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
          {href ? (
            <Link
              href={href}
              aria-label={`Link to ${title}`}
              className="rounded-sm transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:hover:text-primary-400"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="mb-3 max-w-none text-pretty text-gray-600 dark:text-gray-400">{description}</p>
        {href && (
          <Link
            href={href}
            className="rounded-sm text-base font-medium leading-6 text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            aria-label={`Link to ${title}`}
          >
            Learn more &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
