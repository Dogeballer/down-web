/**
 * 所有日志
 */
import axios from 'axios'
import { API_VER } from '../constant'
export const getLogs = () => {
    return Promise.resolve()
    return axios.get(`/logs/getDsdStat`)
}
