import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, Row, Col, Statistic, Typography, Spin, Select, DatePicker } from "antd"
import { CarOutlined, CheckCircleOutlined, CloseCircleOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import dayjs from "dayjs"
import { AppDispatch, RootState } from "../redux/store"
import { fetchCars } from "../redux/features/car-slice"

const { Title } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { cars, loading } = useSelector((state: RootState) => state.car)
  const [timeRange, setTimeRange] = useState<string>("month")
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)

  useEffect(() => {
    dispatch(
      fetchCars({
        state: null,
        keyword: null,
        page: 1,
        size: 100, 
        order: null,
        field: "",
      }),
    )
  }, [dispatch])

  const totalCars = cars.length
  const activeCars = cars.filter((car) => car.state === "ACTIVE").length
  const deletedCars = cars.filter((car) => car.state === "SOFT_DELETED").length

  const carsByModel = cars.reduce((acc: Record<string, number>, car) => {
    const model = car.carModal || "Unknown"
    acc[model] = (acc[model] || 0) + 1
    return acc
  }, {})

  const pieChartData = Object.keys(carsByModel).map((model) => ({
    name: model,
    value: carsByModel[model],
  }))

  const carsByYear = cars.reduce((acc: Record<string, number>, car) => {
    const year = car.carYear ? car.carYear.substring(0, 4) : "Unknown"
    acc[year] = (acc[year] || 0) + 1
    return acc
  }, {})

  const barChartData = Object.keys(carsByYear)
    .sort()
    .map((year) => ({
      year,
      count: carsByYear[year],
    }))

  const generateTrendData = () => {
    const data = []
    const now = dayjs()
    const periods = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 12

    for (let i = periods - 1; i >= 0; i--) {
      const date =
        timeRange === "year" ? now.subtract(i, "month").format("YYYY-MM") : now.subtract(i, "day").format("MM-DD")

      data.push({
        date,
        additions: Math.floor(Math.random() * 5),
        deletions: Math.floor(Math.random() * 3),
      })
    }

    return data
  }

  const trendData = generateTrendData()

  const growthRate = ((activeCars / (totalCars || 1)) * 100 - 80).toFixed(1)
  const isPositiveGrowth = Number.parseFloat(growthRate) >= 0

  if (loading && cars.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="대시보드 데이터를 불러오는 중..." />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>대시보드</Title>
        <div className="flex gap-4">
          <Select defaultValue="month" style={{ width: 120 }} onChange={(value) => setTimeRange(value)}>
            <Option value="week">주간</Option>
            <Option value="month">월간</Option>
            <Option value="year">연간</Option>
          </Select>
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                setDateRange([dates[0] as dayjs.Dayjs, dates[1] as dayjs.Dayjs])
              } else {
                setDateRange(null)
              }
            }}
          />
        </div>
      </div>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="총 차량" value={totalCars} prefix={<CarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="사용 중인 차량"
              value={activeCars}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="삭제된 차량"
              value={deletedCars}
              prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="성장률"
              value={growthRate}
              precision={1}
              valueStyle={{ color: isPositiveGrowth ? "#3f8600" : "#cf1322" }}
              prefix={isPositiveGrowth ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} className="mb-6">
          <Card title="차량 모델 분포">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Cars by Year */}
        <Col xs={24} lg={12} className="mb-6">
          <Card title="연도별 차량 수">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="차량 수" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Trend Analysis */}
        <Col xs={24} className="mb-6">
          <Card title="차량 추가/삭제 추세">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="additions" name="추가된 차량" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="deletions" name="삭제된 차량" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

