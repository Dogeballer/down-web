import axios from 'axios'

const createTestSuiteClass = (data) => {
  return axios.post('testSuite/testSuiteClass/create', data)
}
const getTestSuiteClassList = (params) => {
  return axios.get('testSuite/testSuiteClass/list', { params })
}
const updateTestSuiteClass = (id, data) => {
  return axios.put(`testSuite/testSuiteClass/update/${id}`, data)
}
const updateTestSuiteClassStatus = (id) => {
  return axios.put(`testSuite/testSuiteClass/updateStatus/${id}`)
}
const deleteTestSuiteClass = (id) => {
  return axios.delete(`testSuite/testSuiteClass/delete/${id}`)
}
const createTestSuite = (data) => {
  return axios.post('testSuite/create', data)
}
const getTestSuiteList = (params) => {
  return axios.get('testSuite/list', { params })
}
const updateTestSuite = (id, data) => {
  return axios.put(`testSuite/update/${id}`, data)
}
const getTestSuite = (id) => {
  return axios.get(`testSuite/get/${id}`)
}
const updateTestSuiteStatus = (id) => {
  return axios.put(`testSuite/updateStatus/${id}`)
}
const deleteTestSuite = (id) => {
  return axios.delete(`testSuite/delete/${id}`)
}
const executeTestSuite = (id) => {
  return axios.post(`testSuite/suiteExecute?id=${id}`)
}
const asyncSuiteExecute = (id) => {
  return axios.post(`testSuite/asyncSuiteExecute?id=${id}`)
}
const batchDeleteTestSuite = (ids) => {
  return axios.delete('testSuite/batchDelete', {
    data: { ids }
  })
}

export default {
  createTestSuiteClass,
  getTestSuiteClassList,
  updateTestSuiteClass,
  updateTestSuiteClassStatus,
  deleteTestSuiteClass,
  createTestSuite,
  getTestSuite,
  getTestSuiteList,
  updateTestSuite,
  updateTestSuiteStatus,
  deleteTestSuite,
  batchDeleteTestSuite,
  executeTestSuite,
  asyncSuiteExecute,
}
