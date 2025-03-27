import type React from "react"
import { useState } from "react"
import { Layout, Menu } from "antd"
import {
  DashboardOutlined,
  CarOutlined
} from "@ant-design/icons"
import { useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"

const { Sider } = Layout

interface AppSidebarProps {
  collapsed: boolean
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()

  const [openKeys, setOpenKeys] = useState<string[]>(["cars"])

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "대시보드",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "cars",
      icon: <CarOutlined />,
      label: "차량 관리",
      children: [
        {
          key: "cars-list",
          label: "차량 목록",
          onClick: () => navigate("/cars"),
        },
        {
          key: "cars-add",
          label: "차량 추가",
          onClick: () => navigate("/cars/add"),
        },
      ],
    },
  
  ]

  const selectedKeys = (() => {
    const path = location.pathname
    if (path === "/dashboard") return ["dashboard"]
    if (path === "/cars") return ["cars-list"]
    if (path === "/cars/add") return ["cars-add"]
    if (path.startsWith("/cars/edit")) return ["cars-list"]
    
    return []
  })()

  return (
    <Sider
      width={220}
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: theme === "dark" ? "#141414" : "#fff",
      }}
    >
      <div
        className="logo"
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme === "dark" ? "#fff" : "#000",
          fontSize: collapsed ? "20px" : "18px",
          fontWeight: "bold",
          margin: "0 16px",
          overflow: "hidden",
        }}
      >
        {collapsed ? "CM" : "차량 관리 시스템"}
      </div>

      <Menu
        theme={theme === "dark" ? "dark" : "light"}
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  )
}

export default AppSidebar

