import type React from "react"
import { Switch, Tooltip } from "antd"
import { BulbOutlined, BulbFilled } from "@ant-design/icons"
import { useTheme } from "../contexts/ThemeContext"

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Tooltip title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}>
      <Switch
        checked={theme === "dark"}
        onChange={toggleTheme}
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
      />
    </Tooltip>
  )
}

export default ThemeToggle

