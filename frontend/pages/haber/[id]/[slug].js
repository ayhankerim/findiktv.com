import React, { useEffect } from "react"
import ErrorPage from "next/error"
import { getArticleData, getAdsData, fetchAPI, getGlobalData } from "utils/api"
import Seo from "@/components/elements/seo"
import NextImage from "@/components/elements/image"
import Breadcrumb from "@/components/elements/breadcrumb"
import Advertisement from "@/components/elements/advertisement"
import ArticleDates from "@/components/elements/date"
import ArticleShare from "@/components/elements/share"
import ArticleEmoji from "@/components/elements/reactions"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import { getLocalizedPaths } from "utils/localize"

// The file is called [[...slug]].js because we're using Next's
// optional catch all routes feature. See the related docs:
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes

const DynamicArticle = ({
  articleContent,
  advertisement,
  metadata,
  preview,
  global,
  articleContext,
}) => {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.log(err)
    }
  }, [])
  const router = useRouter()

  // Check if the required data was provided
  if (!router.isFallback && !articleContent.content?.length) {
    return <ErrorPage statusCode={404} />
  }

  // Loading screen (only possible in preview mode)
  if (router.isFallback) {
    return <div className="container">Yükleniyor...</div>
  }

  // Merge default site SEO settings with page specific SEO settings
  if (metadata.shareImage?.data == null) {
    delete metadata.shareImage
  }
  const metadataWithDefaults = {
    ...global.attributes.metadata,
    ...metadata,
  }
  const advertisementFunc = (position) => {
    switch (position) {
      case "article-top-desktop":
        return advertisement.filter(
          (placeholder) => placeholder.attributes.placeholder === position
        )[0].attributes.code
      case "article-inline-desktop":
        return advertisement.filter(
          (placeholder) => placeholder.attributes.placeholder === position
        )[0].attributes.code
      case "article-bottom-desktop":
        return advertisement.filter(
          (placeholder) => placeholder.attributes.placeholder === position
        )[0].attributes.code
      default:
        return "articleTop"
    }
  }
  const createFullPostMarkup = () => {
    let paraArray = articleContent.content.split("</p>")
    let NewsContentText = ""
    paraArray.forEach(myFunction)
    function myFunction(item, index) {
      if (
        Number((paraArray.length / 2).toFixed(0)) - 1 === index ||
        index === 6
      ) {
        NewsContentText +=
          item +
          `<div class="adsInline"><div class="band"><span>REKLAM</span></div>${advertisementFunc(
            "article-inline-desktop"
          )}<div class="band"></div></div>`
      } else {
        NewsContentText += item
      }
    }
    return {
      __html: `<div class="w-[336px] h-[280px] float-left mr-4 mb-4">${advertisementFunc(
        "article-top-desktop"
      )}</div>${NewsContentText}`,
    }
  }
  //console.log(JSON.stringify(articleContent.reaction))
  return (
    <Layout
      global={global}
      pageContext={articleContext}
      advertisement={advertisement}
    >
      {/* Add meta tags for SEO*/}
      <Seo metadata={metadataWithDefaults} />
      {/* Display content sections */}
      {/* <Sections sections={sections} preview={preview} /> */}
      <main className="container flex flex-row items-start justify-between gap-2 pt-2 bg-white">
        <div className="flex-1">
          {/* Featured Image or Video Section*/}
          <div className="mb-2">
            <NextImage
              width={articleContent.image.data.attributes.width}
              height={articleContent.image.data.attributes.height}
              media={articleContent.image}
              className="rounded-lg"
            />
          </div>
          <Breadcrumb
            parent={articleContent.category.data.attributes}
            current={articleContent.title}
            slug={articleContext.slug}
            articleId={articleContent.id}
          />
          <h1 className="font-bold text-xxl">{articleContent.title}</h1>
          <article className="font-semibold text-xl text-darkgray">
            {articleContent.summary}
          </article>
          <ArticleDates
            publishedAt={articleContent.publishedAt}
            updatedAt={articleContent.updatedAt}
          />
          <ArticleShare
            position="articleTop"
            title={articleContent.title}
            slug={`${process.env.NEXT_PUBLIC_SITE_URL}/${articleContent.id}/${articleContext.slug}`}
            commentCount={0}
          />
          <article
            className="text-base"
            dangerouslySetInnerHTML={createFullPostMarkup()}
            preview={preview}
          />
          <div
            className="my-4"
            dangerouslySetInnerHTML={{
              __html: advertisementFunc("article-bottom-desktop"),
            }}
          />
          {articleContent.reaction && (
            <ArticleEmoji
              article={articleContent.id}
              reactions={articleContent.reaction}
            />
          )}
          <section className="commentSection">YORUMLAR</section>
        </div>
        <aside className="flex-none w-[336px]">01</aside>
      </main>
    </Layout>
  )
}

export async function getStaticPaths(context) {
  // Get all pages from Strapi
  const articles = await context.locales.reduce(
    async (currentArticlesPromise, locale) => {
      const currentArticles = await currentArticlesPromise
      const localeArticles = await fetchAPI("/articles", {
        locale,
        fields: ["slug", "locale", "id"],
      })
      return [...currentArticles, ...localeArticles.data]
    },
    Promise.resolve([])
  )

  const paths = articles.map((article) => {
    const { id } = article
    const { slug, locale } = article.attributes
    // Decompose the slug that was saved in Strapi
    const slugArray = !slug ? false : slug
    const idArray = !id ? "" : id

    return {
      params: { id: JSON.stringify(idArray), slug: slugArray },
      // Specify the locale to render
      locale,
    }
  })

  return { paths, fallback: true }
}

export async function getStaticProps(context) {
  const { params, locale, locales, defaultLocale, preview = null } = context

  const globalLocale = await getGlobalData(locale)
  const advertisement = await getAdsData()
  //console.log(JSON.stringify(advertisement))
  // Fetch pages. Include drafts if preview mode is on
  const articleData = await getArticleData({
    slug: params.slug,
    id: params.id,
    locale,
    preview,
  })

  if (articleData == null) {
    // Giving the page no props will trigger a 404 page
    return { props: {} }
  }

  // We have the required page data, pass it to the page component
  const {
    title,
    summary,
    content,
    publishedAt,
    updatedAt,
    image,
    category,
    cities,
    tags,
    comment,
    reaction,
    metadata,
    localizations,
    slug,
  } = articleData.attributes

  const articleContent = {
    id: articleData.id,
    title,
    summary,
    content,
    publishedAt,
    updatedAt,
    image,
    category,
    cities,
    tags,
    comment,
    reaction,
  }

  const articleContext = {
    locale,
    locales,
    defaultLocale,
    slug,
    localizations,
  }

  const localizedPaths = getLocalizedPaths(articleContext)

  return {
    props: {
      preview,
      articleContent: articleContent,
      advertisement: advertisement,
      metadata,
      global: globalLocale.data,
      articleContext: {
        ...articleContext,
        localizedPaths,
      },
    },
    revalidate: 15,
  }
}

export default DynamicArticle
