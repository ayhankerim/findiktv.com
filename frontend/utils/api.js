import qs from "qs"

export function getStrapiURL(path) {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
  }${path}`
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {RequestInit} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET_TOKEN}`,
    },
    ...options,
  }

  // Build request URL
  const queryString = qs.stringify(urlParamsObject)
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions)

  // Handle response
  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`An error occured please try again`)
  }
  const data = await response.json()
  return data
}

/**
 *
 * @param {Object} options
 * @param {string} options.slug The page's slug
 * @param {string} options.locale The current locale specified in router.locale
 * @param {boolean} options.preview router isPreview value
 */
export async function getPageData({ slug, locale, preview }) {
  // Find the pages that match this slug
  const gqlEndpoint = getStrapiURL("/graphql")
  const pagesRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        fragment FileParts on UploadFileEntityResponse {
          data {
            id
            attributes {
              alternativeText
              width
              height
              mime
              url
              formats
            }
          }
        }
        query GetPages(
          $slug: String!
          $publicationState: PublicationState!
          $locale: I18NLocaleCode!
        ) {        
          pages(
            filters: { slug: { eq: $slug } }
            publicationState: $publicationState
            locale: $locale
          ) {
            data {
              id
              attributes {
                locale
                localizations {
                  data {
                    id
                    attributes {
                      locale
                    }
                  }
                }
                slug
                metadata {
                  metaTitle
                  metaDescription
                  shareImage {
                    ...FileParts
                  }
                  twitterCardType
                  twitterUsername
                }
                contentSections {
                  __typename
                  ... on ComponentSectionsBottomActions {
                    id
                    title
                    buttons {
                      id
                      newTab
                      text
                      type
                      url
                    }
                  }
                  ... on ComponentSectionsHero {
                    id
                    buttons {
                      id
                      newTab
                      text
                      type
                      url
                    }
                    title
                    description
                    label
                    picture {
                      ...FileParts
                    }
                  }
                  ... on ComponentSectionsFeatureColumnsGroup {
                    id
                    features {
                      id
                      description
                      icon {
                        ...FileParts
                      }
                      title
                    }
                  }
                  ... on ComponentSectionsFeatureRowsGroup {
                    id
                    features {
                      id
                      description
                      link {
                        id
                        newTab
                        text
                        url
                      }
                      media {
                        ...FileParts
                      }
                      title
                    }
                  }
                  ... on ComponentSectionsTestimonialsGroup {
                    id
                    description
                    link {
                      id
                      newTab
                      text
                      url
                    }
                    logos {
                      id
                      title
                      logo {
                        ...FileParts
                      }
                    }
                    testimonials {
                      id
                      logo {
                        ...FileParts
                      }
                      picture {
                        ...FileParts
                      }
                      text
                      authorName
                      authorTitle
                      link
                    }
                    title
                  }
                  ... on ComponentSectionsLargeVideo {
                    id
                    description
                    title
                    poster {
                      ...FileParts
                    }
                    video {
                      ...FileParts
                    }
                  }
                  ... on ComponentSectionsRichText {
                    id
                    content
                  }
                  ... on ComponentSectionsPricing {
                    id
                    title
                    plans {
                      description
                      features {
                        id
                        name
                      }
                      id
                      isRecommended
                      name
                      price
                      pricePeriod
                    }
                  }
                  ... on ComponentSectionsLeadForm {
                    id
                    emailPlaceholder
                    location
                    submitButton {
                      id
                      text
                      type
                    }
                    title
                  }
                }
              }
            }
          }
        }      
      `,
      variables: {
        slug,
        publicationState: preview ? "PREVIEW" : "LIVE",
        locale,
      },
    }),
  })

  const pagesData = await pagesRes.json()
  // Make sure we found something, otherwise return null
  if (pagesData.data?.pages == null || pagesData.data.pages.length === 0) {
    return null
  }

  // Return the first item since there should only be one result per slug
  return pagesData.data.pages.data[0]
}

export async function getArticleData({ slug, locale, id, preview }) {
  // Find the pages that match this slug
  const gqlEndpoint = getStrapiURL("/graphql")
  const articlesRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        fragment FileParts on UploadFileEntityResponse {
          data {
            id
            attributes {
              alternativeText
              width
              height
              mime
              url
              formats
            }
          }
        }

        query GetArticles (
          $slug: String!
          $id: ID!
          $publicationState: PublicationState!
          $locale: I18NLocaleCode!
        ) {        
          articles(
            filters: { slug: { eq: $slug }, id: { eq: $id } }
            publicationState: $publicationState
            locale: $locale
          ) {
            data {
              id
              attributes {
                title
                slug
                summary
                content
                publishedAt
                updatedAt
                metadata {
                  metaTitle
                  metaDescription
                  shareImage {
                    ...FileParts
                  }
                  twitterUsername
                }
                image {
                  ...FileParts
                }
                homepage_image {
                  ...FileParts
                }
                category {
                  data {
                    id
                    attributes {
                      title
                      slug
                    }
                  }
                }
                cities {
                  data {
                    id
                    attributes {
                      title
                      slug
                    }
                  }
                }
                tags {
                  data {
                    id
                    attributes {
                      title
                      slug
                    }
                  }
                }
                reaction {
                  data {
                    id
                    attributes {
                      angry
                      sad
                      dislike
                      shocked
                      love
                      applause
                      lol
                    }
                  }
                }
                featured
                locale
                localizations {
                  data {
                    id
                    attributes {
                      locale
                    }
                  }
                }
              }
            }
          }
        } 
      `,
      variables: {
        slug,
        id,
        publicationState: preview ? "PREVIEW" : "LIVE",
        locale,
      },
    }),
  })

  const articlesData = await articlesRes.json()
  // Make sure we found something, otherwise return null
  if (
    articlesData.data?.articles == null ||
    articlesData.data.articles.length === 0
  ) {
    return null
  }

  // Return the first item since there should only be one result per slug
  return articlesData.data.articles.data[0]
}

export async function getAdsData(active) {
  const gqlEndpoint = getStrapiURL("/graphql")
  const adsRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        query getAds (
          $active: Boolean!
          ) {
          advertisements(
            filters: { active: { eq: $active } }
            ) {
            data {
              id
              attributes {
                title
                active
                placeholder
                code
              }
            }
          }
        }   
      `,
      variables: {
        active: true,
      },
    }),
  })

  const advertisement = await adsRes.json()
  return advertisement.data.advertisements.data
}

export async function getCommentsData(article) {
  const gqlEndpoint = getStrapiURL("/graphql")
  const comRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        fragment FileParts on UploadFileEntityResponse {
          data {
            id
            attributes {
              alternativeText
              width
              height
              mime
              url
              formats
            }
          }
        }
        query CommentLimited($article: ID!) {
          comments(
            filters: { article: { id: { eq: $article } }, and: [{ approvalStatus: { eq: "approved" }}, { removed: { eq: false }}]  }
            sort: "id:desc"
            pagination: { start: 0, limit: 100 }
          ) {
            data {
              id
              attributes {
                content
                createdAt
                updatedAt
                approvalStatus
                like
                dislike
                blocked
                blockedThread
                removed
                article {
                  data {
                    id
                  }
                }
                threadOf {
                  data {
                    id
                  }
                }
                reply_to {
                  data {
                    id
                    attributes {
                      author {
                        data {
                          id
                          attributes {
                            name
                            surname
                          }
                        }
                      }
                    }
                  }
                }
                author {
                  data {
                    id
                    attributes {
                      username
                      email
                      name
                      surname
                      about
                      avatar {
                        ...FileParts
                      }
                      city {
                        data {
                          id
                          attributes {
                            title
                            slug
                          }
                        }
                      }
                      confirmed
                      blocked
                      role {
                        data {
                          id
                          attributes {
                            name
                          }
                        }
                      }
                    }
                  }
                }
                ip
              }
            }
            meta {
              pagination {
                total
                page
                pageSize
                pageCount
              }
            }
          }
        }
      `,
      variables: {
        article,
      },
    }),
  })

  const comment = await comRes.json()
  return comment.data.comments
}

export async function createReaction(active) {
  const gqlEndpoint = getStrapiURL("/graphql")
  const adsRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        mutation createReaction (
          $article: Id!
          $angry: Int!
          $lol: Int!
          $sad: Int!
          $applause: Int!
          $dislike: Int!
          $love: Int!
          $shocked: Int!
          ) {
          createReaction(
            data: {
              angry: $angry
              lol: $lol
              sad: $sad
              article: $article
              applause: $applause
              dislike: $dislike
              love: $love
              shocked: $shocked
            }
          ) {
            data {
              attributes {
                angry
                dislike
                applause
                love
                sad
                shocked
                lol
                article {
                  data {
                    id
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        angry,
        dislike,
        applause,
        love,
        sad,
        shocked,
        lol,
      },
    }),
  })

  const advertisement = await adsRes.json()
  return advertisement.data.advertisements.data
}

// Get site data from Strapi (metadata, navbar, footer...)
export async function getGlobalData(locale) {
  const gqlEndpoint = getStrapiURL("/graphql")
  const globalRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        fragment FileParts on UploadFileEntityResponse {
          data {
            id
            attributes {
              alternativeText
              width
              height
              mime
              url
              formats
            }
          }
        }
        query GetGlobal($locale: I18NLocaleCode!) {
          global(locale: $locale) {
            data {
              id
              attributes {
                favicon {
                  ...FileParts
                }
                metadata {
                  metaTitle
                  metaDescription
                  shareImage {
                    ...FileParts
                  }
                  twitterCardType
                  twitterUsername
                }
                metaTitleSuffix
                notificationBanner {
                  type
                  text
                }
                navbar {
                  logo {
                    ...FileParts
                  }
                  links {
                    id
                    url
                    newTab
                    text
                  }
                  button {
                    id
                    url
                    newTab
                    text
                    type
                  }
                }
                footer {
                  logo {
                    ...FileParts
                  }
                  smallText
                  columns {
                    id
                    title
                    links {
                      id
                      url
                      newTab
                      text
                    }
                  }
                }
              }
            }
          }
        }      
      `,
      variables: {
        locale,
      },
    }),
  })

  const global = await globalRes.json()
  return global.data.global
}
