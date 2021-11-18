import axios from 'axios'
import { API_VER } from '../constant'

/**
 * 查询应用资产详情分页
 */
export const getAppAssetDetailPage = (params) => {
  return axios.get(`${API_VER}/web/appasset/getAppAssetInfo`, {
    params
  })
}

/**
 * 查询应用资产详情列表
 */
export const getAppAssetDetailList = () => {
  return axios.get(`${API_VER}/web/appasset/getAppAssetName`)
}

/**
 * 新增应用资产详情
 */
export const addAppAssetDetail = (data) => {
  return axios.post(`${API_VER}/web/appasset/addAppAssetInfo`, data)
}

/**
 * 修改应用资产详情
 * @param {number} id 资产id
 * @param {data} 应用资产对象
 */
export const updateAppAssetDetail = (id, data) => {
  return axios.put(`${API_VER}/web/appasset/upAppAssetInfo/${id}`, data)
}

/**
 * 修改应用资产详情是否展示
 * @param {number} id 资产id
 * @param {number} showStatus 是否展示
 */
export const updateDetailShowStatus = (id, showStatus) => {
  return axios.put(`${API_VER}/web/appasset/upAppAssetInfo/${id}/${showStatus}`)
}

/**
 * 删除应用资产详情
 * @param {number} id 资产id
 */
export const deleteAppAssetDetail = (id) => {
  return axios.delete(`${API_VER}/web/appasset/${id}`)
}
