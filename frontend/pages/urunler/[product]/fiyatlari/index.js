import React, { useEffect } from "react"
import ErrorPage from "next/error"
import {
  getProductData,
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

const DynamicProducts = ({
  productContent,
  advertisement,
  metadata,
  preview,
  global,
  productContext,
}) => {
  const router = useRouter()
  // Check if the required data was provided
  if (!router.isFallback && !productContent.content?.length) {
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
  console.log("productContent", productContent)
  return (
    <Layout
      global={global}
      pageContext={productContext}
      advertisement={advertisement}
    >
      {/* Add meta tags for SEO*/}
      <Seo metadata={metadataWithDefaults} />
      {/* Display content sections */}
      {/* <Sections sections={sections} preview={preview} /> */}
      <main className="container flex flex-col sm:flex-row items-start justify-between gap-4 pt-2 bg-white">
        <div className="relative h-20 w-20">
          <Image
            src={productContent.featured.data.attributes.formats.large.url}
            fill
            alt="kerim"
          />
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticPaths(context) {
  // Get all pages from Strapi
  const products = await context.locales.reduce(
    async (currentProductsPromise, locale) => {
      const currentProducts = await currentProductsPromise
      const localeProducts = await fetchAPI("/products", {
        locale,
        fields: ["slug", "locale"],
      })
      return [...currentProducts, ...localeProducts.data]
    },
    Promise.resolve([])
  )

  const paths = products.map((product) => {
    const { slug, locale } = product.attributes
    // Decompose the slug that was saved in Strapi
    const slugArray = !slug ? false : slug

    return {
      params: { product: slugArray },
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
  //const comments = params ? await getCommentsData(params.id) : null
  //console.log(JSON.stringify(comments))
  // Fetch pages. Include drafts if preview mode is on
  const productData = await getProductData({
    product: params.product,
    locale,
  })

  if (productData == null) {
    // Giving the page no props will trigger a 404 page
    return { props: {} }
  }

  // We have the required page data, pass it to the page component
  const { title, content, featured, metadata, localizations, slug } =
    productData.attributes

  const productContent = {
    id: productData.id,
    title,
    content,
    featured,
  }

  const productContext = {
    locale,
    locales,
    defaultLocale,
    slug,
    localizations,
  }

  //const localizedPaths = getLocalizedPaths(productContext)

  return {
    props: {
      productContent: productContent,
      advertisement: advertisement,
      metadata,
      global: globalLocale.data,
      productContext: {
        ...productContext,
        //localizedPaths,
      },
    },
    revalidate: 60,
  }
}

export default DynamicProducts
