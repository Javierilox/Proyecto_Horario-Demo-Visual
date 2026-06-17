import axios from "axios"

const clienteApi = axios.create({
  baseURL: "http://localhost:3001/api",
})

clienteApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default clienteApi