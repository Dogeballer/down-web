import axios from 'axios'

const addModule = (data) => {
  return axios.post('projects/modules', data)
}
const getModuleList = (params) => {
  return axios.get('projects/modules/list', { params })
}
const updateModule = (id, data) => {
  return axios.put(`projects/modules/${id}`, data)
}
const deleteModule = (id) => {
  return axios.delete(`projects/modules/${id}`)
}
const getModule = (id) => {
  return axios.get(`projects/modules/${id}`)
}

export default {
  addModule,
  getModuleList,
  updateModule,
  deleteModule,
  getModule
}