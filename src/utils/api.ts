import axios from "axios"

const BASE_URL = "http://13.124.160.16:8085/kefa/lab/v1"

const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJvcmdhbml6YXRpb25JZCI6MSwicm9sZUlkIjoiMyIsImZpbyI6IlRlc3RVc2VyMSIsInVzZXJuYW1lIjoidGVzdFVzZXJAa2VpdCIsImV4cCI6MTc0ODk5OTkxNCwiaWF0IjoxNzQyOTc5OTE0fQ.v1TlGvFN0OUaLWkDRrKHb-PpM9C4RQsFEgrzVX4_ItQ"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: AUTH_TOKEN,
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Authentication error: Token may be invalid or expired")
    }
    return Promise.reject(error)
  },
)

export default api

