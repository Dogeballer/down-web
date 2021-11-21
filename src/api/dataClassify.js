import axios from 'axios'
import { API_VER } from '../constant'

export const dataClassList = (params) => {
  return axios.get(`${API_VER}/web/table_asset_tag/page`, {
    params
  })
}
/**
 * 表设置分级分类标注
 */
export const dataClassSet = (tables, data) => {
  return axios.put(`${API_VER}/web/table_asset_tag/tag`, {
    ...data,
    tables
  })
}

export const dataClassTree = (params) => {
  return axios.get(`${API_VER}/web/table_asset_tag/tree`, {
    params
  })
}

export const tableFieldList = (params) => {
  return axios.get(`${API_VER}/web/field_asset_tag/list`, {
    params
  })
}

export const tableFieldSet = (colNames, data) => {
  return axios.put(`${API_VER}/web/field_asset_tag/tag`, {
    colNames, ...data
  })
}
