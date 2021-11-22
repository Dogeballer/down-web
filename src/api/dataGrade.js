import axios from 'axios'
import { API_VER } from '../constant'

export const dataGradeCreate = (data) => {
  return axios.post(`${API_VER}/web/asset_class`, data)
}

export const dataGradeDelete = (assetClassNames) => {
  return axios.delete(`${API_VER}/web/asset_class`, {
    data: Array.isArray(assetClassNames) ? assetClassNames : [assetClassNames]
  })
}

export const dataGradeTree = () => {
  return axios.get(`${API_VER}/web/asset_class/tree/base`)
}

export const dataGradeUpdate = (assetClassName, data) => {
  return axios.put(`${API_VER}/web/asset_class/${encodeURIComponent(assetClassName)}`, data)
}
