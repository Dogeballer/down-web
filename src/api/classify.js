import constant from '../constant'
import axios from 'axios'

const VER_1 = constant.API_VER_1

/**
 * 获取调度分类列表
 * @param {string} 分类类型
 */
const getClassList = (classType, containForbidden) => {
  // return axiosProxy.httpGet(`etl_server/${VER_1}/web/${classType}/class`, {
  //   params: {
  //     containForbidden
  //   }
  // })
}

/**
 * 新增分类
 * @param {string} 分类类型
 * @param {data} 分类对象
 */
const addClass = (classType, data) => {
  // return axiosProxy.httpPost(`etl_server/${VER_1}/web/${classType}/class`, data)
}

const addProject = (data) => {
  return axios.post('projects/', data)
}
const getProjectList = () => {
  return axios.get('projects/')
}
const updateProject = (id, data) => {
  return axios.put(`projects/${id}/`, data)
}
const deleteProject = (id) => {
  return axios.delete(`projects/${id}/`)
}

/**
 * 修改分类
 * @param {string} 分类类型
 * @param {data} 分类对象
 */
const updateClass = (classType, data) => {
  // return axiosProxy.httpPut(`etl_server/${VER_1}/web/${classType}/class`, data)
}

/**
 * 删除分类
 * @param {string} 分类类型
 * @param {data} 分类ID
 */
const deleteClass = (classType, ids) => {
  // return axiosProxy.httpDelete(`etl_server/${VER_1}/web/${classType}/class`, {
  //   data: { ids }
  // })
}

export default {
  getClassList,
  getProjectList,
  addProject,
  addClass,
  updateClass,
  updateProject,
  deleteProject,
  deleteClass
}
