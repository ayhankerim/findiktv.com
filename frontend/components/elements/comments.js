import React, { useState, useEffect, Fragment } from "react"
import { signOut, useSession } from "next-auth/react"
import { useSelector, useDispatch } from "react-redux"
import { pointComment } from "@/store/comment"
import Link from "next/link"
import { Menu, Transition } from "@headlessui/react"
import axios from "axios"
import { getStrapiMedia } from "utils/media"
import Image from "next/image"
import Moment from "moment"
import "moment/locale/tr"
import {
  MdComment,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdPerson,
  MdClose,
  MdThumbUp,
  MdThumbDown,
} from "react-icons/md"
import { RiShareForwardFill } from "react-icons/ri"
import { TbDots } from "react-icons/tb"
import ProfileCard from "@/components/elements/profile-card"
import CommentForm from "@/components/elements/comment-form"
import Tooltip from "@/components/elements/tooltip"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}
const loader = ({ src, width }) => {
  return getStrapiMedia(src)
}

const CommentItem = ({ comment, article }) => {
  const [reply, setReply] = useState(0)
  const [userData, setUserData] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const { data: session } = useSession()
  const dispatch = useDispatch()
  const pointedComment = useSelector((state) => state.comment.pointedComment)
  function scrolltoComment(id) {
    document.querySelector("#comment-" + id).scrollIntoView({
      behavior: "smooth",
    })
  }
  useEffect(() => {
    if (session == null) return
    session &&
      (async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/me?populate=avatar,city`,
            {
              headers: {
                Authorization: `Bearer ${session.jwt}`,
              },
            }
          )
          setUserData(response.data)
        } catch (error) {
          setError(error.message)
        } finally {
          setLoaded(true)
        }
      })()
  }, [session])
  //console.log("comment", comment)
  return (
    <>
      <div
        id={`comment-${comment.id}`}
        className={`flex items-start gap-2 border-b pb-2  transition duration-400 ease-in ease-out ${
          pointedComment === comment.id ? "bg-point/40" : ""
        }`}
      >
        <div className="flex-none w-[55px] h-[55px] relative">
          {comment.attributes.author.data.attributes.avatar.data ? (
            <Image
              loader={loader}
              className="rounded"
              fill
              sizes="100vw"
              style={{
                objectFit: "cover",
              }}
              src={
                comment.attributes.author.data.attributes.avatar.data.attributes
                  .formats.thumbnail.url
              }
              alt={
                comment.attributes.author.data.attributes.avatar.data.attributes
                  .alternativeText
              }
            />
          ) : (
            <MdPerson style={{ width: 55, height: 55 }} />
          )}
        </div>
        <div className="flex-auto">
          <div className="flex justify-between gap-2 mb-2">
            <div className="flex gap-2">
              <ProfileCard author={comment.attributes.author.data}>
                <span
                  className={`${
                    comment.attributes.author.data.attributes.blocked
                      ? "line-through text-danger/50"
                      : ""
                  }`}
                >
                  {comment.attributes.author.data.attributes.name +
                    " " +
                    comment.attributes.author.data.attributes.surname}{" "}
                </span>
              </ProfileCard>
              <div
                className="text-midgray"
                title={Moment(comment.attributes.createdAt).format("LLLL")}
              >
                {Moment(comment.attributes.createdAt).fromNow(true)} önce
              </div>
              {comment.attributes.threadOf.data &&
                comment.attributes.threadOf.data?.id !=
                  comment.attributes.reply_to.data?.id && (
                  <div className="flex items-center text-midgray gap-1">
                    <RiShareForwardFill />{" "}
                    <i>
                      {
                        comment.attributes.reply_to.data.attributes.author.data
                          .attributes.name
                      }{" "}
                      {
                        comment.attributes.reply_to.data.attributes.author.data
                          .attributes.surname
                      }{" "}
                    </i>
                    tarafından yapılan
                    <button
                      className="underline"
                      onClick={() => {
                        scrolltoComment(comment.attributes.reply_to.data.id)
                        dispatch(
                          pointComment(comment.attributes.reply_to.data.id)
                        )
                        setTimeout(() => dispatch(pointComment(0)), 3000)
                      }}
                    >
                      yoruma
                    </button>{" "}
                    cevaben
                  </div>
                )}
            </div>
            <div className="">
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="#"
                              onClick={signOut}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Facebook`ta paylaş
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/auth/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Yorum bağlantısını kopyala
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/auth/setting"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-danger"
                              )}
                            >
                              Şikayet et
                            </Link>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
          <div
            className="text-darkgray text-base mb-1"
            dangerouslySetInnerHTML={{
              __html: comment.attributes.content,
            }}
          />
          <div className="flex items-center justify-between gap-2 text-midgray">
            <button
              type="button"
              onClick={() => setReply(reply === 0 ? comment.id : 0)}
            >
              {reply === 0 ? "Yanıtla" : "Vazgeç"}
            </button>
            <div className="flex gap-2">
              <Tooltip orientation="bottom" tooltipText="Katılıyorum">
                <Link
                  href="/"
                  passHref
                  className="flex justify-between items-center gap-2 py-1 px-2 border rounded hover:text-dark"
                >
                  <MdThumbUp />
                  <span className="text-success">
                    {comment.attributes.like}
                  </span>
                </Link>
              </Tooltip>
              <Tooltip orientation="bottom" tooltipText="Katılmıyorum">
                <Link
                  href="/"
                  passHref
                  className="flex justify-between items-center gap-2 py-1 px-2 border rounded hover:text-dark"
                >
                  <MdThumbDown />
                  <span className="text-danger">
                    {comment.attributes.dislike}
                  </span>
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {reply === comment.id && (
        <CommentForm
          userData={userData}
          article={article}
          replyto={comment.id}
          threadOf={
            comment.attributes.threadOf.data
              ? comment.attributes.threadOf.data.id
              : comment.id
          }
          commentId={reply}
        >
          <button
            className="w-full border border-midgray hover:border-dark text-midgray hover:text-dark  rounded p-4 mb-4 text-base transition duration-150 ease-out md:ease-in"
            type="button"
            onClick={() => setReply(0)}
          >
            Vazgeç
          </button>
        </CommentForm>
      )}
    </>
  )
}

const Comments = ({ article, comments }) => {
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState("")
  const [loaded, setLoaded] = useState(false)
  const { data: session } = useSession()
  useEffect(() => {
    if (session == null) return
    session &&
      (async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/me?populate=avatar,city`,
            {
              headers: {
                Authorization: `Bearer ${session.jwt}`,
              },
            }
          )
          setUserData(response.data)
        } catch (error) {
          setError(error.message)
        } finally {
          setLoaded(true)
        }
      })()
  }, [session])
  return (
    <section className="commentSection">
      <div className="flex flex-row items-center justify-between border-b border-midgray">
        <h4 className="font-semibold text-base text-midgray">
          YORUM YAZIN! {session ? "" : "(Üye olmadan da yorum yazabilirsiniz)"}
        </h4>
        <div className="flex gap-2">
          {session ? (
            <Menu as="div" className="relative ml-3">
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button className="flex text-sm text-darkgray hover:text-secondary">
                      <span className="sr-only">Menü aç</span>
                      <span className="flex items-center">
                        {userData?.name || userData?.surname
                          ? userData?.name + " " + userData?.surname
                          : userData?.email}
                        {open ? (
                          <MdKeyboardArrowUp className="ml-1" />
                        ) : (
                          <MdKeyboardArrowDown className="ml-1" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/auth/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Profilim
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/auth/setting"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Ayarlar
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="#"
                            onClick={signOut}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Çıkış yap
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          ) : (
            <div className="flex gap-1">
              <Link className="text-secondary" href="/auth/register">
                Üye Ol
              </Link>
              veya
              <Link className="text-secondary" href="/auth/sign-in">
                Giriş Yap
              </Link>
            </div>
          )}
          <MdComment className="text-lg text-midgray" />
        </div>
      </div>
      <CommentForm userData={userData} article={article} commentId="0" />
      {comments.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center border-b border-midgray">
            <h4 className="font-semibold text-base text-midgray">Yorumlar</h4>
            <div className="font-semibold text-sm text-midgray">
              {comments.length} yorum
            </div>
          </div>
          <ul className="flex flex-col gap-4">
            {comments &&
              comments
                .filter((comment) => comment.attributes.threadOf.data === null)
                .map((comment) => {
                  return (
                    <li className="" key={comment.id}>
                      <CommentItem comment={comment} article={article} />
                      {comments.filter(
                        (subComment) =>
                          subComment.attributes.threadOf.data?.id === comment.id
                      ).length > 0 && (
                        <ul className="ml-10">
                          {comments
                            .filter(
                              (subComment) =>
                                subComment.attributes.threadOf.data?.id ===
                                comment.id
                            )
                            .sort((a, b) => (a.id > b.id ? 1 : -1))
                            .map((subComment) => {
                              return (
                                <li className={`my-2`} key={subComment.id}>
                                  <CommentItem
                                    comment={subComment}
                                    article={article}
                                  />
                                </li>
                              )
                            })}
                        </ul>
                      )}
                    </li>
                  )
                })}
          </ul>
        </div>
      ) : (
        <div className="">İlk yorumu sen ekle</div>
      )}
    </section>
  )
}

export default Comments
