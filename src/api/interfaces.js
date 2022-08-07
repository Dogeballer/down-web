import axios from 'axios'

const getInterfaceTree = () => {
  return axios.get('interfaces/tree')
}
const getInterfaceList = (params) => {
  return axios.get('interfaces/list', { params })
}
const getInterfaceClassList = (params) => {
  return axios.get('interfaces/interfaceClass/list', { params })
}
const getInterfaceClassSelector = (params) => {
  return axios.get('interfaces/interfaceClass/selector', { params })
}
const getInterfaceSelector = (params) => {
  return axios.get('interfaces/selector', { params })
}
const updateInterface = (id, data) => {
  return axios.put(`interfaces/update/${id}`, data)
}
const updateInterfaceBody = (id, data) => {
  return axios.put(`interfaces/interfaceBody/update/${id}`, data)
}
const createInterfaceBody = (data) => {
  return axios.post(`interfaces/interfaceBody/create`, data)
}
const deleteInterfaceBody = (id) => {
  return axios.delete(`interfaces/interfaceBody/delete/${id}`)
}
const updateInterfaceClass = (id, data) => {
  return axios.put(`interfaces/interfaceClass/update/${id}`, data)
}
const createInterfaceClass = (data) => {
  return axios.post(`interfaces/interfaceClass/create`, data)
}
const deleteInterfaceClass = (id) => {
  return axios.delete(`interfaces/interfaceClass/delete/${id}`)
}
const deleteInterfaceParam = (id) => {
  return axios.delete(`interfaces/interfaceParam/delete/${id}`)
}
const getInterfaceCallBackParams = (params) => {
  return axios.get('interfaces/interfaceCallBackParams', { params })
}
const updateInterfaceCallBackParams = (id, data) => {
  return axios.put(`interfaces/interfaceCallBackParams/${id}`, data)
}
const createInterfaceCallBackParams = (data) => {
  return axios.post(`interfaces/interfaceCallBackParams`, data)
}
const deleteInterfaceCallBackParams = (id) => {
  return axios.delete(`interfaces/interfaceCallBackParams/${id}`)
}
const addInterface = (data) => {
  return axios.post(`interfaces/`, data)
}
const getInterface = (id) => {
  return axios.get(`interfaces/${id}`)
}
const getInterfaceBody = (id) => {
  return axios.get(`interfaces/interfaceBody/list?belong_interface=${id}`)
}
const getInterfaceHistory = (params) => {
  return axios.get(`interfaces/interfaceTest/list`, { params })
}
const updateInterfaceStatus = (id) => {
  return axios.put(`interfaces/updateStatus/${id}`)
}
const deleteInterface = (id) => {
  return axios.delete(`interfaces/${id}`)
}
const SwaggerAnalysis = (data) => {
  return axios.post(`interfaces/SwaggerAnalysis`, data)
}
const InterfaceTest = (data) => {
  return axios.post(`interfaces/interfaceTest`, data)
}

export default {
  getInterfaceList,
  getInterfaceTree,
  getInterfaceClassList,
  updateInterfaceStatus,
  addInterface,
  updateInterface,
  deleteInterface,
  SwaggerAnalysis,
  getInterface,
  getInterfaceClassSelector,
  getInterfaceSelector,
  getInterfaceBody,
  getInterfaceHistory,
  updateInterfaceBody,
  createInterfaceBody,
  deleteInterfaceBody,
  updateInterfaceClass,
  createInterfaceClass,
  deleteInterfaceClass,
  deleteInterfaceParam,
  InterfaceTest,
  getInterfaceCallBackParams,
  createInterfaceCallBackParams,
  updateInterfaceCallBackParams,
  deleteInterfaceCallBackParams
}
