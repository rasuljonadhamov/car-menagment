import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Card,
  Collapse,
  Row,
  Col,
  Typography,
  message,
  Space,
} from "antd"
import { fetchCreateHeaders, createCar, type FieldDefinition } from "../redux/features/car-slice"
import dayjs from "dayjs"
import { AppDispatch, RootState } from "../redux/store"

const { Title } = Typography
const { TextArea } = Input
const { Panel } = Collapse

interface FormValues {
  [key: string]: string | number | boolean | dayjs.Dayjs | null
}

const AddCar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { createHeaders } = useSelector((state: RootState) => state.car)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchCreateHeaders())
  }, [dispatch])

  const groupedFields = createHeaders.reduce((acc: Record<string, FieldDefinition[]>, field) => {
    const properties = JSON.parse(field.uiFieldProperties || "{}")
    const collapseId = properties.collapseId || "01"

    if (!acc[collapseId]) {
      acc[collapseId] = []
    }

    acc[collapseId].push(field)
    return acc
  }, {})

  Object.keys(groupedFields).forEach((collapseId) => {
    groupedFields[collapseId].sort((a, b) => {
      const propsA = JSON.parse(a.uiFieldProperties || "{}")
      const propsB = JSON.parse(b.uiFieldProperties || "{}")
      return (propsA.inputOrder || 0) - (propsB.inputOrder || 0)
    })
  })

  const handleSubmit = async (values: FormValues) => {
    setLoading(true)

    try {
      const formattedValues = Object.entries(values)
        .map(([key, value]) => {
          const field = createHeaders.find((header) => header.dataIndex === key)

          if (!field) return null

          let formattedValue = value

          if (field.columnType === "DATE" && value) {
            formattedValue = dayjs(value as dayjs.Dayjs).format("YYYY-MM-DD")
          }

          return {
            defineId: field.defineId,
            name: key,
            value: formattedValue?.toString() || "",
          }
        })
        .filter(Boolean)

      await dispatch(createCar(formattedValues as any))
      message.success("차량이 성공적으로 추가되었습니다.")
      navigate("/cars")
    } catch (error) {
      message.error("차량 추가 중 오류가 발생했습니다.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FieldDefinition) => {
    const properties = JSON.parse(field.uiFieldProperties || "{}")
    const width = "100%" 
    const disabled = properties.disabled || false

    let fieldComponent

    switch (field.columnType) {
      case "STRING":
        fieldComponent = (
          <Input
            disabled={disabled}
            style={{ width }}
            maxLength={properties.maxLength}
            allowClear={properties.allowClear}
          />
        )
        break

      case "TEXT":
        fieldComponent = (
          <TextArea
            disabled={disabled}
            style={{ width }}
            rows={properties.rows || 4}
            maxLength={properties.maxLength}
            showCount={properties.showCount}
            allowClear={properties.allowClear}
          />
        )
        break

      case "DOUBLE":
        fieldComponent = (
          <InputNumber
            disabled={disabled}
            style={{ width }}
            min={properties.min}
            max={properties.max}
            precision={properties.precision}
          />
        )
        break

      case "BOOLEAN":
        fieldComponent = (
          <Select
            disabled={disabled}
            style={{ width }}
            options={[
              { value: true, label: "예" },
              { value: false, label: "아니오" },
            ]}
          />
        )
        break

      case "SELECTION":
        fieldComponent = (
          <Select
            disabled={disabled}
            style={{ width }}
            options={field.selectionDetails?.options?.map((option: any) => ({
              value: option.value,
              label: option.label,
            }))}
          />
        )
        break

      case "DATE":
        fieldComponent = <DatePicker disabled={disabled} style={{ width }} />
        break

      case "TIME":
        fieldComponent = <Input disabled={disabled} style={{ width }} />
        break

      default:
        fieldComponent = <Input disabled={disabled} style={{ width }} />
    }

    return (
      <Form.Item
        key={field.defineId}
        name={field.dataIndex}
        label={field.title}
        rules={[
          {
            required: field.createRequired,
            message: `${field.title}을(를) 입력해주세요.`,
          },
        ]}
        initialValue={properties.initialValue}
      >
        {fieldComponent}
      </Form.Item>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <Title level={2} className="text-center sm:text-left">
        차량 추가
      </Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {Object.entries(groupedFields).map(([collapseId, fields]) => {
          const firstField = fields[0]
          const properties = JSON.parse(firstField.uiFieldProperties || "{}")
          const collapseTitle = properties.collapseTitle || "일반 정보"

          return (
            <Card key={collapseId} className="mb-4">
              <Collapse defaultActiveKey={[collapseId]}>
                <Panel header={collapseTitle} key={collapseId}>
                  <Row gutter={[16, 0]}>
                    {fields.map((field) => (
                      <Col key={field.defineId} xs={24} sm={12} md={8} lg={8}>
                        {renderField(field)}
                      </Col>
                    ))}
                  </Row>
                </Panel>
              </Collapse>
            </Card>
          )
        })}

        <Space wrap className="flex justify-center sm:justify-start">
          <Button type="primary" htmlType="submit" loading={loading}>
            저장
          </Button>
          <Button onClick={() => navigate("/cars")}>취소</Button>
        </Space>
      </Form>
    </div>
  )
}

export default AddCar

