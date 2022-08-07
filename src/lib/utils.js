import { message } from 'antd'
import moment from 'moment'
import convert from 'xml-js'
import constant, { XML_OPTION, COMPONENT_TYPE } from '../constant'
import utilities from '../style/utilities.scss'
import {
  WARNING_MESSAGE
} from './compRuleConfig'

export const emptyFn = function () {}
export const emptyStr = ''

const {
  DB_TB_REGEX,
  DB_TB_LENGTH_REGEX,
  TRANSFORM_FIELDS
} = constant

export const addEvent = function (el, event, handler) {
  removeEvent(el, event, handler)
  el.addEventListener(event, handler)
}

export const utf8length = function (str) {
  const sLen = str.length
  let utf8len = 0
  for (let i = 0; i < sLen; i++) {
    if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 128) {
      utf8len += 1
    } else {
      utf8len += 2
    }
  }
  return utf8len
}

export const removeEvent = function (el, event, handler) {
  el.removeEventListener(event, handler)
}

export default {
  emptyFn,
  emptyStr,
  addEvent,
  removeEvent
}

export const isEmpty = (obj) => {
  let isEmpty = false
  if (obj === undefined || obj === null || obj === '') {
    isEmpty = true
  } else if (Array.isArray(obj) && obj.length === 0) {
    isEmpty = true
  } else if (obj.constructor === Object && Object.keys(obj).length === 0) {
    isEmpty = true
  }
  return isEmpty
}

/**
 * null,undefined,false 转为 ''
 * @param value
 * @param str
 * @return {*|string}
 */
export const toBlank = (value, str = '') => {
  return value || value === 0 ? value + '' : str
}

export const moveIndex = (arr, fromIndex, toIndex) => {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
  return arr
}

// index: 当前元素索引
export const moveUp = (arr, index) => {
  if (index === 0) return
  moveIndex(arr, index, index - 1)
}

// index: 当前元素索引
export const moveDown = (arr, index) => {
  if (index === arr.length - 1) return
  moveIndex(arr, index, index + 1)
}

// export const treeEach = (tree, handler, childrenKey = 'children') => {
//   let deep = 1
//   const each = (tnode, cb) => {
//     if (tnode) {
//       cb(tnode, deep)
//
//       const children = tnode[childrenKey]
//       deep++
//       Array.isArray(children) && children.forEach(t => {
//         each(t, cb)
//       })
//       deep--
//     }
//   }
//
//   if (Array.isArray(tree)) {
//     tree.forEach((t) => {
//       each(t, handler)
//     })
//   } else {
//     each(tree, handler)
//   }
// }

export const getUnique = (() => {
  let guid = 1
  return function (prefix = 'guid') {
    return `${prefix}-${guid++}`
  }
})()

export const getNegativeUnique = (() => {
  let id = -1
  return () => {
    return id--
  }
})()

export const checkTableData = (data) => {
  let errIndex = []
  data.map((item, index) => {
    if (isEmpty(item.fieldName)) {
      if (errIndex.indexOf(index) === -1) errIndex.push(index)
      message.warning('字段名称为必填值')
    }
    if (!DB_TB_REGEX.test(item.fieldName)) {
      if (errIndex.indexOf(index) === -1) errIndex.push(index)
      message.warning(`字段名必须以小写字母开头，且仅包含小写字母数字'_'`)
    }
    if (!DB_TB_LENGTH_REGEX.test(item.fieldName)) {
      if (errIndex.indexOf(index) === -1) errIndex.push(index)
      message.warning('字段名称长度必须小于50个字符')
    }
    if ('fieldNameZh' in item) {
      if (isEmpty(item.fieldNameZh)) {
        if (errIndex.indexOf(index) === -1) errIndex.push(index)
        message.warning('字段中文名称为必填值')
      }
      if (utf8length(item.fieldNameZh) > 100) {
        if (errIndex.indexOf(index) === -1) errIndex.push(index)
        message.warning('字段名称长度必须小于100个字符')
      }
      if (DB_TB_REGEX.test(item.fieldNameZh)) {
        if (errIndex.indexOf(index) === -1) errIndex.push(index)
        message.warning('请输入中文字段名')
      }
    }
    // if (!item.nullFlag && (item.defaultValueType === 1)) {
    //   message.warning('未选中允许空值，默认值类型不允许为NULL')
    //   return false
    // }
    if (item.defaultValueType === 4 && isEmpty(item.defaultValue)) {
      if (errIndex.indexOf(index) === -1) errIndex.push(index)
      message.warning('选择自定义类型，必须填入默认值')
    }
    if ('fieldType' in item) {
      if (item.fieldType === 'date' && isEmpty(item.fieldFormat)) {
        if (errIndex.indexOf(index) === -1) errIndex.push(index)
        message.warning('选择时间类型，必须选择字段格式')
      }
    }
    if (item.partitionField && isEmpty(item.partitionType)) {
      if (errIndex.indexOf(index) === -1) errIndex.push(index)
      message.warning('选中分区字段，必须选择分区类型')
    }
  })
  return errIndex
}

export const checkFamilyData = (item, index) => {
  if (isEmpty(item.familyName)) {
    message.warning('列族名称为必填值, 请更正第' + (index + 1) + '个列族名称')
    return false
  }
  if (!DB_TB_REGEX.test(item.familyName)) {
    message.warning('列族名称必须以小写字母开头，且仅包含小写字母数字_ , 请更正第' + (index + 1) + '个列族名称')
    return false
  }
  if (!DB_TB_LENGTH_REGEX.test(item.familyName)) {
    message.warning('列族名称长度必须小于50个字符, 请更正第' + (index + 1) + '个列族名称长度')
    return false
  }
  if (isEmpty(item.familyNameZh)) {
    message.warning('列族名称中文名称为必填值, 请更正第' + (index + 1) + '个列族中文名称')
    return false
  }
  if (utf8length(item.familyNameZh) > 100) {
    message.warning('列族中文名称长度必须小于100个字符, 请更正第' + (index + 1) + '个列族中文名称')
    return false
  }
  if (DB_TB_REGEX.test(item.familyNameZh)) {
    message.warning('请输入中文列族名称, 请更正第' + (index + 1) + '个列族中文名称')
    return false
  }
  return true
}

export const fixTableData = (data) => {
  TRANSFORM_FIELDS.forEach(field => {
    if (data.hasOwnProperty(field)) data[field] ? data[field] = 1 : data[field] = 0
  })
  if ('dictTableId' in data && isEmpty(data.dictTableId)) data.dictTableId = -1
}

export const reducingTableData = (data) => {
  TRANSFORM_FIELDS.forEach(field => {
    if (data.hasOwnProperty(field)) data[field] === 1 ? data[field] = true : data[field] = false
  })
}

export const getParentNode = (treeNodes, nodeId, childrenKey = 'children', key = 'id') => {
  let parentNode
  const find = (parant, nodes) => {
    const len = nodes.length
    for (let i = 0; i < len; i++) {
      const item = nodes[i]
      if (item[key] === nodeId) {
        parentNode = parant
      } else {
        if (item[childrenKey] && item[childrenKey].length > 0) find(item, item[childrenKey])
      }
    }
  }
  find(treeNodes, treeNodes)
  return parentNode
}

/**
 *
 * @param array
 * @returns {array}
 * 获取当前节点的父节点链
 */
export const getParentNodeChain = (array, targetId, childrenKey = 'children', key = 'id') => {
  let going = true
  let parentChain = []
  const find = (array, targetId) => {
    array.forEach(item => {
      if (!going) return
      parentChain.push(item)
      if (item[key] === targetId) {
        going = false
      } else if (item[childrenKey]) {
        find(item[childrenKey], targetId)
      } else {
        parentChain.pop()
      }
    })
    if (going) parentChain.pop()
  }

  find(array, targetId)
  return parentChain
}

export const pushNewNode = (data, parentId, values) => {
  if (values.parent === 0) {
    data.push({ id: getNegativeUnique(), ...values })
  } else {
    treeEach(data, (node) => {
      if (parentId === node.id) {
        if (!node.children) node.children = []
        if (values.paramCategory === 2 && node.hasOwnProperty('cycle')) node.cycle = 0
        node.children.push({ id: getNegativeUnique(), ...values })
      }
    })
  }
  return data
}

export const resetDataForNodeChange = (data, record, values) => {
  // 未改变父节点
  if (record.parent === values.parent) {
    treeEach(data, (node) => {
      if (record.id === node.id) Object.assign(node, values)
    })
  } else {
    let container = []
    if (values.parent === 0) {
      container = data
    } else {
      treeEach(data, (node) => {
        if (values.parent === node.id) {
          if (isEmpty(node.children)) {
            node.children = container
          } else {
            container = node.children
          }
        }
      })
    }
    // 补充子节点
    if (values.paramCategory !== 0) {
      treeEach(data, (node) => {
        if (record.id === node.id) record.children = node.children
      })
    }
    // 删除源节点，新增新节点
    let parentNode = getParentNode(data, record.id)
    if (Array.isArray(parentNode)) {
      data = parentNode.filter(item => item.id !== record.id)
    } else {
      parentNode.children = parentNode.children.filter(item => item.id !== record.id)
    }
    container.push(Object.assign(record, values))
  }
  return data
}

export const deepClone = (source) => {
  if (source === null) return null
  if (typeof source !== 'object') return source
  if (source instanceof RegExp) return new RegExp(source)
  if (source instanceof Date) return new Date(source)
  const target = new source.constructor()
  Reflect.ownKeys(source).forEach(key => {
    target[key] = deepClone(source[key])
  })
}

export const getElementPosition = (e) => {
  let x = 0
  let y = 0
  while (e != null) {
    x += e.offsetLeft
    y += e.offsetTop
    e = e.offsetParent
  }
  return { x, y }
}

export const getComponentValue = (e, type) => {
  let value
  switch (type) {
    case 1: // Select
      value = e
      break
    case 2: // Input
      value = e.target.value
      break
    case 3: // CheckBox
      value = e.target.checked
      break
    default:
      value = e.target.value
      break
  }
  return value
}

export const getQueryString = (name, location) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

export const removeEmptyChildren = (data) => {
  data.forEach(item => {
    if (item.children.length === 0) {
      delete item.children
    } else {
      removeEmptyChildren(item.children)
    }
  })
}

// 求table的column的width之和
export const getColumnsWidth = (column) => {
  let scrollX = 0
  if (!isEmpty(column)) {
    column.forEach(item => {
      if (item.width) { scrollX += item.width }
    })
    return scrollX
  }
}

export const getAllExpandKeys = (data) => {
  let keys = []
  treeEach(data, (node) => {
    if (!isEmpty(node.children)) keys.push(node.id)
  })
  return keys
}

export const getExpandKeys = ({
  data,
  key = 'id',
  prefix = '',
  childrenKey = 'children'
}) => {
  let keys = []
  treeEach(data, (node) => {
    if (!isEmpty(node[childrenKey])) {
      keys.push(prefix ? `${prefix}_${node[key]}` : `${node[key]}`)
    }
  })
  return keys
}

export const handleNodeTreeData = ({ nodeList, isNodeTree, recordId }) => {
  treeEach(nodeList, (node) => {
    if (isEmpty(node.children)) delete node.children
    node.key = node.id
    node.value = node.id
    node.title = node.name
    if (isNodeTree) {
      node.disabled = node.node === false || node.id === recordId // 控制父节点选择中只可以选择节点
    } else {
      node.disabled = node.node === true // 控制参数值选择中只可以选择非节点
    }
  })
  return nodeList
}

// 可以在input框是不是0或正整数 应用场景：input
export const isInt = (str) => {
  let isInt = true
  str.toString().split('').forEach(item => {
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(item) === -1) isInt = false
  })
  return isInt
}

export const isJSON = (str) => {
  if (typeof str !== 'string') return false
  try {
    var obj = JSON.parse(str)
    return typeof obj === 'object' && !isEmpty(obj)
  } catch (e) {
    return false
  }
}

export const isXML = (str) => {
  if (typeof str !== 'string') return false
  try {
    var obj = convert.xml2json(str, XML_OPTION)
    return typeof obj === 'string' && obj
  } catch (e) {
    return false
  }
}

export const verifyComponentName = (componentName) => {
  if (isEmpty(componentName)) {
    message.warning(WARNING_MESSAGE.INPUT_COMP_NAME_EMPTY)
    return false
  } else if (componentName && componentName.length > 50) {
    message.warning(WARNING_MESSAGE.INPUT_COMP_NAME_LENGTH)
    return false
  }
  return true
}

export const verifyComponentData = (data, componentType) => {
  const [
    nameField,
    inputMessageField,
    inputStructureField,
    outputMessageField,
    outputStructureField
  ] = ['name', 'inputMessage', 'inputStructure', 'outputMessage', 'outputStructure']
  let verifyFields = []
  if (componentType === COMPONENT_TYPE.PARAM_MAP) {
    verifyFields = [
      nameField,
      inputMessageField,
      outputMessageField,
      outputStructureField
    ]
  } else if (componentType === COMPONENT_TYPE.ASYN_MESSAGE) {
    verifyFields = [
      nameField,
      inputMessageField,
      inputStructureField,
      outputMessageField,
      outputStructureField
    ]
  }
  const len = verifyFields.length
  for (let i = 0; i < len; i++) {
    const field = verifyFields[i]
    if (field === nameField) {
      if (isEmpty(data[field])) {
        message.warning(WARNING_MESSAGE.INPUT_COMP_NAME_EMPTY)
        return false
      } else if (data[field] && data[field].length > 50) {
        message.warning(WARNING_MESSAGE.INPUT_COMP_NAME_LENGTH)
        return false
      }
    } else if (field === inputMessageField || field === outputMessageField) {
      if (isEmpty(data[field]) || (!isEmpty(data[field]) && !isJSON(data[field]))) {
        const alertInfo = field === inputMessageField
          ? WARNING_MESSAGE.INPUT_MESSAGE_JSON
          : WARNING_MESSAGE.OUTPUT_MESSAGE_JSON
        message.warning(alertInfo)
        return false
      }
    } else if (field === inputStructureField || field === outputStructureField) {
      if (data[field].length === 0) {
        const alertInfo = field === inputStructureField
          ? WARNING_MESSAGE.INPUT_MESSAGE_STRUCTURE
          : WARNING_MESSAGE.OUTPUT_MESSAGE_STRUCTURE
        message.warning(alertInfo)
        return false
      }
    }
  }
  return true
}

export const getEvenRowClass = (index) => {
  return index % 2 === 1 ? utilities['table-even-row'] : ''
}

// 查找数组中是否有重复元素
export const isRepeat = (arr) => {
  let hash = {}
  for (let i in arr) {
    if (hash[arr[i]]) {
      return true
    }
    hash[arr[i]] = true
  }
  return false
}

/**
 * 树的拷贝, 只对children做深拷贝, 其他属性值为浅拷贝
 * @param tree {object | object[]} - 树可以是数组或者一个根节点
 * @param childrenKey
 * @returns {Array}
 */
export const treeCopy = function (tree, childrenKey = 'children') {
  let queue = Array.isArray(tree) ? [...tree] : [tree]
  let rootLen = queue.length
  let root = []
  let i = 0
  while (queue[0]) {
    let curr = queue.shift()
    if (i < rootLen) {
      root.push({ ...curr })
    }
    i++
    if (Array.isArray(curr[childrenKey])) {
      curr[childrenKey] = curr[childrenKey].map(node => ({ ...node }))
      queue.push(...curr[childrenKey])
    }
  }
  return Array.isArray(tree) ? root : root[0]
}

// 树的前序遍历
export const treeEach = function (tree, handler, childrenKey = 'children') {
  let deep = 1
  let each = function (tnode, cb) {
    if (tnode) {
      cb(tnode, deep)
      let children = tnode[childrenKey]
      deep++
      Array.isArray(children) && children.forEach(function (t) {
        each(t, cb)
      })
      deep--
    }
  }
  if (Array.isArray(tree)) {
    tree.forEach(function (t) {
      each(t, handler)
    })
  } else {
    each(tree, handler)
  }
}

export const timestampFormat = (t) => {
  let num, unit
  if (isEmpty(t)) return '--'
  if (t < 1000) {
    num = t
    unit = 'ms'
  } else if (t / 1000 < 60) {
    t = (t / 1000).toFixed(2)
    num = t
    unit = 's'
  } else if (t / 1000 >= 60 && t / 1000 < 3599) {
    num = Math.floor(moment.duration(t / 1000, 'seconds').as('minutes') * 10) / 10
    unit = 'min'
  } else {
    num = Math.floor(moment.duration(t / 1000, 'seconds').as('hours') * 10) / 10
    unit = 'h'
  }
  return `${num}${unit}`
}
