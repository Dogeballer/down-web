import axios from 'axios'
import { API_VER } from '../constant'

/**
 * 查询文件资产详情分页
 */
export const getFileAssetDetailPage = (params) => {
  return axios.get(`${API_VER}/web/dbasset/getFileAssetInfo`, {
    params
  })
}
