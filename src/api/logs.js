/**
 * 所有日志
 */
import axios from 'axios'
import qs from 'query-string'
import { API_VER } from '../constant'
export const getLogs = params => {
  return axios.get('/logs/getLogDetailByPage', {params})
}
/**
 * 日志导出
 */
export const getExportLogByDateUrl = params => {
  return axios.defaults.baseURL + '/logs/exportLogByDate?' + qs.stringify(params)
}

