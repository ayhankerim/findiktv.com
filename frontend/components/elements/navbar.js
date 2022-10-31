import { useState } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { useRouter } from "next/router"

import { getButtonAppearance } from "utils/button"
import { mediaPropTypes, linkPropTypes, buttonLinkPropTypes } from "utils/types"
import { MdMenu, MdLogin, MdAutoGraph, MdOutlineSearch } from "react-icons/md"
import { FiYoutube } from "react-icons/fi"
import MobileNavMenu from "./mobile-nav-menu"
import ButtonLink from "./button-link"
import NextImage from "./image"
import Image from "next/image"
import CustomLink from "./custom-link"
import LocaleSwitch from "../locale-switch"
import Advertisement from "@/components/elements/advertisement"

const Navbar = ({ navbar, pageContext, advertisement }) => {
  const router = useRouter()
  const [mobileMenuIsShown, setMobileMenuIsShown] = useState(false)

  return (
    <>
      {/* The actual navbar */}
      <header className="pt-6 sm:pt-2">
        <div className="container flex flex-row items-center justify-between gap-2 pt-2 bg-white">
          {/* Content aligned to the left */}
          <div className="flex w-2/12">
            <Link href="/">
              <a className="">
                <NextImage
                  width={navbar.logo.data.attributes.width}
                  height={navbar.logo.data.attributes.height}
                  media={navbar.logo}
                />
              </a>
            </Link>
          </div>
          <div className="flex w-7/12">
            <Advertisement
              advertisement={
                advertisement.filter(
                  (placeholder) =>
                    placeholder.attributes.placeholder === "header-top-desktop"
                )[0].attributes.code
              }
            />
          </div>
          <div className="flex justify-end w-3/12">
            {/* Hamburger menu on mobile */}
            <button
              onClick={() => setMobileMenuIsShown(true)}
              className="p-1 block md:hidden"
            >
              <MdMenu className="h-8 w-auto" />
            </button>
            {/* CTA button on desktop */}
            {navbar.button && (
              <div className="hidden md:block">
                <ul className="grid grid-cols-3 gap-2">
                  <li className="transition duration-150 ease-out hover:ease-in hover:bg-dark shadow-sm hover:shadow-2xl hover:shadow-primary text-darkgray hover:text-white border border-darkgray rounded">
                    <Link href="/giris-yap">
                      <a className="flex flex-col items-center text-center">
                        <MdAutoGraph className="text-xxl m-4" />
                        <span className="inline-flex m-2">Fiyatlar</span>
                      </a>
                    </Link>
                  </li>
                  <li className="transition duration-150 ease-out hover:ease-in hover:bg-dark shadow-sm hover:shadow-2xl hover:shadow-primary text-darkgray hover:text-white border border-darkgray rounded">
                    <Link href="/giris-yap">
                      <a className="flex flex-col items-center text-center">
                        <FiYoutube className="text-xxl m-4" />
                        <span className="inline-flex m-2">İzle</span>
                      </a>
                    </Link>
                  </li>
                  <li className="transition duration-150 ease-out hover:ease-in hover:bg-primary shadow-sm hover:shadow-2xl hover:shadow-dark text-center text-primary hover:text-white border border-primary rounded">
                    <Link href="/giris-yap">
                      <a className="flex flex-col items-center">
                        <MdLogin className="text-xxl m-4" />
                        <span className="inline-flex m-2">Giriş Yap</span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <nav className="container flex flex-row items-center justify-between border-b-2 border-gray bg-white">
          {/* Content aligned to the left */}
          <div className="flex flex-row items-center relative bottom-[-2px]">
            {/* List of links on desktop */}
            <ul className="hidden list-none md:flex flex-row gap-4 items-baseline">
              {navbar.links.map((navLink) => (
                <li
                  className="border-b-2 border-transparent hover:border-b-2 hover:border-b-secondary "
                  key={navLink.id}
                >
                  <CustomLink link={navLink} locale={router.locale}>
                    <div className="text-base font-bold hover:text-secondary px-2 py-1">
                      {navLink.text}
                    </div>
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-row items-center relative bottom-[-2px]">
            <ul className="hidden list-none md:flex flex-row gap-4 items-baseline">
              <li className="border-b-2 border-transparent">
                <Link href="#">
                  <a>
                    <div className="text-xl font-bold hover:text-secondary px-2 py-1">
                      <MdOutlineSearch />
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container flex flex-row items-center justify-center gap-2 py-2">
          <Advertisement
            advertisement={
              advertisement.filter(
                (placeholder) =>
                  placeholder.attributes.placeholder === "header-big-desktop"
              )[0].attributes.code
            }
          />
        </div>
      </header>

      {/* Mobile navigation menu panel */}
      {mobileMenuIsShown && (
        <MobileNavMenu
          navbar={navbar}
          closeSelf={() => setMobileMenuIsShown(false)}
        />
      )}
    </>
  )
}

Navbar.propTypes = {
  navbar: PropTypes.shape({
    logo: PropTypes.shape({
      image: mediaPropTypes,
      url: PropTypes.string,
    }),
    links: PropTypes.arrayOf(linkPropTypes),
    button: buttonLinkPropTypes,
  }),
  initialLocale: PropTypes.string,
}

export default Navbar
