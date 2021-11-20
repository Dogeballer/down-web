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
export const dataClassSet = (params) => {
  return axios.get(`${API_VER}/web/table_asset_tag/tag`, {
    params
  })
}

export const dataClassTree = (keyword) => {
  return axios.get(`${API_VER}/web/table_asset_tag/tree`, {
    params: { keyword }
  })
}

export const tableFieldList = (params) => {
  return axios.get(`${API_VER}/web/field_asset_tag/list`, {
    params
  })
}

export const tableFieldSet = (params) => {
  return axios.get(`${API_VER}/web/field_asset_tag/tag`, {
    params
  })
}
