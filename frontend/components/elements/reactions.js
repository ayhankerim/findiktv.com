import React, { useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { fetchAPI } from "utils/api"
import { getStrapiMedia } from "utils/media"
import { MdOutlineEmojiEmotions } from "react-icons/md"
import Image from "next/image"
import Tooltip from "@/components/elements/tooltip"

let emojis = [
  {
    id: "angry",
    title: "Kızgınım",
    image: "/uploads/angry_3c2da737bc.gif?updated_at=2022-12-12T12:33:18.303Z",
  },
  {
    id: "sad",
    title: "Üzüldüm",
    image: "/uploads/sad_c58837fb89.gif?updated_at=2022-12-12T12:33:18.083Z",
  },
  {
    id: "dislike",
    title: "Sevmedim",
    image:
      "/uploads/dislike_17e65c1265.gif?updated_at=2022-12-12T12:33:18.090Z",
  },
  {
    id: "shocked",
    title: "Ben şok",
    image:
      "/uploads/shocked_7879b8bc9e.gif?updated_at=2022-12-12T12:33:18.138Z",
  },
  {
    id: "love",
    title: "Sevdim",
    image: "/uploads/love_923b6d2b63.gif?updated_at=2022-12-12T12:33:18.088Z",
  },
  {
    id: "applause",
    title: "Alkışı hakediyor",
    image:
      "/uploads/applause_2175213bdc.gif?updated_at=2022-12-12T12:33:18.073Z",
  },
  {
    id: "lol",
    title: "Çok Komik",
    image: "/uploads/lol_bdbc0d5e86.gif?updated_at=2022-12-12T12:33:18.084Z",
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
  return (
    <section className="reactionSection">
      <div className="flex flex-row items-center justify-between border-b border-midgray">
        <h4 className="font-semibold text-base text-midgray">
          BU İÇERİĞE EMOJİYLE TEPKİ VER!
        </h4>
        <MdOutlineEmojiEmotions className="text-lg text-midgray" />
      </div>
      <div className="grid grid-cols-12 gap-1 text-xs mt-1 mb-4">
        {emojis.map((emoji) => {
          return (
            <div className="flex flex-col" key={emoji.id}>
              <div className="flex flex-col h-[50px] justify-end mx-1 text-center">
                <span className="h-[20px]">
                  {reactionsData ? reactionsData.data?.attributes[emoji.id] : 0}
                </span>
                <div
                  style={{
                    height:
                      (30 *
                        (reactionsData
                          ? reactionsData?.data?.attributes[emoji.id]
                          : 1)) /
                        sum +
                      "px",
                  }}
                  className="w-full min-h-[1px] bg-success transition duration-150 ease-out md:ease-in"
                ></div>
              </div>
              <Tooltip orientation="bottom" tooltipText={emoji.title}>
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
                    width="64"
                    height="64"
                    src={emoji.image}
                    alt={emoji.title}
                    unoptimized={true}
                  />
                </button>
              </Tooltip>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Reactions
