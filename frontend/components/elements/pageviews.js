import { useEffect } from "react"
import { fetchAPI } from "@/utils/api"
import useSWR from "swr"
import { MdOutlineRemoveRedEye } from "react-icons/md"

async function fetcher(...args) {
  const res = await fetch(...args)
  return res.json()
}

export default function ViewCounter({ articleId, blogPage = false }) {
  const { data } = useSWR(`/api/articles/${articleId}?fields[0]=view`, fetcher)
  const views = new Number(data?.data.attributes.view)

  const registerView = async () =>
    await fetchAPI(
      `/articles/${articleId}`,
      {},
      {
        method: "PUT",
        body: JSON.stringify({
          data: {
            view: data.data.attributes.view ? data.data.attributes.view + 1 : 1,
          },
        }),
      }
    )
  if (blogPage) {
    data && registerView()
  }

  return (
    <>
      <div className="flex items-center gap-1 text-xs text-midgray">
        <MdOutlineRemoveRedEye className="inline-block" />
        <span>
          {views > 0
            ? views < 1000
              ? Math.floor(Math.random() * (900 - 300 + 1)) + 300
              : views.toLocaleString()
            : "–––"}{" "}
          gösterim
        </span>
      </div>
    </>
  )
}
