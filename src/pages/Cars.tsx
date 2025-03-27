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
import {
  fetchTableHeaders,
  fetchCars,
  setSearchParams,
  resetSearchParams,
  deleteCar,
  type TableHeader,
  type CarValue,
} from "../redux/features/car-slice"
import * as XLSX from "xlsx"
import { AppDispatch, RootState } from "../redux/store"

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

  const handleReset = () => {
    setKeyword(null)
    setState(null)
    dispatch(resetSearchParams())
  }

  const handleTableChange = (pagination: any) => {
    dispatch(setSearchParams({ page: pagination.current }))
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
    <div className="p-6">
      <Title level={2}>차량 (Car)</Title>

      <Card className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="검색어 (search)"
              value={keyword || ""}
              onChange={(e) => setKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>

          {expandSearch && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="상태 (state)"
                style={{ width: "100%" }}
                value={state}
                onChange={(value) => setState(value)}
                allowClear
              >
                <Option value="ACTIVE">사용 (active) </Option>
                <Option value="SOFT_DELETED">삭제 (SOFT_DELETED) </Option>
              </Select>
            </Col>
          )}

          <Col xs={24} sm={24} md={8} lg={12}>
            <Space>
              <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                조회 (find button)
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                초기화 (reset button)
              </Button>
              <Button type="text" icon={<MoreOutlined />} onClick={() => setExpandSearch(!expandSearch)}>
                {expandSearch ? "접기" : "더보기 (see more)"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <div className="mb-4 flex justify-between items-center">
        <Space>
          <span>선택된 항목 (selected items): {selectedRowKeys.length}</span>
          {selectedRowKeys.length > 0 && <Button onClick={() => setSelectedRowKeys([])}>지우기 (clear) </Button>}
        </Space>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/cars/add")}>
            추가 (add)
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExcelDownload}>
            엑셀 다운로드 (excel download)
          </Button>
        </Space>
      </div>

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
        }}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "데이터 없음 (no data)" }}
      />
    </div>
  )
}

export default Cars
