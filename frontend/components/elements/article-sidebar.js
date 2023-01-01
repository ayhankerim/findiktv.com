import LatestArticles from "@/components/elements/latest-articles"

const ArticleSidebar = ({ articleId, advertisement }) => {
  const advertisementFunc = (position) => {
    switch (position) {
      case "sidebar-top-desktop":
        return advertisement.filter(
          (placeholder) => placeholder.attributes.placeholder === position
        )[0]?.attributes.code
      case "sidebar-bottom-desktop":
        return advertisement.filter(
          (placeholder) => placeholder.attributes.placeholder === position
        )[0]?.attributes.code
      default:
        return advertisement.filter(
          (placeholder) => placeholder.attributes.placeholder === position
        )[0]?.attributes.code
    }
  }
  return (
    <aside className="sticky top-2 flex-none w-[336px]">
      <div
        className="my-4"
        dangerouslySetInnerHTML={{
          __html: advertisementFunc("sidebar-top-desktop"),
        }}
      />
      <LatestArticles
        current={articleId}
        count={6}
        offset={3}
        position="sidebar"
        advertisement={
          advertisement.filter(
            (placeholder) =>
              placeholder.attributes.placeholder === "sidebar-middle-desktop"
          )[0]?.attributes.code
        }
      />
      <div
        className="my-4"
        dangerouslySetInnerHTML={{
          __html: advertisementFunc("sidebar-bottom-desktop"),
        }}
      />
    </aside>
  )
}

export default ArticleSidebar
