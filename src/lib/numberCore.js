/**
 * 存放 对数值 操作的方法
 */

/**
 * @param num
 * @returns {string}
 * 将数字转换成千分位，
 * 8462948.24 转成 8,462,948.24
 * 8462948 转成 8,462,948
 */
export function thousandComma (num) {
  if (!Number.isInteger(num)) return ''
  const c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return c
}
