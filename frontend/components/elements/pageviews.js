import { useEffect } from "react"
import useSWR from "swr"
import { MdOutlineRemoveRedEye } from "react-icons/md"

async function fetcher(...args) {
  const res = await fetch(...args)
  return res.json()
}

export default function ViewCounter({ slug, blogPage = false }) {
  const { data } = useSWR(`/api/views/${slug}`, fetcher)
  const views = new Number(data?.total)

  useEffect(() => {
    const registerView = () =>
      fetch(`/api/views/${slug}`, {
        method: "POST",
      })

    if (blogPage) {
      registerView()
    }
  }, [blogPage, slug])

  return (
    <>
      <span className="text-xs text-midgray">
        <MdOutlineRemoveRedEye className="inline-block" />
        {views > 0 ? views.toLocaleString() : "–––"} gösterim
      </span>
    </>
  )
}
