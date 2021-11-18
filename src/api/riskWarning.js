/**
 * 风险预警
 */
import axios from 'axios'
import { API_VER } from '../constant'
export const getRiskWarning = () => {
  return Promise.resolve()
  return axios.get('/logs/getDsdStat')
}
