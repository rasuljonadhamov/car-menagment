import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ConfigProvider, theme as antdTheme } from "antd"

type ThemeType = "light" | "dark"

interface ThemeContextType {
  theme: ThemeType
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("theme")
    return (savedTheme as ThemeType) || "light"
  })

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light"
      localStorage.setItem("theme", newTheme)
      return newTheme
    })
  }

  useEffect(() => {
    document.body.dataset.theme = theme
    if (theme === "dark") {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [theme])

  const themeConfig = {
    algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#1890ff",
    },
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  )
}

