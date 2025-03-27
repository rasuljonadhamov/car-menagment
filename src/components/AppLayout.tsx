import type React from "react"
import { useState, useEffect } from "react"
import { Layout } from "antd"
import { Outlet, useLocation } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import AppSidebar from "./AppSidebar"
import AppHeader from "./AppHeader"
import useWindowSize from "../hooks/useWindowSize"

const { Content } = Layout

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { theme } = useTheme()
  const location = useLocation()
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < 768) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
  }, [width])

  useEffect(() => {
    if (width < 768) {
      setCollapsed(true)
    }
  }, [location.pathname, width])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar collapsed={collapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 220,
          transition: "all 0.2s",
          background: theme === "dark" ? "#141414" : "#f0f2f5",
        }}
      >
        <AppHeader collapsed={collapsed} toggle={toggleCollapsed} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: theme === "dark" ? "#1f1f1f" : "#fff",
            borderRadius: "4px",
            minHeight: 280,
            overflow: "initial",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout

