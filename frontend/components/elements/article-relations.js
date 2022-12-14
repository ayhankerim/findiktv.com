import Link from "next/link"
import ArticleShare from "./share"

const ArticleRelations = ({ cities, tags, title, slug }) => {
  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h4 className="font-semibold text-base text-midgray">ŞEHİRLER</h4>
          <ul>
            {cities.data.map((city) => (
              <li key={city.id}>
                <Link
                  className="font-semibold hover:underline"
                  href={`/sehir/${city.attributes.slug}`}
                  title={city.attributes.title}
                >
                  {city.attributes.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ArticleShare position="articleBottom" title={title} slug={slug} />
      </div>
      <div className="flex flex-col my-4">
        <h4 className="font-semibold text-base text-midgray">
          İLİŞKİLİ İÇERİKLER
        </h4>
        <ul className="flex flex-wrap my-2 gap-2">
          {tags.data.map((tag) => (
            <li key={tag.id}>
              <Link
                className="block border border-lightgray hover:border-secondary hover:text-white hover:bg-secondary rounded px-2 py-1"
                href={`/haber/etiket/${tag.attributes.slug}`}
                title={tag.attributes.title}
              >
                {tag.attributes.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ArticleRelations
