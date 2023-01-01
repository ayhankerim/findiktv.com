import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { MdChevronRight } from "react-icons/md"

const Breadcrumb = ({ parent, current, slug, articleId, childType }) => {
  const { locale } = useRouter()
  return (
    <div className="Breadcrumb pb-2 text-sm text-midgray">
      <meta itemProp="numberOfItems" content="3" />
      <ul className="flex">
        <li
          itemProp="itemListElement"
          itemScope=""
          itemType="http://schema.org/ListItem"
        >
          <meta itemProp="position" content="1" />
          <span
            itemProp="item"
            itemScope=""
            itemType="http://schema.org/WebPage"
            itemID="/"
          >
            <Link
              href={`/`}
              passHref
              className="hover:underline underline-offset-4 hover:text-darkgray"
              itemProp="url"
            >
              <span itemProp="name">FINDIK TV</span>
            </Link>
          </span>
          <MdChevronRight className="inline-block" />
        </li>
        <li
          itemProp="itemListElement"
          itemScope=""
          itemType="http://schema.org/ListItem"
        >
          <meta itemProp="position" content="2" />
          <span
            itemProp="item"
            itemScope=""
            itemType="http://schema.org/WebPage"
            itemID={`/kategori/${parent ? parent.slug : "gundem"}`}
          >
            <Link
              href={`/kategori/${parent ? parent.slug : "gundem"}`}
              className="hover:underline underline-offset-4 hover:text-darkgray"
              itemProp="url"
              passHref
            >
              <span itemProp="name">
                {parent ? parent.title.toLocaleUpperCase(locale) : "GÜNDEM"}
              </span>
            </Link>
          </span>
          <MdChevronRight className="inline-block" />
        </li>
        {childType === "comment" ? (
          <>
            <li
              itemProp="itemListElement"
              itemScope=""
              itemType="http://schema.org/ListItem"
            >
              <meta itemProp="position" content="3" />
              <span
                itemProp="item"
                itemScope=""
                itemType="http://schema.org/WebPage"
                itemID={`${process.env.NEXT_PUBLIC_SITE_URL}/haber/${articleId}/${slug}`}
              >
                <Link
                  href={`${process.env.NEXT_PUBLIC_SITE_URL}/haber/${articleId}/${slug}`}
                  className="hover:underline underline-offset-4 hover:text-darkgray"
                  itemProp="url"
                  passHref
                >
                  <span itemProp="name">
                    {current.toLocaleUpperCase(locale)}
                  </span>
                </Link>
              </span>
              <MdChevronRight className="inline-block" />
            </li>
            <li
              itemProp="itemListElement"
              itemScope=""
              itemType="http://schema.org/ListItem"
            >
              <meta itemProp="position" content="4" />
              <span
                itemProp="item"
                itemScope=""
                itemType="http://schema.org/WebPage"
                itemID={`${process.env.NEXT_PUBLIC_SITE_URL}/haber/${articleId}/${slug}/yorumlar`}
              >
                <span itemProp="name">YORUMLAR</span>
              </span>
            </li>
          </>
        ) : (
          <li
            itemProp="itemListElement"
            itemScope=""
            itemType="http://schema.org/ListItem"
          >
            <meta itemProp="position" content="3" />
            <span
              itemProp="item"
              itemScope=""
              itemType="http://schema.org/WebPage"
              itemID={`${process.env.NEXT_PUBLIC_SITE_URL}/haber/${articleId}/${slug}`}
            >
              <span itemProp="name">{current.toLocaleUpperCase(locale)}</span>
            </span>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Breadcrumb
