import axios from 'axios'
import { API_VER } from '../constant'

/**
 * 查询数据资产详情分页
 */
export const getDataAssetDetailPage = (params) => {
  return axios.get(`${API_VER}/web/dbasset/getDataAssetInfo`, {
    params
  })
}

/**
 * 查询数据资产详情列表
 */
export const getDataAssetDetailList = () => {
  return axios.get(`${API_VER}/web/dbasset/getDataAssetName`)
}

/**
 * 新增数据资产详情
 */
export const addDataAssetDetail = (data) => {
  return axios.post(`${API_VER}/web/dbasset/addDataAssetInfo`, data)
}

/**
 * 修改数据资产详情
 * @param {number} id 资产id
 * @param {data} 数据资产对象
 */
export const updateDataAssetDetail = (id, data) => {
  return axios.put(`${API_VER}/web/dbasset/upDataAssetInfo/${id}`, data)
}

/**
 * 修改数据资产详情是否展示
 * @param {number} id 资产id
 * @param {number} showStatus 是否展示
 */
export const updateDetailShowStatus = (id, showStatus) => {
  return axios.put(`${API_VER}/web/dbasset/upDataAssetInfo/${id}/${showStatus}`)
}

/**
 * 删除数据资产详情
 * @param {number} id 资产id
 */
export const deleteDataAssetDetail = (id) => {
  return axios.delete(`${API_VER}/web/dbasset/${id}`)
}
