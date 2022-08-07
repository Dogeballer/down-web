import axios from 'axios'

const addProject = (data) => {
  return axios.post('projects/', data)
}
const getProjectList = () => {
  return axios.get('projects')
}
const getProjectModulesSelector = () => {
  return axios.get('projects/selector')
}
const updateProject = (id, data) => {
  return axios.put(`projects/${id}`, data)
}
const deleteProject = (id) => {
  return axios.delete(`projects/${id}`)
}

export default {
  getProjectList,
  addProject,
  updateProject,
  deleteProject,
  getProjectModulesSelector
}
