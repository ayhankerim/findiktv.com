import { useRouter } from "next/router"
import ErrorPage from "next/error"
import { getAdsData, fetchAPI, getGlobalData } from "@/utils/api"

function Urunler({ advertisement, global, productContext }) {
  const router = useRouter()
  const { section } = router.query
  return <div>Sayfalar: {section}</div>
}

export async function getStaticProps(context) {
  const { params, locale, locales, defaultLocale } = context

  const globalLocale = await getGlobalData(locale)
  const advertisement = await getAdsData()

  const productContext = {
    locale,
    locales,
    defaultLocale,
  }

  //const localizedPaths = getLocalizedPaths(productContext)

  return {
    props: {
      advertisement: advertisement,
      global: globalLocale.data,
      productContext: {
        ...productContext,
      },
    },
    revalidate: 60,
  }
}

export default Urunler
