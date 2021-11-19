import axios from 'axios'
import { API_VER } from '../constant'

/**
 * 查询数据登记
 */
export const getAssetGradeList = () => {
  return axios.get(`${API_VER}/web/asset_grade/list`)
}
