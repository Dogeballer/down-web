import axios from 'axios'

const addDataSource = (data) => {
  return axios.post('system_settings/dataSource/create', data)
}
const getDataSourceList = (params) => {
  return axios.get('system_settings/dataSource/list', { params })
}
const updateDataSource = (id, data) => {
  return axios.put(`system_settings/dataSource/update/${id}`, data)
}
const deleteDataSource = (id) => {
  return axios.delete(`system_settings/dataSource/delete/${id}`)
}
const getDataSource = (id) => {
  return axios.get(`/system_settings/dataSource/get/${id}`)
}
const dataSourceTest = (data) => {
  return axios.post('system_settings/dataSource/dataSourceTest', data)
}
const updateStatusDataSource = (id) => {
  return axios.put(`system_settings/dataSource/updateStatus/${id}`)
}
export default {
  addDataSource,
  getDataSourceList,
  updateDataSource,
  deleteDataSource,
  getDataSource,
  dataSourceTest,
  updateStatusDataSource
}