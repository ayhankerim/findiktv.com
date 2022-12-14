import React from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import Link from "next/link"
import {
  FaTelegramPlane,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaComment,
} from "react-icons/fa"
import { SiGooglenews } from "react-icons/si"

const ArticleDates = ({ position, title, slug }) => {
  const countedComment = useSelector((state) => state.comment.countedComment)
  const { locale } = useRouter()
  function scrolltoComments() {
    document.querySelector(".commentSection").scrollIntoView({
      behavior: "smooth",
    })
  }
  switch (position) {
    case "articleTop":
      return (
        <div className="flex justify-between text-sm mt-4 mb-2">
          <div className="flex gap-1">
            <Link
              href={`https://t.me/share/url?text=${title}${slug}&url=${slug}`}
              target="_blank"
              title="telegram ile paylaş"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'telegram'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#0088cc] text-[#0088cc] hover:text-white border border-[#0088cc] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <FaTelegramPlane className="inline-flex text-base mr-2" />
              <span>Telegram ile paylaş</span>
            </Link>
            <Link
              href={`https://api.whatsapp.com/send?text=${title}${slug}&url=${slug}`}
              target="_blank"
              title="Whatsapp ile paylaş"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'whatsapp'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#075e54] text-[#075e54] hover:text-white border border-[#075e54] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <FaWhatsapp className="inline-flex text-base mr-2" />
              <span>Whatsapp ile paylaş</span>
            </Link>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${slug}&quote=${title}`}
              target="_blank"
              title="Facebook ile paylaş"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'facebook'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#4267B2] text-[#4267B2] hover:text-white border border-[#4267B2] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <FaFacebookF className="inline-flex text-base" />
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?text=${title}&url=${slug}`}
              target="_blank"
              title="Twitter ile paylaş"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'twitter'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white border border-[#1DA1F2] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <FaTwitter className="inline-flex text-base" />
            </Link>
            <button
              type="button"
              title="Yorumlar"
              onClick={() => {
                scrolltoComments()
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'comments'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#ff9d00] text-[#ff9d00] hover:text-white border border-[#ff9d00] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
            >
              <FaComment className="inline-flex text-base mr-2" />
              <span>{countedComment}</span>
            </button>
          </div>
          <div className="flex flex-row items-center gap-2 text-midgray">
            <span>Abone Ol</span>
            <Link
              href="https://news.google.com/publications/CAAiEATMSmX53ZjtQ4kcyzxQ1_IqFAgKIhAEzEpl-d2Y7UOJHMs8UNfy"
              target="_blank"
              title="Google News'e Abone Ol"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'googlenews'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#DB4437] text-[#DB4437] hover:text-white border border-[#DB4437] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <SiGooglenews className="inline-flex text-base mr-1" />
              <span>Google News</span>
            </Link>
          </div>
        </div>
      )
    case "articleBottom":
      return (
        <div className="flex justify-between text-sm mt-4 mb-2">
          <div className="flex gap-1">
            <Link
              href={`https://t.me/share/url?text=${title}${slug}&url=${slug}`}
              target="_blank"
              title="telegram ile paylaş"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'telegram'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#0088cc] text-[#0088cc] hover:text-white border border-[#0088cc] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <FaTelegramPlane className="inline-flex text-base mr-2" />
              <span>Telegram ile paylaş</span>
            </Link>
            <Link
              href={`https://api.whatsapp.com/send?text=${title}${slug}&url=${slug}`}
              target="_blank"
              title="Whatsapp ile paylaş"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'whatsapp'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#075e54] text-[#075e54] hover:text-white border border-[#075e54] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <FaWhatsapp className="inline-flex text-base mr-2" />
              <span>Whatsapp ile paylaş</span>
            </Link>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${slug}&quote=${title}`}
              target="_blank"
              title="Facebook ile paylaş"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'facebook'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#4267B2] text-[#4267B2] hover:text-white border border-[#4267B2] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <FaFacebookF className="inline-flex text-base" />
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?text=${title}&url=${slug}`}
              target="_blank"
              title="Twitter ile paylaş"
              onClick={() => {
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'twitter'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white border border-[#1DA1F2] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
              passHref
            >
              <FaTwitter className="inline-flex text-base" />
            </Link>
            <button
              type="button"
              title="Yorumlar"
              onClick={() => {
                scrolltoComments()
                ;("gtag('event', 'detay', {'event_category': 'share','event_label': 'comments'});")
              }}
              className="flex flex-row items-center text-xs hover:bg-[#ff9d00] text-[#ff9d00] hover:text-white border border-[#ff9d00] transition duration-150 ease-out hover:ease-in px-2 py-1 rounded"
            >
              <FaComment className="inline-flex text-base mr-2" />
              <span>{countedComment}</span>
            </button>
          </div>
        </div>
      )
    default:
      return "articleTop"
  }
}

export default ArticleDates
