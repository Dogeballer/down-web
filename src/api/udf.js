import axios from 'axios'

const addUdf = (data) => {
  return axios.post('system_settings/udf/create', data)
}
const getUdfList = (params) => {
  return axios.get('system_settings/udf/list', { params })
}
const updateUdf = (id, data) => {
  return axios.put(`system_settings/udf/update/${id}`, data)
}
const getUdf = (id) => {
  return axios.get(`system_settings/udf/get/${id}`)
}
const deleteUdf = (id) => {
  return axios.delete(`system_settings/udf/delete/${id}`)
}
const addUdfArgs = (data) => {
  return axios.post('system_settings/udf/udfArgs/create', data)
}
const getUdfArgsList = (params) => {
  return axios.get('system_settings/udf/udfArgs/list', { params })
}
const updateUdfArgs = (id, data) => {
  return axios.put(`system_settings/udf/udfArgs/update/${id}`, data)
}
const deleteUdfArgs = (id) => {
  return axios.delete(`system_settings/udf/udfArgs/delete/${id}`)
}
const onlineDebug = (data) => {
  return axios.post('system_settings/udf/onlineDebug', data)
}
const updateStatusUdf = (id) => {
  return axios.put(`system_settings/udf/updateStatus/${id}`)
}
export default {
  addUdf,
  getUdf,
  getUdfList,
  updateUdf,
  deleteUdf,
  addUdfArgs,
  getUdfArgsList,
  updateUdfArgs,
  deleteUdfArgs,
  onlineDebug,
  updateStatusUdf,
}