import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button, Table, Input, Space, Card, Select, Row, Col, Typography, Popconfirm, message } from "antd"
import type { ColumnsType } from "antd/es/table"
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  MoreOutlined,
} from "@ant-design/icons"
import * as XLSX from "xlsx"
import { AppDispatch, RootState } from "../redux/store"
import { CarValue, deleteCar, fetchCars, fetchTableHeaders, resetSearchParams, setSearchParams, TableHeader } from "../redux/features/car-slice"
import Loading from "../components/Loading"

const { Title } = Typography
const { Option } = Select

const Cars: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { tableHeaders, cars, pagination, loading, searchParams } = useSelector((state: RootState) => state.car)
  const [keyword, setKeyword] = useState<string | null>(null)
  const [state, setState] = useState<string | null>(null)
  const [expandSearch, setExpandSearch] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  useEffect(() => {
    dispatch(fetchTableHeaders())
    dispatch(fetchCars(searchParams))
  }, [dispatch, searchParams])

  const handleSearch = () => {
    dispatch(setSearchParams({ keyword, state, page: 1 }))
  }

  useEffect(() => {
    if (state !== undefined) {
      dispatch(setSearchParams({ keyword, state, page: 1 }))
    }
  }, [state, dispatch, keyword])

  const handleReset = () => {
    setKeyword(null)
    setState(null)
    dispatch(resetSearchParams())
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    dispatch(
      setSearchParams({
        page: pagination.current,
        size: pagination.pageSize,
      }),
    )

    if (sorter && sorter.field && sorter.order) {
      const order = sorter.order === "ascend" ? "ASC" : "DESC"
      dispatch(
        setSearchParams({
          order: order,
          field: sorter.field,
        }),
      )
    }
  }

  const handleDelete = (objectUUID: string) => {
    dispatch(deleteCar(objectUUID)).then(() => {
      message.success("차량이 삭제되었습니다.")
    })
  }

  const handleExcelDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(cars)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cars")
    XLSX.writeFile(workbook, "cars.xlsx")
  }

  const columns: ColumnsType<CarValue> = tableHeaders.map((header: TableHeader) => {
    const properties = JSON.parse(header.uiColumnProperties || "{}")
    return {
      title: header.title,
      dataIndex: header.dataIndex,
      key: header.dataIndex,
      width: properties.width || 100,
      sorter: true,
    }
  })

  columns.push({
    title: "실행",
    key: "action",
    width: 120,
    render: (_: any, record: CarValue) => (
      <Space size="small">
        <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/cars/edit/${record.objectUUID}`)} />
        <Popconfirm
          title="이 차량을 삭제하시겠습니까?"
          onConfirm={() => handleDelete(record.objectUUID)}
          okText="예"
          cancelText="아니오"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  })

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  return (
    <div className="p-4 sm:p-6">
      <Title level={2} className="text-center sm:text-left">
        차량
      </Title>

      <Card className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="검색어"
              value={keyword || ""}
              onChange={(e) => setKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>

          {expandSearch && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="상태"
                style={{ width: "100%" }}
                value={state}
                onChange={(value) => setState(value)}
                allowClear
              >
                <Option value="ACTIVE">사용</Option>
                <Option value="SOFT_DELETED">삭제</Option>
              </Select>
            </Col>
          )}

          <Col xs={24} sm={24} md={8} lg={12}>
            <Space wrap className="flex justify-center sm:justify-start">
              <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                조회
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                초기화
              </Button>
              <Button type="text" icon={<MoreOutlined />} onClick={() => setExpandSearch(!expandSearch)}>
                {expandSearch ? "접기" : "더보기"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Space className="mb-2 sm:mb-0">
          <span>선택된 항목: {selectedRowKeys.length}</span>
          {selectedRowKeys.length > 0 && <Button onClick={() => setSelectedRowKeys([])}>지우기</Button>}
        </Space>
        <Space wrap className="flex justify-center sm:justify-end">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/cars/add")}>
            추가
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExcelDownload}>
            엑셀 다운로드
          </Button>
        </Space>
      </div>

      {loading ? (
        <Loading tip="차량 데이터를 불러오는 중..." />
      ) : (
        <div className="overflow-x-auto">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={cars}
            rowKey="objectUUID"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `총 ${total}개 항목`,
              pageSizeOptions: ["10", "20", "50", "100"],
              onChange: (page, pageSize) => {
                dispatch(setSearchParams({ page, size: pageSize }))
              },
            }}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
            locale={{ emptyText: "데이터 없음" }}
          />
        </div>
      )}
    </div>
  )
}

export default Cars

