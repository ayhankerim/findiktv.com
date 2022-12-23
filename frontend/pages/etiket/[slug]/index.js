import React, { useEffect } from "react"
import ErrorPage from "next/error"
import {
  getTagData,
  getAdsData,
  //getCommentsData,
  fetchAPI,
  getGlobalData,
} from "@/utils/api"
import Seo from "@/components/elements/seo"
import Image from "next/image"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
//import { getLocalizedPaths } from "@/utils/localize"

// The file is called [[...slug]].js because we're using Next's
// optional catch all routes feature. See the related docs:
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes

const DynamicTags = ({
  categoryContent,
  advertisement,
  metadata,
  preview,
  global,
  categoryContext,
}) => {
  const router = useRouter()
  // Check if the required data was provided
  if (!router.isFallback && !categoryContent) {
    return <ErrorPage statusCode={404} />
  }

  // Loading screen (only possible in preview mode)
  if (router.isFallback) {
    return <div className="container">Yükleniyor...</div>
  }

  // Merge default site SEO settings with page specific SEO settings
  if (metadata && metadata.shareImage.data == null) {
    delete metadata.shareImage
  }
  const metadataWithDefaults = {
    ...global.attributes.metadata,
    ...metadata,
  }
  console.log("categoryContent", categoryContent)
  return (
    <Layout
      global={global}
      pageContext={categoryContext}
      advertisement={advertisement}
    >
      {/* Add meta tags for SEO*/}
      <Seo metadata={metadataWithDefaults} />
      {/* Display content sections */}
      {/* <Sections sections={sections} preview={preview} /> */}
      <main className="container flex flex-col sm:flex-row items-start justify-between gap-4 pt-2 bg-white">
        <div className="relative h-20 w-20">{categoryContent.title}</div>
      </main>
    </Layout>
  )
}

export async function getStaticPaths(context) {
  // Get all pages from Strapi
  const categories = await context.locales.reduce(
    async (currentCategoriesPromise, locale) => {
      const currentCategories = await currentCategoriesPromise
      const localeCategories = await fetchAPI("/tags", {
        locale,
        fields: ["slug", "locale"],
      })
      return [...currentCategories, ...localeCategories.data]
    },
    Promise.resolve([])
  )

  const paths = categories.map((category) => {
    const { slug, locale } = category.attributes
    // Decompose the slug that was saved in Strapi
    const slugArray = !slug ? false : slug

    return {
      params: { slug: slugArray },
      // Specify the locale to render
      locale,
    }
  })

  return { paths, fallback: true }
}

export async function getStaticProps(context) {
  const { params, locale, locales, defaultLocale } = context

  const globalLocale = await getGlobalData(locale)
  const advertisement = await getAdsData()
  // Fetch pages. Include drafts if preview mode is on
  const categoryData = await getTagData({
    slug: params.slug,
    locale,
  })

  if (categoryData == null) {
    // Giving the page no props will trigger a 404 page
    return { props: {} }
  }

  // We have the required page data, pass it to the page component
  const { title, metadata, localizations, slug } = categoryData.attributes

  const categoryContent = {
    id: categoryData.id,
    title,
  }

  const categoryContext = {
    locale,
    locales,
    defaultLocale,
    slug,
    localizations,
  }

  //const localizedPaths = getLocalizedPaths(productContext)

  return {
    props: {
      categoryContent: categoryContent,
      advertisement: advertisement,
      metadata,
      global: globalLocale.data,
      categoryContext: {
        ...categoryContext,
        //localizedPaths,
      },
    },
    revalidate: 600,
  }
}

export default DynamicTags
