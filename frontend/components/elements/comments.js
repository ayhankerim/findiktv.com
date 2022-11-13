import { signOut, useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"
import { fetchAPI } from "utils/api"
import { getStrapiMedia } from "utils/media"
import { useRouter } from "next/router"
import { MdComment } from "react-icons/md"
import Image from "next/image"

const Comments = ({ article, comment }) => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session == null) return
    console.log("session.jwt", session.jwt)
  }, [session])

  //console.log(comment)
  return (
    <section className="commentSection">
      <div className="flex flex-row items-center justify-between border-b border-midgray">
        <h4 className="font-semibold text-base text-midgray">
          YORUM YAZIN! (Üye olmadan da yorum yazabilirsiniz)
        </h4>
        <MdComment className="text-lg text-midgray" />
      </div>
      <div className="grid grid-cols-10 gap-1 text-xs mt-1 mb-4">
        Yorum listesi
      </div>

      <h1>{session ? "Authenticated" : "Not Authenticated"}</h1>
      {session && (
        <div style={{ marginBottom: 10 }}>
          <h3>Session Data</h3>
          <div>Email: {session.user.email}</div>
          <div>JWT from Strapi: Check console</div>
        </div>
      )}
      {session ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <Link href="/auth/sign-in">
          <a>Sign In</a>
        </Link>
      )}
      <Link href="/auth/protected">
        <a
          style={{
            marginTop: 10,
          }}
        >
          Protected Page
        </a>
      </Link>
    </section>
  )
}

export default Comments
