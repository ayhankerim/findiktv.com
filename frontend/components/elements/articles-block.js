import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Moment from "moment"
import "moment/locale/tr"
import styles from "@/styles/latest-articles.module.scss"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function categoryColor(cat) {
  switch (cat) {
    case "ekonomi":
      return "#0846c4"
      break
    case "3-sayfa":
      return "#d4111b"
      break
    case "spor":
      return "#5b991b"
      break
    case "siyaset":
      return "#c37c09"
      break
    case "gundem":
      return "#42b27c"
      break
    case "kultur-sanat":
      return "#aa007b"
      break
    case "teknoloji":
      return "#0055ff"
      break
    default:
      return "rgb(107,114,128)"
      break
  }
}

const ArticleBlock = ({ article, category, index }) => {
  return (
    <>
      {index > 2 && index % 4 === 0 && (
        <div className="sm:w-2/2 md:w-2/2 xl:w-2/3 w-full p-2">REKLAM</div>
      )}
      <article className="sm:w-1/2 md:w-1/2 xl:w-1/3 w-full p-2">
        <Link
          href={`/haber/${article.id}/${article.attributes.slug}`}
          className={`${styles.cCard} block bg-lightgray rounded border border-b-2 overflow-hidden`}
        >
          <div
            className="relative border-b-4 pb-36 overflow-hidden"
            style={{
              borderColor: categoryColor(category),
            }}
          >
            <Image
              src={
                article.attributes.image.data.attributes.formats.thumbnail.url
              }
              alt={article.attributes.image.data.attributes.alternativeText}
              className="absolute inset-0 h-full w-full object-cover"
              priority={true}
              fill
              sizes="(max-width: 768px) 100vw,
                          (max-width: 800px) 50vw,
                          33vw"
            />
          </div>
          <div className="relative p-4">
            <div
              className="absolute top-[-1rem] text-white text-sm font-thin right-2 shadow-lg rounded px-1"
              style={{
                backgroundColor: categoryColor(category),
              }}
            >
              {Moment(article.attributes.updatedAt)
                .fromNow(true)
                .toLocaleUpperCase(article.locale)}{" "}
              ÖNCE
            </div>
            <h3 className="font-semibold">{article.attributes.title}</h3>
          </div>
        </Link>
      </article>
    </>
  )
}

export default ArticleBlock
