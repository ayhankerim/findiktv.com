import React, { useEffect } from "react"
import ErrorPage from "next/error"
import {
  getCityData,
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

const DynamicCities = ({
  cityContent,
  advertisement,
  metadata,
  preview,
  global,
  cityContext,
}) => {
  const router = useRouter()
  // Check if the required data was provided
  if (!router.isFallback && !cityContent) {
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
  console.log("cityContent", cityContent)
  return (
    <Layout
      global={global}
      pageContext={cityContext}
      advertisement={advertisement}
    >
      {/* Add meta tags for SEO*/}
      <Seo metadata={metadataWithDefaults} />
      {/* Display content sections */}
      {/* <Sections sections={sections} preview={preview} /> */}
      <main className="container flex flex-col sm:flex-row items-start justify-between gap-4 pt-2 bg-white">
        <div className="relative h-20 w-20">{cityContent.title}</div>
      </main>
    </Layout>
  )
}

export async function getStaticPaths(context) {
  // Get all pages from Strapi
  const cities = await context.locales.reduce(
    async (currentcitiesPromise, locale) => {
      const currentcities = await currentcitiesPromise
      const localecities = await fetchAPI("/cities", {
        locale,
        fields: ["slug", "locale"],
      })
      return [...currentcities, ...localecities.data]
    },
    Promise.resolve([])
  )

  const paths = cities.map((city) => {
    const { slug, locale } = city.attributes
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
  const cityData = await getCityData({
    slug: params.slug,
    locale,
  })

  if (cityData == null) {
    // Giving the page no props will trigger a 404 page
    return { props: {} }
  }

  // We have the required page data, pass it to the page component
  const { title, content, metadata, localizations, slug } = cityData.attributes

  const cityContent = {
    id: cityData.id,
    title,
    content,
  }

  const cityContext = {
    locale,
    locales,
    defaultLocale,
    slug,
    localizations,
  }

  //const localizedPaths = getLocalizedPaths(productContext)

  return {
    props: {
      cityContent: cityContent,
      advertisement: advertisement,
      metadata,
      global: globalLocale.data,
      cityContext: {
        ...cityContext,
        //localizedPaths,
      },
    },
    revalidate: 600,
  }
}

export default DynamicCities
