import axios from 'axios'
import { message } from 'antd'
import { history } from '@cecdataFE/bui'
import { getUserData } from '../../lib/storage'

// 获取环境变量里面的基础 API 路径，设置默认的URL
axios.defaults.baseURL = window.__smp_config.REACT_ENV_API_URL

// 请求拦截器
axios.interceptors.request.use(config => {
  config.timeout = 30000 // 超时时间30s
  // requestCount++
  // 增加 token 头
  // config.headers.common['token'] = token
  // 后端未做登录，暂时将用户名加在header里
  const userData = getUserData()
  config.headers.common.username = userData.userName
  return config
}, (err) => {
  // requestCount--
  return Promise.reject(err.response)
})

// 响应拦截器
axios.interceptors.response.use(response => {
  // requestCount--
  const data = response.data
  if (typeof data.code === 'number' && data.code !== 0) {
    message.error(data.message || '服务端异常')
  }
  return data
}, (err) => {
  // requestCount--
  const serverData = (err.response && err.response.data) || {}
  // 服务端code===2000,表示token过期，跳到重新登录页面
  if (serverData.code === 2000) {
    return history.push('/login')
  }
  if (axios.isCancel(err)) {
    console.warn(err.message)
  } else {
    message.error(serverData.message || err.message || '服务端异常')
    return Promise.reject(err.response)
  }
})
