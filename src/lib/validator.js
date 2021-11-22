export const validator = (_, value) => {
  const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
  return new Promise((resolve, reject) => {
    if (reg.test(value)) {
      resolve()
    } else {
      reject(new Error('请输入正确的IP地址'))
    }
  })
}

export default {
  validator
}
