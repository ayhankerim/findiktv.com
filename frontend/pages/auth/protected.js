import { getSession } from "next-auth/react"
import { getGlobalData } from "utils/api"
import Head from "next/head"
import Link from "next/link"
import styles from "@/styles/Home.module.css"

export default function Protected() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Strapi - Next - NextAuth</title>
      </Head>
      <h1>Protected Page</h1>
      <Link href="/">
        <a>Back to home page</a>
      </Link>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { locale } = context
  const globalLocale = await getGlobalData(locale)
  const session = await getSession(context)
  // Check if session exists or not, if not, redirect
  if (session == null) {
    return {
      redirect: {
        destination: "/auth/not-authenticated",
        permanent: true,
      },
    }
  }
  return {
    props: {
      global: globalLocale.data,
    },
  }
}
