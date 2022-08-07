import { isEmpty } from '@fishballer/bui/dist/lib/utils'

export const validator = (_, value) => {
  const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
  return new Promise((resolve, reject) => {
    if (reg.test(value)) {
      resolve()
    } else {
      const errStr = isEmpty(value) ? '请输入资产IP' : '请输入正确的IP地址'
      reject(new Error(errStr))
    }
  })
}

export default {
  validator
}
