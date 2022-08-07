import axios from 'axios'

const addEnvironment = (data) => {
  return axios.post('projects/environment', data)
}
const getEnvironmentList = (params) => {
  return axios.get('projects/environment/list', {params})
}
const updateEnvironment = (id, data) => {
  return axios.put(`projects/environment/${id}`, data)
}
const deleteEnvironment = (id) => {
  return axios.delete(`projects/environment/${id}`)
}
const updateStatusEnvironment = (id) => {
  return axios.put(`projects/environment/updateStatus/${id}`)
}

export default {
  getEnvironmentList,
  addEnvironment,
  updateEnvironment,
  deleteEnvironment,
  updateStatusEnvironment,
}
