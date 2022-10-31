import React from "react"
import { useRouter } from "next/router"
import Moment from "moment"
import "moment/locale/tr"
import { MdDateRange } from "react-icons/md"

const ArticleDates = ({ publishedAt, updatedAt }) => {
  const { locale } = useRouter()
  return (
    <div className="flex gap-2 text-sm mt-4 mb-2">
      <div className="flex flex-row items-center text-midgray mr-4">
        <MdDateRange className="mr-2" />
        <time className="mt-1 mr-2">
          {Moment(publishedAt).locale(locale).format("LL")}
        </time>
        <time className="mt-1">
          {Moment(publishedAt).locale(locale).format("HH:mm")}
        </time>
      </div>
      <div className="flex flex-row items-center text-midgray">
        <span className="mt-1 mr-2">Son Güncelleme:</span>
        <time className="mt-1 mr-2">
          {Moment(updatedAt).locale(locale).format("LL")}
        </time>
        <time className="mt-1">
          {Moment(updatedAt).locale(locale).format("HH:mm")}
        </time>
      </div>
    </div>
  )
}

export default ArticleDates
