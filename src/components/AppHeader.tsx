import type React from "react"
import { Layout, Button, Space, Dropdown, Avatar, Menu, Typography } from "antd"
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
} from "@ant-design/icons"
import ThemeToggle from "./ThemeToggle"
import { useTheme } from "../contexts/ThemeContext"

const { Header } = Layout
const { Text } = Typography

interface AppHeaderProps {
  collapsed: boolean
  toggle: () => void
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, toggle }) => {
  const { theme } = useTheme()

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          icon: <UserOutlined />,
          label: "내 프로필",
        },
        {
          key: "2",
          icon: <SettingOutlined />,
          label: "설정",
        },
        {
          type: "divider",
        },
        {
          key: "3",
          icon: <LogoutOutlined />,
          label: "로그아웃",
        },
      ]}
    />
  )

  return (
    <Header
      className={`app-header ${theme === "dark" ? "dark" : ""}`}
      style={{
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: theme === "dark" ? "#1f1f1f" : "#fff",
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggle}
        style={{ fontSize: "16px", width: 64, height: 64 }}
      />

      <Space>
        <ThemeToggle />

        <Button type="text" icon={<BellOutlined />} style={{ fontSize: "16px" }} />

        <Dropdown overlay={userMenu} trigger={["click"]}>
          <Space className="user-dropdown" style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <Text className="username-text">관리자</Text>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  )
}

export default AppHeader

