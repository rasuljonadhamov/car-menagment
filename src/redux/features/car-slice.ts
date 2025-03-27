import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "../../utils/api"


export interface TableHeader {
  id: number
  title: string
  dataIndex: string
  uiColumnProperties: string
}

export interface CarValue {
  carNumber: string
  createdAt: string
  carModal: string
  createdBy: string
  modifiedAt: string
  passangerCapacity: string
  modifiedBy: string
  state: string
  objectUUID: string
  carYear: string
  [key: string]: string
}

export interface CarResponse {
  page: {
    totalElements: number
    page: number
    size: number
    hasNext: boolean
  }
  responseList: CarValue[]
}

export interface CarSearchParams {
  state: string | null
  keyword: string | null
  page: number
  size: number
  order: string | null
  field: string
}

export interface FieldDefinition {
  defineId: number
  title: string
  dataIndex: string
  columnType: string
  createRequired: boolean
  required: boolean
  uiFieldProperties: string
  selectionDetails: any
}

export interface CarValueDetail {
  defineId: number
  title: string
  dataIndex: string
  value: string
  columnType: string
  required: boolean
  columnOrder: number
  uiFieldProperties: string
  selectionDetails: any
}

export interface CarDetail {
  objectUUID: string
  valueDetails: CarValueDetail[]
}

export interface CarState {
  tableHeaders: TableHeader[]
  cars: CarValue[]
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  loading: boolean
  createHeaders: FieldDefinition[]
  carDetail: CarDetail | null
  searchParams: CarSearchParams
}

const initialState: CarState = {
  tableHeaders: [],
  cars: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  createHeaders: [],
  carDetail: null,
  searchParams: {
    state: null,
    keyword: null,
    page: 1,
    size: 10,
    order: null,
    field: "",
  },
}

export const fetchTableHeaders = createAsyncThunk("car/fetchTableHeaders", async () => {
    const response = await api.get(`/car-define/table-headers`)
    return response.data.dataSource
  })
  
  export const fetchCars = createAsyncThunk("car/fetchCars", async (params: CarSearchParams) => {
    const response = await api.post(`/car-value/all`, params)
    return response.data.dataSource
  })
  
  export const fetchCreateHeaders = createAsyncThunk("car/fetchCreateHeaders", async () => {
    const response = await api.get(`/car-define/create-headers`)
    return response.data.dataSource
  })
  
  export const createCar = createAsyncThunk(
    "car/createCar",
    async (values: { defineId: number; name: string; value: string }[]) => {
      const response = await api.post(`/car-value`, values)
      return response.data
    },
  )
  
  export const fetchCarDetail = createAsyncThunk("car/fetchCarDetail", async (objectUUID: string) => {
    const response = await api.get(`/car-value?objectUUID=${objectUUID}`)
    return response.data.dataSource
  })
  
  export const updateCar = createAsyncThunk(
    "car/updateCar",
    async (data: { objectUUID: string; values: { defineId: number; name: string; value: string }[] }) => {
      const response = await api.put(`/car-value`, data)
      return response.status
    },
  )
  
  export const deleteCar = createAsyncThunk("car/deleteCar", async (objectUUID: string) => {
    const response = await api.put(`/car-value/state?objectUUID=${objectUUID}&type=SOFT_DELETE`)
    return objectUUID
  })

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<CarSearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload }
    },
    resetSearchParams: (state) => {
      state.searchParams = initialState.searchParams
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableHeaders.fulfilled, (state, action) => {
        state.tableHeaders = action.payload
      })
      .addCase(fetchCars.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.cars = action.payload.responseList
        state.pagination = {
          current: action.payload.page.page,
          pageSize: action.payload.page.size,
          total: action.payload.page.totalElements,
        }
        state.loading = false
      })
      .addCase(fetchCars.rejected, (state) => {
        state.loading = false
      })
      .addCase(fetchCreateHeaders.fulfilled, (state, action) => {
        state.createHeaders = action.payload
      })
      .addCase(fetchCarDetail.fulfilled, (state, action) => {
        state.carDetail = action.payload
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((car) => car.objectUUID !== action.payload)
      })
  },
})

export const { setSearchParams, resetSearchParams } = carSlice.actions
export default carSlice.reducer

