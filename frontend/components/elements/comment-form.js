import React, { useState, useEffect, Fragment } from "react"
import { signOut, useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { fetchAPI } from "utils/api"
import * as yup from "yup"
import { Formik, Form, Field } from "formik"
import "react-quill/dist/quill.snow.css"

// const QuillNoSSRWrapper = dynamic(import("react-quill"), {
//   ssr: false,
//   loading: () => <p>Yükleniyor ...</p>,
// })

const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
]

export default function CommentForm(userData) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  const LeadSchema = yup.object().shape({
    content: yup
      .string()
      .min(14, "Çok kısa yorum girdiniz!")
      .max(1000, "Maksimum 1000 karakter olacak şekilde yorum ekleyeblirsiniz!")
      .required("Yorum eklemeniz gereklidir!"),
    name: yup
      .string()
      .min(2, "Çok kısa, lütfen kontrol ediniz!")
      .max(30, "Çok uzun, lütfen kontrol ediniz!")
      .required("İsminizi girmeniz gereklidir!"),
    surname: yup
      .string()
      .min(2, "Çok kısa, lütfen kontrol ediniz!")
      .max(30, "Çok uzun, lütfen kontrol ediniz!")
      .required("Soyisim girmeniz gereklidir!"),
    email: yup.string().email().required(),
  })
  //console.log("session.jwt", session, userData)
  return (
    <>
      <div
        className="text-darkgray mb-1"
        dangerouslySetInnerHTML={{
          __html: value,
        }}
      />
      <p>{value}</p>
      <Formik
        initialValues={{
          content: "",
          email: session ? userData.userData?.email : "",
          name: session ? userData.userData?.name : "",
          surname: session ? userData.userData?.surname : "",
        }}
        enableReinitialize
        validationSchema={LeadSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setLoading(true)

          try {
            setErrors({ api: null })
            await fetchAPI(
              "/comments",
              {},
              {
                method: "POST",
                body: JSON.stringify({
                  data: {
                    article: 14,
                    author: 1,
                    content: values.content,
                  },
                }),
              }
            )
          } catch (err) {
            setErrors({ api: err.message })
          }

          setLoading(false)
          setSubmitting(false)
        }}
      >
        {({
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        }) => (
          <div>
            <Form className="flex flex-col gap-4">
              <ReactQuill
                name="content"
                modules={modules}
                formats={formats}
                placeholder="Yorumunuz..."
                onChange={(value) => {
                  setFieldValue("content", value)
                  setFieldTouched("content", true)
                  setValue(value)
                }}
                //onChange={setValue}
                theme="snow"
              />
              {errors.content && (
                <p className="text-danger">{errors.content}</p>
              )}
              {!session && (
                <div className="flex gap-2">
                  <div className="flex flex-col w-1/3 gap-2">
                    <Field
                      className="text-base focus:outline-none py-4 md:py-0 px-4 border border-midgray"
                      type="text"
                      name="name"
                      value={session && userData.userData?.name}
                      placeholder="Adınız"
                    />
                    {errors.name && touched.name && (
                      <p className="text-danger">{errors.name}</p>
                    )}
                  </div>
                  <div className="flex flex-col w-1/3 gap-2">
                    <Field
                      className="text-base focus:outline-none py-4 md:py-0 px-4 border border-midgray"
                      type="text"
                      name="surname"
                      value={session && userData.userData?.surname}
                      placeholder="Soyadınız"
                    />
                    {errors.surname && touched.surname && (
                      <p className="text-danger">{errors.surname}</p>
                    )}
                  </div>
                  <div className="flex flex-col w-1/3 gap-2">
                    <Field
                      className="text-base focus:outline-none py-4 md:py-0 px-4 border border-midgray"
                      type="email"
                      name="email"
                      value={session && userData.userData?.email}
                      placeholder="email"
                    />
                    {errors.email && touched.email && (
                      <p className="text-danger">{errors.email}</p>
                    )}
                  </div>
                </div>
              )}
              {errors.api && (
                <p className="text-red-500 h-12 text-sm mt-1 ml-2 text-left">
                  {errors.api}
                </p>
              )}
              <button
                className="bg-secondary hover:bg-secondary/90 text-white rounded p-4 mb-4 text-base transition duration-150 ease-out md:ease-in"
                type="submit"
                disabled={isSubmitting}
              >
                Gönder
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </>
  )
}
