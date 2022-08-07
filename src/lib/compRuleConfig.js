import {
  COMPONENT_TYPE
} from '../constant'
import { message } from 'antd'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

export const WARNING_MESSAGE = {
  EXIST_INPUT_SUBSCRIBE_COMP: '输入组件与订阅组件为互斥关系，且只能有一个',
  EXIST_ASYN_COMP: '已经存在异步消息组件',
  EXIST_ERROR_COMP: '已经存在服务报错组件',
  INPUT_COMP_NAME_EMPTY: '请输入组件名称',
  SUB_COMP_PUSHCYCLE_EMPTY: '请输入推送周期',
  SUB_COMP_PUSHTIME_EMPTY: '请输入下次推送时间',
  CONTAIN_NEW_NODE_CHECK: '存在未保存的组件',
  INPUT_COMP_NAME_LENGTH: '组件名称长度必须小于50个字节',
  INPUT_MESSAGE_JSON: '请确认入参消息对象是否正确',
  INPUT_MESSAGE_STRUCTURE: '请确认入参消息结构是否编辑',
  OUTPUT_MESSAGE_JSON: '请确认出参消息对象是否正确',
  PARAM_MAP_COMP_INPUT: '参数映射组件必须有源节点',
  DESENSIT_COMP_INPUT: '脱敏组件必须有源节点',
  INPUT_COMP_EDGE_CHECK: '输入组件不作为目标节点',
  ERROR_COMP_EDGE_CHECK: '服务报错组件不作为源节点',
  ASYN_COMP_EDGE_CHECK: '异步消息组件下游不可为异步消息组件',
  ASYN_COMP_NODE_CHECK: '服务同步调用方式不允许配置异步消息组件',
  MAP_COMP_EDGE_CHECK: '消息映射组件下游不可为消息映射组件/异步消息组件',
  DESENSIT_COMP_EDGE_CHECK: '脱敏组件下游不可为脱敏组件/消息映射组件',
  VALIDATE_COMP_EDGE_CHECK: '校验组件下游只能连接报错组件',
  INPUT_AND_OUT_COMP_CHECK: '组件族中必须包含一个(输入组件/订阅组件)跟一个输出组件',
  DESENSIT_COMP_RANGE_CHECK: '脱敏范围左边输入值必须小于右边输入值'
}

/**
 * 是否存在输入组件
 */
export const existInputOrSubscribeComponent = (nodes) => {
  return nodes.some(item => item.data.componentType === COMPONENT_TYPE.INPUT_COMP ||
    item.data.componentType === COMPONENT_TYPE.SUBSCRIBE_COMP)
}

/**
 * 是否存在异步消息组件
 */
export const existAsynComponent = (nodes) => {
  return nodes.some(item => item.data.componentType === COMPONENT_TYPE.ASYN_MESSAGE)
}

/**
 * 是否存在服务报错组件
 */
export const existErrorComponent = (nodes) => {
  return nodes.some(item => item.data.componentType === COMPONENT_TYPE.ERROR_COMP)
}

/**
 * 组件族中必须包含一个输入组件跟一个输出组件
 */
export const isContainInputAndOutput = (nodes) => {
  let [hasInput, hasOutput] = [false, false]
  nodes.forEach(node => {
    if (node.data.componentType === COMPONENT_TYPE.INPUT_COMP ||
      node.data.componentType === COMPONENT_TYPE.SUBSCRIBE_COMP) hasInput = true
    if (node.data.componentType === COMPONENT_TYPE.OUTPUT_COMP) hasOutput = true
  })
  return hasInput && hasOutput
}

/**
 * 组件族中是否有未保存的组件
 */
export const isContainNewNode = (nodes, edges) => {
  return nodes.some(node => node.id < 0) || edges.some(edge => (edge.source < 0 || edge.target < 0))
}

/**
 * 输入组件不可为连线的目标节点
 */
export const inputCompNotAllowedTarget = (target) => {
  return target.data.componentType === COMPONENT_TYPE.INPUT_COMP
}

/**
 * 服务报错组件不可为连线的源节点-只能在最后
 */
export const errorCompNotAllowedSource = (source) => {
  return source.data.componentType === COMPONENT_TYPE.ERROR_COMP
}

/**
 * 异步消息组件不可连接异步消息组件
 */
export const asynCompNotLinkLimit = (source, target) => {
  return source.data.componentType === COMPONENT_TYPE.ASYN_MESSAGE &&
  target.data.componentType === COMPONENT_TYPE.ASYN_MESSAGE
}

/**
 * 消息映射组件下游不可为消息映射组件/异步消息组件
 */
export const mapCompNotLinkLimit = (source, target) => {
  return source.data.componentType === COMPONENT_TYPE.PARAM_MAP &&
  (target.data.componentType === COMPONENT_TYPE.PARAM_MAP || target.data.componentType === COMPONENT_TYPE.ASYN_MESSAGE)
}

/**
 * 脱敏组件下游不可为消息映射组件/脱敏消息组件
 */
export const desensitCompNotLinkLimit = (source, target) => {
  return source.data.componentType === COMPONENT_TYPE.DESENSIT_COMP &&
  (target.data.componentType === COMPONENT_TYPE.DESENSIT_COMP || target.data.componentType === COMPONENT_TYPE.PARAM_MAP)
}

/**
 * 校验组件下游只能连接报错组件
 */
export const validateCompNotLinkLimit = (source, target) => {
  return source.data.componentType === COMPONENT_TYPE.VERIFY_COMP && target.data.componentType !== COMPONENT_TYPE.ERROR_COMP
}

/**
 * 校验连线规则，暂时只校验输入组件不可作为target,及异步组件不能连接异步组件
 */
export const checkEdgeIsLegal = (source, target) => {
  if (inputCompNotAllowedTarget(target)) {
    message.warning(WARNING_MESSAGE.INPUT_COMP_EDGE_CHECK)
    return false
  }
  if (errorCompNotAllowedSource(source)) {
    message.warning(WARNING_MESSAGE.ERROR_COMP_EDGE_CHECK)
    return false
  }
  if (asynCompNotLinkLimit(source, target)) {
    message.warning(WARNING_MESSAGE.ASYN_COMP_EDGE_CHECK)
    return false
  }
  if (mapCompNotLinkLimit(source, target)) {
    message.warning(WARNING_MESSAGE.MAP_COMP_EDGE_CHECK)
    return false
  }
  if (desensitCompNotLinkLimit(source, target)) {
    message.warning(WARNING_MESSAGE.DESENSIT_COMP_EDGE_CHECK)
    return false
  }
  if (validateCompNotLinkLimit(source, target)) {
    message.warning(WARNING_MESSAGE.VALIDATE_COMP_EDGE_CHECK)
    return false
  }
  return true
}

/**
 * 校验节点规则，校验参数映射组件/脱敏必须接着一个源组件
 */
export const checkNodeIsLegal = (selected, edges) => {
  const sourceList = getSourceList(selected, edges)
  if (!isEmpty(sourceList)) return true
  if (selected.data.componentType === COMPONENT_TYPE.PARAM_MAP) {
    message.warning(WARNING_MESSAGE.PARAM_MAP_COMP_INPUT)
    return false
  } else if (selected.data.componentType === COMPONENT_TYPE.DESENSIT_COMP) {
    message.warning(WARNING_MESSAGE.DESENSIT_COMP_INPUT)
    return false
  }
  return true
}

export const getSourceList = (node, edges) => {
  let sourceList = []
  edges.forEach(edge => {
    if (edge.target === node.id) sourceList.push(edge.source)
  })
  return sourceList
}

export const getTargetList = (node, edges) => {
  let targetList = []
  edges.forEach(edge => {
    if (edge.source === node.id) targetList.push(edge.target)
  })
  return targetList
}

/**
 * 1、流程中只能有一个输入组件
 * 2、流程中只能有一个异步组件
 * 3、同步服务不允许流程中使用异步组件
 * 4、流程中只能有一个服务报错组件
 * @param {*} data 节点数据
 * @param {*} nodes 所有节点
 * @param {*} invokeMode 调用方式
 */
export const checkDragComponent = (data, nodes, invokeMode) => {
  if ((
    data.dictNum === COMPONENT_TYPE.INPUT_COMP ||
    data.dictNum === COMPONENT_TYPE.SUBSCRIBE_COMP) &&
    existInputOrSubscribeComponent(nodes)) {
    message.warning(WARNING_MESSAGE.EXIST_INPUT_SUBSCRIBE_COMP)
    return false
  }
  if (data.dictNum === COMPONENT_TYPE.ASYN_MESSAGE && existAsynComponent(nodes)) {
    message.warning(WARNING_MESSAGE.EXIST_ASYN_COMP)
    return false
  }
  if (data.dictNum === COMPONENT_TYPE.ERROR_COMP && existErrorComponent(nodes)) {
    message.warning(WARNING_MESSAGE.EXIST_ERROR_COMP)
    return false
  }
  if (invokeMode === 1 && data.dictNum === COMPONENT_TYPE.ASYN_MESSAGE) {
    message.warning(WARNING_MESSAGE.ASYN_COMP_NODE_CHECK)
    return false
  }
  return true
}

export const checkHandleSaveNodes = (nodes, edges) => {
  if (isContainNewNode(nodes, edges)) {
    message.warning(WARNING_MESSAGE.CONTAIN_NEW_NODE_CHECK)
    return false
  }
  if (!isContainInputAndOutput(nodes)) {
    message.warning(WARNING_MESSAGE.INPUT_AND_OUT_COMP_CHECK)
    return false
  }
  return true
}

export default {
  WARNING_MESSAGE,
  getSourceList,
  getTargetList,
  checkEdgeIsLegal,
  checkNodeIsLegal,
  checkDragComponent,
  checkHandleSaveNodes
}
