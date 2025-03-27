import type React from "react"
import { Spin } from "antd"

interface LoadingProps {
  tip?: string
  fullScreen?: boolean
}

const Loading: React.FC<LoadingProps> = ({ tip = "로딩 중...", fullScreen = false }) => {
  const style = fullScreen
    ? {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed" as const,
        top: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 9999,
      }
    : {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }

  return (
    <div style={style}>
      <Spin size="large" tip={tip} />
    </div>
  )
}

export default Loading

