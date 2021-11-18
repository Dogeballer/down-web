import axios from 'axios'
import { API_VER } from '../constant'

/**
 * 查询数据资产账号分页
 */
export const getDataAssetAcctPage = (params) => {
  return axios.get(`${API_VER}/web/dbassetUser/getDataAssetUserInfo`, {
    params
  })
}

/**
 * 新增数据资产账号
 */
export const addDataAssetAcct = (data) => {
  return axios.post(`${API_VER}/web/dbassetUser/addDataAssetUserInfo`, data)
}

/**
 * 修改数据资产账号
 * @param {number} id 资产id
 * @param {data} 数据资产对象
 */
export const updateDataAssetAcct = (id, data) => {
  return axios.put(`${API_VER}/web/dbassetUser/addDataAssetUserInfo/${id}`, data)
}

/**
 * 修改数据资产账号是否展示
 * @param {number} id 资产id
 * @param {number} showStatus 是否展示
 */
export const updateAcctShowStatus = (id, showStatus) => {
  return axios.put(`${API_VER}/web/dbassetUser/addDataAssetUserInfo/${id}/${showStatus}`)
}

/**
 * 删除数据资产
 * @param {number} id 资产id
 */
export const deleteDataAssetAcct = (id) => {
  return axios.delete(`${API_VER}/web/dbassetUser/${id}`)
}
