import React, { useState, useEffect, Fragment } from "react"
import { signOut, useSession } from "next-auth/react"
import { fetchAPI } from "utils/api"
import * as yup from "yup"
import { Formik, Form, Field } from "formik"
import "react-quill/dist/quill.snow.css"
import Dialog from "@/components/elements/dialog"
import { badwords } from "@/utils/badwords"
import { Transition } from "@headlessui/react"

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
    matchVisual: false,
  },
}
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

export default function CommentForm({
  userData,
  article,
  replyto,
  threadOf,
  commentId,
  children,
}) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const [clientIP, setClientIP] = useState(null)
  const [isShowing, setIsShowing] = useState(false)

  const loggedInSchema = yup.object().shape({
    content: yup
      .string()
      .min(14, "Çok kısa yorum girdiniz!")
      .max(1000, "Maksimum 1000 karakter olacak şekilde yorum ekleyeblirsiniz!")
      .required("Yorum eklemeniz gereklidir!")
      .test("Bad Word", "Yorum argo ifade içeremez!", function (value) {
        var error = 0
        for (var i = 0; i < badwords.length; i++) {
          var val = badwords[i]
          if (value?.toLowerCase().indexOf(val.toString()) > -1) {
            error = error + 1
          }
        }
        if (error > 0) {
          return false
        } else {
          return true
        }
      }),
    term: yup
      .bool()
      .oneOf([true], "Yorum yazma kurallarını onaylamanız gereklidir!"),
  })

  const notloggedInSchema = yup.object().shape({
    content: yup
      .string()
      .min(14, "Çok kısa yorum girdiniz!")
      .max(1000, "Maksimum 1000 karakter olacak şekilde yorum ekleyeblirsiniz!")
      .required("Yorum eklemeniz gereklidir!")
      .test("Bad Word", "Yorum argo ifade içeremez!", function (value) {
        var bad_words = badwords
        var check_text = value
        var error = 0
        for (var i = 0; i < bad_words.length; i++) {
          var val = bad_words[i]
          if (check_text?.toLowerCase().indexOf(val.toString()) > -1) {
            error = error + 1
          }
        }

        if (error > 0) {
          return false
        } else {
          return true
        }
      }),
    name: yup
      .string()
      .min(2, "Çok kısa, lütfen kontrol ediniz!")
      .max(30, "Çok uzun, lütfen kontrol ediniz!")
      .required("İsminizi girmeniz gereklidir!")
      .test("Bad Word", "Adınız argo ifade içeremez!", function (value) {
        var bad_words = badwords
        var check_text = value
        var error = 0
        for (var i = 0; i < bad_words.length; i++) {
          var val = bad_words[i]
          if (check_text?.toLowerCase().indexOf(val.toString()) > -1) {
            error = error + 1
          }
        }

        if (error > 0) {
          return false
        } else {
          return true
        }
      }),
    surname: yup
      .string()
      .min(2, "Çok kısa, lütfen kontrol ediniz!")
      .max(30, "Çok uzun, lütfen kontrol ediniz!"),
    email: yup
      .string()
      .email("Lütfen geçerli bir mail adresi giriniz!")
      .required("E-posta adresi gereklidir!")
      .test(
        "Unique Email",
        "Bu mail adresi kayıtlı! <a class='underline' href='/auth/sign-in'>Giriş</a> yapmanız gerekiyor.", // <- key, message
        function (value) {
          return new Promise((resolve, reject) => {
            if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{1,4}$/i.test(value)) {
              fetchAPI(
                `/users?filters[email][$eq]=${value}&filters[confirmed][$eq]=true&fields[0]=email`,
                {},
                {
                  method: "GET",
                }
              ).then((data) => {
                if (data.length > 0) {
                  resolve(false)
                } else {
                  resolve(true)
                }
              })
            } else {
              resolve(true)
            }
          })
        }
      ),
    password: yup
      .string()
      .min(6, "Çok kısa, en az 6 karakter, lütfen kontrol ediniz!")
      .max(30, "Çok uzun, lütfen kontrol ediniz!"),
    term: yup
      .bool()
      .oneOf([true], "Yorum yazma kurallarını onaylamanız gereklidir!"),
  })
  useEffect(() => {
    fetch("/api/client")
      .then((res) => res.json())
      .then((data) => {
        setClientIP(data.ip)
      })
  }, [])
  return (
    <>
      <Formik
        initialValues={{
          content: "",
          email: session ? userData?.email : "",
          name: session ? userData?.name : "",
          surname: session ? userData?.surname : "",
          term: false,
        }}
        enableReinitialize
        validationSchema={session ? loggedInSchema : notloggedInSchema}
        //validateOnChange={false}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setLoading(true)
          if (session) {
            try {
              setErrors({ api: null })
              await fetchAPI(
                "/comments",
                {},
                {
                  method: "POST",
                  body: JSON.stringify({
                    data: {
                      article: article,
                      threadOf: threadOf ? threadOf : null,
                      reply_to: replyto ? replyto : null,
                      author: session.id,
                      content: values.content,
                      ip: clientIP,
                    },
                  }),
                }
              )
              alert("oldu")
            } catch (err) {
              setErrors({ api: err.message })
            }
          } else {
            try {
              setErrors({ api: null })
              fetchAPI(
                `/users?filters[email][$eq]=${values.email}&filters[confirmed][$eq]=false&fields[0]=email`,
                {},
                {
                  method: "GET",
                }
              ).then(async (user) => {
                if (user.length > 0) {
                  fetchAPI(
                    "/comments",
                    {},
                    {
                      method: "POST",
                      body: JSON.stringify({
                        data: {
                          article: article,
                          threadOf: threadOf ? threadOf : null,
                          reply_to: replyto ? replyto : null,
                          author: user[0].id,
                          content: values.content,
                          ip: clientIP,
                        },
                      }),
                    }
                  )
                } else {
                  fetchAPI(
                    `/auth/local/register`,
                    {},
                    {
                      method: "POST",
                      body: JSON.stringify({
                        username: Math.random().toString(36).slice(5),
                        email: values.email,
                        name: values.name,
                        surname: values.surname,
                        role: 3,
                        confirmed: false,
                        password: values.password
                          ? values.password
                          : Math.random().toString(36).slice(2) +
                            Math.random().toString(36).slice(2),
                      }),
                    }
                  ).then(async (data) => {
                    fetchAPI(
                      "/comments",
                      {},
                      {
                        method: "POST",
                        body: JSON.stringify({
                          data: {
                            article: article,
                            threadOf: threadOf ? threadOf : null,
                            reply_to: replyto ? replyto : null,
                            author: data.user.id,
                            content: values.content,
                            ip: clientIP,
                          },
                        }),
                      }
                    )
                  })
                }
              })
              alert("oldu")
            } catch (err) {
              setErrors({ api: err.message })
            } finally {
              console.log("error", error)
            }
          }

          setLoading(false)
          setSubmitting(false)
        }}
      >
        {({
          errors,
          touched,
          isSubmitting,
          validateField,
          setFieldValue,
          setFieldTouched,
        }) => (
          <div className={`commentId${commentId}`}>
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 mt-2">
                <ReactQuill
                  name="content"
                  modules={modules}
                  formats={formats}
                  placeholder="Yorumunuz..."
                  onChange={(value) => {
                    setFieldValue("content", value)
                    setFieldTouched("content", true)
                    setIsShowing(true)
                  }}
                  //onChange={setValue}
                  theme="snow"
                />
                {errors.content && (
                  <>
                    <style jsx global>{`
                      .commentSection
                        .commentId${commentId}
                        .ql-toolbar.ql-snow,
                      .commentSection
                        .commentId${commentId}
                        .ql-container.ql-snow {
                        border-color: rgba(
                          212,
                          17,
                          27,
                          var(--tw-border-opacity)
                        );
                      }
                    `}</style>
                    <p className="text-danger">{errors.content}</p>
                  </>
                )}
              </div>
              <Transition
                show={isShowing}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className="flex flex-col w-3/3 gap-2 mb-2">
                  <div
                    className={`flex flex-row items-center ${
                      errors.term && touched.term ? "text-danger" : ""
                    }`}
                  >
                    <Field
                      type="checkbox"
                      name="term"
                      className={`h-4 w-4 mr-2 text-midgray rounded ${
                        errors.term && touched.term
                          ? "border-gray"
                          : "border-danger"
                      }`}
                    />
                    <Dialog
                      title={"Yorum Yazma Kuralları"}
                      content={
                        "Üye/Üyeler suç teşkil edecek, yasal açıdan takip gerektirecek, yasaların ya da uluslararası anlaşmaların ihlali sonucunu doğuran ya da böyle durumları teşvik eden, yasadışı, tehditkar, rahatsız edici, hakaret ve küfür içeren, aşağılayıcı, küçük düşürücü, kaba, pornografik ya da ahlaka aykırı, toplumca genel kabul görmüş kurallara aykırı, kişilik haklarına zarar verici ya da benzeri niteliklerde hiçbir İçeriği bu web sitesinin hiçbir sayfasında ya da subdomain olarak oluşturulan diğer sayfalarında paylaşamaz. Bu tür içeriklerden doğan her türlü mali, hukuki, cezai, idari sorumluluk münhasıran, içeriği gönderen Üye/Üyeler’e aittir. FINDIK TV, Üye/Üyeler tarafından paylaşılan içerikler arasından uygun görmediklerini herhangi bir gerekçe belirtmeksizin kendi web sayfalarında yayınlamama veya yayından kaldırma hakkına sahiptir. FINDIK TV, başta yukarıda sayılan hususlar olmak üzere emredici kanun hükümlerine aykırılık gerekçesi ile her türlü adli makam tarafından başlatılan soruşturma kapsamında kendisinden Ceza Muhakemesi Kanunu’nun 332.maddesi doğrultusunda istenilen Üye/Üyeler’e ait kişisel bilgileri paylaşabileceğini beyan eder. "
                      }
                      onConfirm={() => setFieldValue("term", true)}
                      //onDiscard={() => console.log("Button discard")}
                      buttons={[
                        // {
                        //   role: "custom",
                        //   onClick: () => console.log("custom test"),
                        //   toClose: true,
                        //   classes:
                        //     "bg-zinc-500/20 px-4 py-2 rounded-lg hover:bg-zinc-500/30 transition-all duration-200",
                        //   label: "Custom",
                        // },
                        // {
                        //   role: "discard",
                        //   toClose: true,
                        //   classes:
                        //     "bg-zinc-500/20 px-4 py-2 rounded-lg hover:bg-zinc-500/30 transition-all duration-200",
                        //   label: "Discard",
                        // },
                        {
                          role: "confirm",
                          toClose: true,
                          classes:
                            "bg-secondary text-white px-4 py-2 rounded-lg hover:bg-white border border-transparent hover:border-secondary hover:text-secondary transition-all duration-200",
                          label: "Kabul ediyorum",
                        },
                      ]}
                    >
                      <button
                        type="button"
                        className="underline underline-offset-1 mr-1"
                      >
                        Yorum yazma kurallarını
                      </button>
                    </Dialog>
                    <span>okudum ve kabul ediyorum.</span>
                  </div>
                  {/* {errors.term && touched.term && (
                  <p className="text-red-500 h-12 text-sm mt-1 ml-2 text-left">
                    {errors.term}
                  </p>
                )} */}
                </div>
                {!session && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex flex-col gap-2">
                      <Field
                        className={`text-base focus:outline-none py-4 md:py-0 px-4 border ${
                          errors.name && touched.name
                            ? "border-danger"
                            : "border-midgray"
                        }`}
                        type="text"
                        name="name"
                        placeholder="Adınız *"
                      />
                      {errors.name && touched.name && (
                        <p className="text-danger">{errors.name}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Field
                        className="text-base focus:outline-none py-4 md:py-0 px-4 border border-midgray"
                        type="text"
                        name="surname"
                        placeholder="Soyadınız"
                      />
                      {errors.surname && touched.surname && (
                        <p className="text-danger">{errors.surname}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Field
                        className={`text-base focus:outline-none py-4 md:py-0 px-4 border ${
                          errors.email && touched.email
                            ? "border-danger"
                            : "border-midgray"
                        }`}
                        type="email"
                        name="email"
                        placeholder="E-Posta *"
                      />
                      {errors.email && touched.email && (
                        <p
                          className="text-danger"
                          dangerouslySetInnerHTML={{
                            __html: errors.email,
                          }}
                        />
                      )}
                    </div>
                    {!errors.email && touched.email && (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                          <Field
                            className={`text-base focus:outline-none py-4 md:py-0 px-4 border ${
                              errors.password && touched.password
                                ? "border-danger"
                                : "border-midgray"
                            }`}
                            type="password"
                            name="password"
                            placeholder="Şifre"
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Sadece şifre girerek hesabını oluşturabilirsin.
                          </p>
                        </div>
                        {errors.password && touched.email && (
                          <p className="text-danger">{errors.password}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {errors.api && (
                  <p className="text-red-500 h-12 text-sm mt-1 ml-2 text-left">
                    {errors.api}
                  </p>
                )}
                <div className="flex flex-row gap-2">
                  {children}
                  <button
                    className="w-full bg-secondary hover:bg-secondary/90 text-white rounded p-4 mb-4 text-base transition duration-150 ease-out md:ease-in"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Gönder
                  </button>
                </div>
              </Transition>
            </Form>
          </div>
        )}
      </Formik>
    </>
  )
}
