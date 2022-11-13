import React, { useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { fetchAPI } from "utils/api"
import { getStrapiMedia } from "utils/media"
import { useRouter } from "next/router"
import { MdOutlineEmojiEmotions } from "react-icons/md"
import Image from "next/image"

let zerovalue = {
  data: {
    id: 1,
    attributes: {
      angry: 0,
      dislike: 0,
      applause: 0,
      love: 0,
      sad: 0,
      shocked: 0,
      lol: 0,
    },
  },
}
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
    title: "Çok Komik",
    image: "/uploads/lol_e619944f09.gif",
  },
]

const Reactions = ({ article, reactions }) => {
  const initialvalues = {
    angry: false,
    dislike: false,
    applause: false,
    love: false,
    sad: false,
    shocked: false,
    lol: false,
  }
  const [check, setCheck] = useState(initialvalues)
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { mutate } = useSWRConfig()
  const loader = ({ src, width }) => {
    return getStrapiMedia(src)
  }

  const { data: reactionsData, error } = useSWR(
    reactions.data ? "/api/reactions/" + reactions.data.id : null,
    fetcher
  )

  const onSubmit = async (reactionsInfo) => {
    const { data: reactionsData } = await fetchAPI(
      `/reactions/${reactions.data.id}`,
      {},
      {
        method: "PUT",
        body: JSON.stringify({
          data: {
            [Object.entries(reactionsInfo)[0][0]]:
              Object.entries(reactionsInfo)[0][1],
          },
        }),
      }
    )
    setCheck({
      ...check,
      [Object.entries(reactionsInfo)[0][0]]:
        !check[Object.entries(reactionsInfo)[0][0]],
    })
  }

  let sum = 1
  reactionsData?.data?.attributes &&
    Object.entries(reactionsData.data?.attributes).map(([key, value]) => {
      if (key !== "createdAt" && key !== "updatedAt") {
        sum += value
      }
    })
  console.log(reactionsData)
  return (
    <section className="commentSection">
      <div className="flex flex-row items-center justify-between border-b border-midgray">
        <h4 className="font-semibold text-base text-midgray">
          BU İÇERİĞE EMOJİYLE TEPKİ VER!
        </h4>
        <MdOutlineEmojiEmotions className="text-lg text-midgray" />
      </div>
      <div className="grid grid-cols-10 gap-1 text-xs mt-1 mb-4">
        {emojis.map((emoji) => {
          return (
            <div className="flex flex-col" key={emoji.id}>
              <div className="flex flex-col h-[50px] justify-end mx-2 text-center">
                <span className="h-[20px]">
                  {reactionsData ? reactionsData.data?.attributes[emoji.id] : 0}
                </span>
                <div
                  style={{
                    height:
                      (30 * reactionsData
                        ? reactionsData?.data?.attributes[emoji.id]
                        : 1) /
                        sum +
                      "px",
                  }}
                  className="w-full h-[1px] bg-success"
                ></div>
              </div>
              <button
                className={`"w-full h-full ${
                  check[emoji.id]
                    ? "border border-b-2 border-secondary bg-white shadow-lg"
                    : "border border-b-2 border-midgray bg-lightgray"
                } hover:bg-white rounded`}
                onClick={async () => {
                  const newNum =
                    reactionsData?.data?.attributes[emoji.id] +
                    (check[emoji.id] ? -1 : 1)
                  const reactionsInfo = {
                    ...reactionsData?.data?.attributes[emoji.id],
                    [emoji.id]: newNum,
                  }
                  const options = {
                    optimisticData: reactionsInfo,
                    rollbackOnError: true,
                  }
                  mutate(
                    `/api/reactions/${reactions.data.id}`,
                    onSubmit(reactionsInfo),
                    options
                  )
                }}
              >
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
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Reactions
