import React from "react"

const Advertisement = ({ advertisement }) => {
  return <div dangerouslySetInnerHTML={{ __html: advertisement }} />
}

export default Advertisement
