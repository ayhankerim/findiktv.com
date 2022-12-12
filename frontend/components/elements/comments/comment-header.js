import React, { Fragment } from "react"
import { useSession } from "next-auth/react"
import { fetchAPI } from "utils/api"
import { useSWRConfig } from "swr"
import { useSelector } from "react-redux"
import ProfileCard from "@/components/elements/profile-card"
import Tooltip from "@/components/elements/tooltip"
import { Menu, Transition } from "@headlessui/react"
import { MdClose } from "react-icons/md"
import { TbDots } from "react-icons/tb"
import toast from "react-hot-toast"
import Link from "next/link"
import Moment from "moment"
import "moment/locale/tr"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const CommentHeader = ({ comment, slug, address }) => {
  const { data: session } = useSession()
  const pointedComment = useSelector((state) => state.comment.pointedComment)
  const { mutate } = useSWRConfig()
  const notify = (type, message) => {
    if (type === "success") {
      toast.success(message)
    } else if (type === "error") {
      toast.error(message)
    }
  }

  async function flagComment(comment) {
    try {
      await fetchAPI(
        `/comments/${comment}`,
        {},
        {
          method: "GET",
        }
      ).then(async (data) => {
        await fetchAPI(
          `/comments/${comment}`,
          {},
          {
            method: "PUT",
            body: JSON.stringify({
              data: {
                flag: data.data.attributes.flag + 1,
              },
            }),
          }
        )
        notify("success", "Şikayetiniz alınmıştır!")
      })
    } catch (error) {
      notify("error", "Şikayetiniz alınırken bir sorunla karşılaşıldı!")
    }
  }
  async function deleteComment(comment) {
    try {
      await fetchAPI(
        `/comments/${comment}`,
        {},
        {
          method: "PUT",
          body: JSON.stringify({
            data: {
              removed: true,
            },
          }),
        }
      ).then(async (data) => {
        mutate(address)
        notify("success", "Yorumunuz kaldırılmıştır!")
      })
    } catch (error) {
      notify("error", "Yorumunuz kaldırınırken bir sorunla karşılaşıldı!")
    }
  }
  return (
    <header className="flex justify-between gap-2 mb-2">
      <div className="flex gap-2">
        <ProfileCard author={comment.attributes.author.data}>
          <cite
            className={classNames(
              pointedComment === comment.id ? "bg-point/40" : "",
              "not-italic"
            )}
          >
            {" "}
            {comment.attributes.author.data.attributes.name +
              " " +
              comment.attributes.author.data.attributes.surname}{" "}
          </cite>
        </ProfileCard>
        <div
          className="text-midgray"
          title={Moment(comment.attributes.createdAt).format("LLLL")}
        >
          <Tooltip
            orientation="bottom"
            tooltipText={Moment(comment.attributes.createdAt).format("LLLL")}
          >
            <time
              dateTime={Moment(comment.attributes.createdAt).format("LLLL")}
            >
              {Moment(comment.attributes.createdAt).fromNow(true)}
            </time>
            <span className="ml-1">önce</span>
          </Tooltip>
        </div>
      </div>
      {comment.attributes.approvalStatus != "ignored" && (
        <nav className="">
          <Menu as="div" className="relative ml-3">
            {({ open }) => (
              <>
                <div>
                  <Menu.Button className="flex text-sm text-darkgray hover:text-secondary">
                    <span className="sr-only">Menü aç</span>
                    <span className="flex items-center">
                      {open ? (
                        <MdClose className="text-midgray" />
                      ) : (
                        <TbDots className="text-midgray" />
                      )}
                    </span>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {session &&
                      session.id === comment.attributes.author.data.id && (
                        <Menu.Item>
                          <button
                            onClick={() => {
                              deleteComment(comment.id)
                            }}
                            className="block w-full text-left hover:bg-lightgray px-4 py-2 text-sm text-danger"
                          >
                            Sil
                          </button>
                        </Menu.Item>
                      )}
                    <Menu.Item>
                      <Link
                        href={`https://api.whatsapp.com/send?text=Şu%20yoruma%20bir%20bak%20${slug}/yorum/${comment.id}&url=${slug}/yorum/${comment.id}`}
                        className="block w-full text-left hover:bg-lightgray px-4 py-2 text-sm text-gray-700"
                        target="_blank"
                        rel="nofollow"
                      >
                        Facebook`ta paylaş
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => {
                          notify("success", "Yorum bağlantısı kopyalandı!")
                          navigator.clipboard.writeText(
                            `${slug}/yorum/${comment.id}`
                          )
                        }}
                        className="block w-full text-left hover:bg-lightgray px-4 py-2 text-sm text-gray-700"
                      >
                        Yorum bağlantısını kopyala
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => {
                          flagComment(comment.id)
                        }}
                        className="block w-full text-left hover:bg-lightgray px-4 py-2 text-sm text-warning"
                      >
                        Şikayet et
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </nav>
      )}
    </header>
  )
}

export default CommentHeader
