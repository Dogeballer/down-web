import axios from 'axios'

const getTaskLogTree = (params) => {
  // return axios.get(`usecases/taskLogTree?execute_date=${logDate}`)
  return axios.get(`usecases/taskLogTree`, { params })
}
const stepLogList = (case_log) => {
  return axios.get(`usecases/stepLogList?case_log=${case_log}`)
}
const udfLogList = (params) => {
  return axios.get(`usecases/udfLogList`, { params })
}
const caseLogPageList = (params) => {
  return axios.get('usecases/caseLogPageList', { params })
}
export default {
  getTaskLogTree,
  caseLogPageList,
  stepLogList,
  udfLogList
}
