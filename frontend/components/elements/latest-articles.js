import { useEffect } from "react"
import axios from "axios"
import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import { MdOutlineArticle } from "react-icons/md"
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
const fetcher = async (url) =>
  await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET_TOKEN}`,
      },
    })
    .then((res) => res.data)
const LatestArticles = ({
  current,
  count,
  position,
  offset = 0,
  advertisement,
}) => {
  const { data: latestArticles } = useSWR(
    `/api/articles?populate[0]=image&populate[1]=category&filters[id][$notIn]=${current}&pagination[start]=${offset}&pagination[limit]=${count}&sort[0]=id%3Adesc`,
    fetcher
  )
  return (
    <>
      <div className="flex flex-row items-center justify-between border-b border-midgray">
        <h4 className="font-semibold text-base text-midgray">
          İLGİNİZİ ÇEKEBİLİR
        </h4>
        <MdOutlineArticle className="text-lg text-midgray" />
      </div>
      <div className="flex flex-wrap -mx-2 my-2">
        {latestArticles &&
          latestArticles.data.map((article, i, latestArticles) => (
            <div
              className={classNames(
                position === "bottom"
                  ? "sm:w-1/2 md:w-1/2 xl:w-1/3"
                  : "sm:w-full md:w-full xl:w-full",
                "w-full p-2"
              )}
              key={article.id}
            >
              {latestArticles.length > 4 && i + 1 === 4 && (
                <div
                  className="pb-4"
                  dangerouslySetInnerHTML={{ __html: advertisement }}
                />
              )}
              <Link
                href={`/haber/${article.id}/${article.attributes.slug}`}
                className={classNames(
                  position === "bottom" ? "h-full" : "",
                  `${styles.cCard} block bg-lightgray rounded border border-b-2 overflow-hidden`
                )}
              >
                <div className="relative border-b-4 border-primary pb-36 overflow-hidden">
                  <Image
                    src={
                      article.attributes.image.data.attributes.formats.thumbnail
                        .url
                    }
                    alt={
                      article.attributes.image.data.attributes.alternativeText
                    }
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
                    className="absolute top-[-1rem] text-white right-2 rounded px-1"
                    style={{
                      backgroundColor: categoryColor(
                        article.attributes.category.data.attributes.slug
                      ),
                    }}
                  >
                    {article.attributes.category.data.attributes.title}
                  </div>
                  <h3 className="font-semibold">{article.attributes.title}</h3>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </>
  )
}

export default LatestArticles
