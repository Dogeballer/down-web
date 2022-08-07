import axios from 'axios'

export const login = (data) => {
  return axios.post(`api/token`, data)
}
export const refreshToken = (data) => {
  return axios.post(`api/token/refresh`, data)
}
