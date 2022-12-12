import React, { Fragment } from "react"
import Link from "next/link"
import { Menu, Transition } from "@headlessui/react"
import { signOut, useSession } from "next-auth/react"
import { useSelector, useDispatch } from "react-redux"
import {
  MdComment,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const CommentsHeader = () => {
  const { data: session } = useSession()
  const userData = useSelector((state) => state.user.userData)
  return (
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
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Profilim
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        href="/auth/setting"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Ayarlar
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="#"
                        onClick={signOut}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
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
  )
}

export default CommentsHeader
