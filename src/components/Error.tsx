"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Result, Button } from "antd"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBun extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="오류가 발생했습니다 (Error)"
          subTitle={this.state.error?.message || "알 수 없는 오류가 발생했습니다"}
          extra={[
            <Button type="primary" key="refresh" onClick={() => window.location.reload()}>
              새로고침
            </Button>,
            <Button key="home" onClick={() => (window.location.href = "/")}>
              홈으로
            </Button>,
          ]}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBun

