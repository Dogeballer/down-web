import axios from 'axios'

const getUseCase = (id) => {
  return axios.get(`usecases/get/${id}`)
}
const getCasePollParam = (id) => {
  return axios.get(`usecases/casePollParamSelect/${id}`)
}
const getUseCasesList = (params) => {
  return axios.get('usecases/list', {params})
}
const getUseCaseSelector = () => {
  return axios.get('usecases/selector')
}
const getSuiteUseCasesList = (params) => {
  return axios.get('usecases/suiteUseCasesList', {params})
}
const getUseCaseStepList = (id) => {
  return axios.get(`usecases/caseSteps/list?use_case=${id}`)
}
const getUseCaseStepAssertList = (id) => {
  return axios.get(`usecases/caseAssert/list?case_step=${id}`)
}
const getUseCaseStepPollList = (id) => {
  return axios.get(`usecases/caseStepPoll/list?case_step=${id}`)
}
const getStepCircularKeyList = (id) => {
  return axios.get(`usecases/stepCircularKey/list?case_step=${id}`)
}
const getUseCaseTree = (params) => {
  return axios.get('usecases/tree', {params})
}
const updateInterface = (id, data) => {
  return axios.put(`interfaces/update/${id}`, data)
}
const updateUseCase = (id, data) => {
  return axios.put(`usecases/update/${id}`, data)
}
const updateUseCaseStep = (id, data) => {
  return axios.put(`usecases/caseSteps/update/${id}`, data)
}
const updateUseCaseAssert = (id, data) => {
  return axios.put(`usecases/caseAssert/update/${id}`, data)
}
const updateUseCaseStepPoll = (id, data) => {
  return axios.put(`usecases/caseStepPoll/update/${id}`, data)
}
const updateStepCircularKey = (id, data) => {
  return axios.put(`usecases/stepCircularKey/update/${id}`, data)
}
const updateUseCaseStatus = (id) => {
  return axios.put(`usecases/updateStatus/${id}`)
}

const copyUseCase = (data) => {
  return axios.post(`usecases/copy`, data)
}
const interfaceToCaseCreate = (data) => {
  return axios.post(`usecases/interfaceSaveCase`, data)
}
const UseCaseManualExecute = (data) => {
  return axios.post(`usecases/taskExecute`, data)
}
const UseCaseAsyncExecute = (data) => {
  return axios.post(`usecases/useCaseAsyncExecute`, data)
}
const createUseCase = (data) => {
  return axios.post(`usecases/create`, data)
}
const createUseCaseStep = (data) => {
  return axios.post(`usecases/caseSteps/create`, data)
}
const createUseCaseAssert = (data) => {
  return axios.post(`usecases/caseAssert/create`, data)
}
const createUseCaseStepPoll = (data) => {
  return axios.post(`usecases/caseStepPoll/create`, data)
}
const createStepCircularKey = (data) => {
  return axios.post(`usecases/stepCircularKey/create`, data)
}
const deleteUseCase = (id) => {
  return axios.delete(`usecases/delete/${id}`)
}
const deleteUseCaseAssert = (id) => {
  return axios.delete(`usecases/caseAssert/delete/${id}`)
}
const deleteUseCaseStepPoll = (id) => {
  return axios.delete(`usecases/caseStepPoll/delete/${id}`)
}
const deleteStepCircularKey = (id) => {
  return axios.delete(`usecases/stepCircularKey/delete/${id}`)
}
const deleteUseCaseStep = (id) => {
  return axios.delete(`usecases/caseSteps/delete/${id}`)
}
const copyCaseStep = (data) => {
  return axios.post(`usecases/caseSteps/copy`, data)
}
const getStepCallBackParams = (params) => {
  return axios.get('usecases/stepCallBackParams', {params})
}
const updateStepCallBackParams = (id, data) => {
  return axios.put(`usecases/stepCallBackParams/${id}`, data)
}
const createStepCallBackParams = (data) => {
  return axios.post(`usecases/stepCallBackParams`, data)
}
const deleteStepCallBackParams = (id) => {
  return axios.delete(`usecases/stepCallBackParams/${id}`)
}
const getStepForwardAfterOperationList = (params) => {
  return axios.get('usecases/stepForwardAfterOperation/list', {params})
}
const updateStepForwardAfterOperation = (id, data) => {
  return axios.put(`usecases/stepForwardAfterOperation/update/${id}`, data)
}
const createStepForwardAfterOperation = (data) => {
  return axios.post(`usecases/stepForwardAfterOperation/create`, data)
}
const deleteStepForwardAfterOperation = (id) => {
  return axios.delete(`usecases/stepForwardAfterOperation/delete/${id}`)
}
const sqlScriptExecute = (data) => {
  return axios.post(`usecases/sqlScriptExecute`, data)
}
const mqttPublish = (data) => {
  return axios.post(`usecases/mqttPublish`, data)
}
const mqttSub = (data) => {
  return axios.post(`usecases/mqttSub`, data)
}
export default {
  getUseCasesList,
  getUseCaseSelector,
  getSuiteUseCasesList,
  getUseCaseTree,
  getUseCaseStepList,
  getUseCaseStepAssertList,
  getUseCaseStepPollList,
  getStepCircularKeyList,
  getUseCase,
  getCasePollParam,
  updateUseCaseStatus,
  deleteUseCase,
  copyUseCase,
  copyCaseStep,
  UseCaseManualExecute,
  UseCaseAsyncExecute,
  updateUseCase,
  updateUseCaseStep,
  updateUseCaseAssert,
  updateUseCaseStepPoll,
  updateStepCircularKey,
  createUseCase,
  createUseCaseStep,
  createUseCaseAssert,
  createUseCaseStepPoll,
  createStepCircularKey,
  interfaceToCaseCreate,
  deleteUseCaseStep,
  deleteUseCaseAssert,
  deleteUseCaseStepPoll,
  deleteStepCircularKey,
  getStepCallBackParams,
  createStepCallBackParams,
  updateStepCallBackParams,
  deleteStepCallBackParams,
  getStepForwardAfterOperationList,
  createStepForwardAfterOperation,
  updateStepForwardAfterOperation,
  deleteStepForwardAfterOperation,
  sqlScriptExecute,
  mqttPublish,
  mqttSub
}
