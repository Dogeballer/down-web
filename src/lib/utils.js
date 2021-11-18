
/**
 * @date 2021-11-15 15:26:18
 * @description 描述 工具类
 * @copyright Copyright 2018 CEC(Fujian) Healthcare Big Data Operation Service Co., Ltd. All rights reserved.
 */
export const emptyStr = ''

export const removeEvent = function (el, event, handler) {
  el.removeEventListener(event, handler)
}

export const addEvent = function (el, event, handler) {
  removeEvent(el, event, handler)
  el.addEventListener(event, handler)
}

/**
 *
 * @param {number} 传入数值
 * @returns {string}
 * 将数字转换成千分位，
 * 8462948.24 转成 8,462,948.24
 * 8462948 转成 8,462,948
 */
export const thousandConvert = function (number) {
  if (!Number.isInteger(number)) return ''
  const afterConvert = (number.toString().indexOf('.') !== -1)
    ? number.toLocaleString()
    : number.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return afterConvert
}

export default {
  addEvent,
  removeEvent
}
