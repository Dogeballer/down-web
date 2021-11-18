import axios from 'axios'
import { API_VER } from '../constant'

/**
 * 查询应用资产账号分页
 */
export const getAppAssetAcctPage = (params) => {
  return axios.get(`${API_VER}/web/dbassetUser/getDataAssetUserInfo`, {
    params
  })
}

/**
 * 新增应用资产账号
 */
export const addAppAssetAcct = (data) => {
  return axios.post(`${API_VER}/web/dbassetUser/addDataAssetUserInfo`, data)
}

/**
 * 修改应用资产账号
 * @param {number} id 资产id
 * @param {data} 应用资产对象
 */
export const updateAppAssetAcct = (id, data) => {
  return axios.put(`${API_VER}/web/dbassetUser/addDataAssetUserInfo/${id}`, data)
}

/**
 * 修改应用资产账号是否展示
 * @param {number} id 资产id
 * @param {number} showStatus 是否展示
 */
export const updateAcctShowStatus = (id, showStatus) => {
  return axios.put(`${API_VER}/web/dbassetUser/addDataAssetUserInfo/${id}/${showStatus}`)
}
