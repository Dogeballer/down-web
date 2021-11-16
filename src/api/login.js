import axios from 'axios'
import { API_VER } from '../constant'

export const getCaptchaCode = () => {
  return axios.get(`${API_VER}/login/web/captcha`)
}

export const login = (data) => {
  return axios.post(`${API_VER}/login`, data)
}