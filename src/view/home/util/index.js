function isObject (val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

function mergeEchart (target, ...args) {
  target = target || {}
  for (let i = 0; i < args.length; i++) {
    if (!isObject(args[i])) continue
    for (const key of Object.keys(args[i])) {
      const argsValue = args[i][key]
      if (isObject(argsValue)) {
        if (!isObject(target[key])) {
          target[key] = {}
        }
        mergeEchart(target[key], argsValue)
      } else {
        if (argsValue !== undefined && argsValue !== null && argsValue !== '') {
          target[key] = argsValue
        } else if (target.hasOwnProperty(key)) {
          delete target[key]
        }
      }
    }
  }
  return target
}

/**
 * 合并 echart 的option
 */
export function mergeEchartConfig (...args) {
  return mergeEchart({}, ...args)
}