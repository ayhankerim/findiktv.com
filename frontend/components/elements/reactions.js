import React, { useState, useEffect } from "react"
import { Form, Formik } from "formik"
import { fetchAPI } from "utils/api"
import { getStrapiMedia } from "utils/media"
import { useRouter } from "next/router"
import { MdOutlineEmojiEmotions } from "react-icons/md"
import Image from "next/image"
import Loader from "./loader"

const EmojiStatus = ({ article, data, emoji }) => {
  const [reactionCount, setReactionCount] = useState(data.attributes[emoji.id])
  const [check, setCheck] = useState(false)
  const [sum, setSum] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const loader = ({ src, width }) => {
    return getStrapiMedia(src)
  }

  useEffect(() => {
    let count = 0
    Object.entries(data.attributes).map(([key, value]) => {
      count += value
    })
    setTotal(count)
    count === 0 ? setSum(1) : setSum((30 * reactionCount) / count)
  }, [data.attributes, reactionCount])
  return (
    <>
      <div className="flex flex-col h-[50px] justify-end mx-2 text-center">
        <span className="h-[20px]">{reactionCount}</span>
        <div
          style={{ height: sum + "px" }}
          className="w-full h-[1px] bg-success"
        ></div>
      </div>
      <Formik
        initialValues={{}}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setLoading(true)
          setCheck((prevCheck) => !prevCheck)
          try {
            setErrors({ api: null })
            if (total === 0) {
              await fetchAPI(
                "/reactions",
                {},
                {
                  method: "POST",
                  body: JSON.stringify({
                    data: {
                      angry: emoji.id === "angry" ? 1 : 0,
                      lol: emoji.id === "lol" ? 1 : 0,
                      sad: emoji.id === "sad" ? 1 : 0,
                      article: article,
                      applause: emoji.id === "applause" ? 1 : 0,
                      dislike: emoji.id === "dislike" ? 1 : 0,
                      love: emoji.id === "love" ? 1 : 0,
                      shocked: emoji.id === "shocked" ? 1 : 0,
                    },
                  }),
                }
              )
            } else {
              console.log(emoji)
            }
          } catch (err) {
            setErrors({ api: err.message })
          }

          setLoading(false)
          setSubmitting(false)
        }}
        render={({ errors, touched, isSubmitting }) => (
          <Form
            className={`${
              check
                ? "border border-b-2 border-secondary bg-white shadow-lg"
                : "border border-b-2 border-midgray bg-lightgray"
            } hover:bg-white rounded`}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-full"
            >
              {loading && <Loader />}
              <Image
                loader={loader}
                layout="responsive"
                width="72"
                height="72"
                objectFit="contain"
                src={emoji.image}
                alt={emoji.title}
                unoptimized={true}
              />
            </button>
          </Form>
        )}
      />
    </>
  )
}

const ArticleEmoji = ({ article, reactions }) => {
  const { locale } = useRouter()
  let emojis = [
    {
      id: "angry",
      title: "Kızgın",
      image: "/uploads/angry_2527bcc861.gif",
    },
    {
      id: "sad",
      title: "Üzgün",
      image: "/uploads/das_118d65fe99.gif",
    },
    {
      id: "dislike",
      title: "Sevmedim",
      image: "/uploads/dislike_9ccbadb9bb.gif",
    },
    {
      id: "shocked",
      title: "Ben şok",
      image: "/uploads/shocked_ca1e6d1790.gif",
    },
    {
      id: "love",
      title: "Sevdim",
      image: "/uploads/love_4c7259b16b.gif",
    },
    {
      id: "applause",
      title: "Alkışı hakediyor",
      image: "/uploads/applause_ba702e4eac.gif",
    },
    {
      id: "lol",
      title: "Çok Kimik",
      image: "/uploads/lol_e619944f09.gif",
    },
  ]
  let ractionsData
  reactions.data === null
    ? (ractionsData = {
        id: 1,
        attributes: {
          angry: 0,
          sad: 0,
          dislike: 0,
          shocked: 0,
          love: 0,
          applause: 0,
          lol: 0,
        },
      })
    : (ractionsData = reactions.data)
  return (
    <section className="commentSection">
      <div className="flex flex-row items-center justify-between border-b border-midgray">
        <h4 className="font-semibold text-base text-midgray">
          BU İÇERİĞE EMOJİYLE TEPKİ VER!
        </h4>
        <MdOutlineEmojiEmotions className="text-lg text-midgray" />
      </div>
      <div className="grid grid-cols-10 gap-1 text-xs my-4">
        {emojis.map((item) => (
          <div key={item.id} className="flex flex-col">
            <EmojiStatus article={article} data={ractionsData} emoji={item} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ArticleEmoji
