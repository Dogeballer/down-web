import routes from './routeItems'

/**
 * *递归遍历数组
 * @param {array} data - 需要递归的数组
 * @param {number} pIndex - 父级的索引值
 * @param {function } cb - 每个数组的回调函数，如果 return false，则停止递归
 */
function map (data, cb) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.routes && item.routes.length) {
      map(item.routes, cb)
    }
    if (cb) cb(item)
  }
}

export default function () {
  const routesMap = routes

  map(routesMap, (route) => {
    route.meta = route.meta || {}
    route.routes = route.routes || []
    route.isChild = !route.routes.length
    route.key = route.path || new Date().valueOf().toString()
  })

  return routesMap
}
