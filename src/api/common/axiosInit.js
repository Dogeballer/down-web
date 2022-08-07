import axios from 'axios'

import {isEmpty} from '@fishballer/bui/dist/lib/utils'
import {message} from 'antd'
import * as userLocalStorage from "../../lib/userLocalStorage";
import history from '@fishballer/bui/dist/lib/history'
import {clear} from "../../lib/userLocalStorage";


// 获取环境变量里面的基础 API 路径，设置默认的URL
const config = window.__rb_config
axios.defaults.baseURL = config.REACT_ENV_API_URL
// 请求拦截器
axios.interceptors.request.use(config => {
  config.timeout = 3 * 60000 // 超时时间3分钟
  const userInfo = userLocalStorage.getUserInfo()
  if (userInfo && userInfo.access) {
    config.headers.Authorization = "Bearer " + userInfo.access
  }
  return config
}, (err) => {
  message.error(err.message)
  return Promise.reject(err.response)
})

// 响应拦截器
const TokenErrorCode = [401, 403]


axios.interceptors.response.use(response => {
  // console.log(response.config)
  const method = response.config.method
  const {data} = response
  if (data && data.code === 0) {
    if (method.toLocaleLowerCase() !== 'get') message.success('操作成功')
    return data
  } else {
    let msg
    if (isEmpty(data)) {
      msg = '请求错误: 返回对象为空'
    } else if (!data.msg) {
      msg = '请求错误: 原因未知'
    } else {
      msg = data.msg
    }
    message.error(msg)
    return Promise.reject(msg)
  }
}, (err) => {
  if (TokenErrorCode.includes(err.response.status)) {
    history.replace('/login')
    clear()
    message.error('登录过期')
    return Promise.reject(new Error('登录过期'))
  }
  if (axios.isCancel(err)) {
    console.warn(err.message)
  } else {
    let msg = `请求错误: ${err.response.status}错误`
    message.error(msg)
    return Promise.reject(msg)
  }
})
