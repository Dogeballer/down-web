import { thousandComma } from '@cecdataFE/bui'

// 数组去重
export function unique (arr) {
  return Array.from(new Set(arr))
}

// 试着将字符串转成数字格式
export const tryNumber = (value) => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'string' && !isNaN(value)) return Number(value)
  return value || null
}

//  数字相加
export const sumNum = (...args) => {
  let ret = 0
  args.forEach(value => {
    value = tryNumber(value)
    if (typeof value !== 'number') return
    ret = ret + value
  })

  return ret
}

export const formatDataVolume = (value) => {
  let v = ''
  if (!isNaN(value)) {
    const tmp = Number(value)
    if (tmp > 10000) {
      v = thousandComma(Number(`${(tmp / 10000)}`.match(/^\d+(?:\.\d{0,1})?/))) + ' 万条'
    } else {
      v = `${tmp} 条`
    }
  }
  return v
}
