import axios from 'axios'

const addMqttClient = (data) => {
  return axios.post('system_settings/mqttClient/create', data)
}
const getMqttClientList = (params) => {
  return axios.get('system_settings/mqttClient/list', { params })
}
const updateMqttClient = (id, data) => {
  return axios.put(`system_settings/mqttClient/update/${id}`, data)
}
const deleteMqttClient = (id) => {
  return axios.delete(`system_settings/mqttClient/delete/${id}`)
}
const getMqttClient = (id) => {
  return axios.get(`/system_settings/mqttClient/get/${id}`)
}
const mqttClientTest = (data) => {
  return axios.post('system_settings/mqttClient/mqttClientTest', data)
}
const updateStatusMqttClient = (id) => {
  return axios.put(`system_settings/mqttClient/updateStatus/${id}`)
}
export default {
  addMqttClient,
  getMqttClientList,
  updateMqttClient,
  deleteMqttClient,
  getMqttClient,
  mqttClientTest,
  updateStatusMqttClient
}