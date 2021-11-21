/**
 * 所有日志
 */
import axios from 'axios'
import { API_VER } from '../constant'
export const getLogs = params => {
  return axios.get('/logs/getLogDetailByPage', {params})
}
