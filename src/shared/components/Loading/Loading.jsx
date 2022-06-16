import React from "react"
import style from "./Loading.module.scss"

const Loading = () => {
  return <div className={style.loading}><div className={style.loadingBall}></div></div>
}

export default Loading
