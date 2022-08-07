import axios from 'axios'

const addAuthEnvironment = (data) => {
  return axios.post('projects/authEnvironment/create', data)
}
const getAuthEnvironmentList = () => {
  return axios.get('projects/authEnvironment/list')
}
const updateAuthEnvironment = (id, data) => {
  return axios.put(`projects/authEnvironment/update/${id}`, data)
}
const deleteAuthEnvironment = (id) => {
  return axios.delete(`projects/authEnvironment/delete/${id}`)
}
const updateStatusAuthEnvironment = (id) => {
  return axios.put(`projects/authEnvironment/updateStatus/${id}`)
}
export default {
  addAuthEnvironment,
  getAuthEnvironmentList,
  updateAuthEnvironment,
  deleteAuthEnvironment,
  updateStatusAuthEnvironment,
}
