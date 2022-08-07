import constant from '../constant'

const VER_1 = constant.API_VER_1

/**
 * 获取字典
 * @param {int} dictCode - 类型
 */
const ALL_DIST_DATA = {}

const getDictList = (dictCode, serverName) => {
  if (Array.isArray(ALL_DIST_DATA[dictCode])) {
    return Promise.resolve({
      code: 0,
      data: {
        list: [...ALL_DIST_DATA[dictCode]]
      }
    })
  }
  return axiosProxy.httpGet(`${serverName || 'etl_server'}/${VER_1}/web/dict/code`, {
    params: {
      dictCode
    }
  }).then((response) => {
    ALL_DIST_DATA[dictCode] = [...response.data.items]
    return response
  })
}

const getDictBatch = (dictCodes, serverName) => {
  const laveDictList = []
  dictCodes.map(dictCode => {
    const dictInfo = ALL_DIST_DATA[dictCode]
    if (!dictInfo) laveDictList.push(dictCode)
  })
  if (laveDictList.length === 0) {
    return new Promise((resolve, reject) => {
      resolve({...ALL_DIST_DATA})
    })
  } else {
    return axiosProxy.httpGet(`${serverName || 'etl_server'}/${VER_1}/web/dict/code/batch`, {
      params: {
        dictCodes: laveDictList.join(',')
      }
    }).then(({data}) => {
      const list = data.items || []
      list.map(item => {
        ALL_DIST_DATA[item.dictCode] = item.dictList
      })
      return {...ALL_DIST_DATA}
    })
  }
}

/**
 * 获取字典关联
 * @param {param.dictCode} 字典编码
 * @param {param.dictFilter} 字典筛选值
 * @param {param.serverName} 服务名称
 */
const getDictRela = ({dictCode, dictFilter, serverName}) => {
  return axiosProxy.httpGet(`${serverName || 'etl_server'}/${VER_1}/web/dict/code/filter`, {
    params: {
      dictCode,
      dictFilter
    }
  })
}

export default {
  getDictList,
  getDictBatch,
  getDictRela
}
