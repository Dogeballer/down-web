import {
  thousandComma
} from '@fishballer/bui'

export const API_VER_1 = 'v1.0'

export const PAGE_SIZE = 20

export const DB_INTF_TYPE = 1

export const XML_OPTION = {
  spaces: 4,
  compact: true
}

export const ANT_SORT = {
  ascend: 'asc',
  descend: 'desc',
  asc: 'ascend',
  desc: 'descend'
}

export const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>'

export const USER_LIST = [
  {userName: 'cecadmin', userPwd: 'admin123', role: 'admin'},
  {userName: 'cecop', userPwd: 'admin123', role: 'operator'},
  {userName: 'cecgp', userPwd: 'admin123', role: 'operator'}
]

export const COMPONENT_CONFIG = {
  NODE_KEY: 'id',
  COMMON_EDGE: 'commonEdge',
  COMPONENT_PREFIX: 'component_'
}

export const COMPONENT_TYPE = {
  INPUT_COMP: 1,
  OUTPUT_COMP: 2,
  ASYN_MESSAGE: 3,
  PARAM_MAP: 4,
  DESENSIT_COMP: 5,
  ERROR_COMP: 6,
  VERIFY_COMP: 7,
  SUBSCRIBE_COMP: 8
}

export const DICT_FILTER_TYPE = {
  INTF_PAGE_IN: 1,
  INTF_PAGE_OUT: 2,
  NET_PAGE_OUT: 3,
  ASYN_MESSAGE: 4,
  PARAM_MAP: 5,
  ERROR_WIDGET: 6,
  SUBSCRIBE_WIDGET: 7
}

export const INTF_VALUES_TYPE = [
  {
    dictNum: 1,
    dictName: '默认值'
  },
  {
    dictNum: 2,
    dictName: '数据集'
  },
  {
    dictNum: 3,
    dictName: '入参值'
  },
  {
    dictNum: 4,
    dictName: '出参值'
  },
  {
    dictNum: 5,
    dictName: '响应标志'
  },
  {
    dictNum: 6,
    dictName: '响应结果'
  },
  {
    dictNum: 7,
    dictName: '分组字段'
  }
]

export const PARAMETER_USAGE = {
  DEFAULT_VALUE_TYPE: 1,
  DATASET_TYPE: 2,
  ENTERING_PARAMETER_TYPE: 3,
  OUTER_PARAMETER_TYPE: 4,
  RESPONSE_LOG_TYPE: 5,
  RESPONSE_CONTENT_TYPE: 6,
  GROUP_field_TYPE: 7
}

export const DEFAULT_FIELD = {
  fieldId: -1,
  fieldName: '',
  fieldNameZh: '',
  defaultValue: '',
  fieldType: 6,
  defaultValueType: 1,
  sort: void 0,
  decimals: void 0,
  fieldLength: void 0,
  partitionType: void 0,
  primaryFlag: void 0,
  nullFlag: true,
  partitionField: false,
  dictCodeColumn: false,
  dictNameColumn: false
}

/**
 * 长度规则限制
 */
export const LENGTH_REGEX = {
  LENGTH_30: /^.{1,30}$/,
  LENGTH_50: /^.{1,50}$/,
  LENGTH_500: /^.{1,500}$/
}

/**
 * 后端服务接口前缀
 */
export const SERVER_CONFIG = {
  ETL: 'etl_server',
  MODEL: 'data_modeling',
  INTF: 'data_interface'
}

/**
 * 配置日志分类
 */
export const CONFIG_CATEGORY = {
  ENTERPRISE: 1,
  INTERFACE: 2,
  SERVICE: 3
}

export const DATE_FORMAT = {
  YYYY: 'YYYY',
  YYYYMM: 'YYYY-MM',
  YYYYMMDD: 'YYYY-MM-DD',
  YYYYMMDD2: 'YYYY/MM/DD',
  YYYYMMDDHH: 'YYYY-MM-DD HH',
  YYYYMMDDHHMM: 'YYYY-MM-DD HH:mm',
  YYYYMMDDHHMMSS: 'YYYY-MM-DD HH:mm:ss'
}

export const LOG_TAB_TYPE = {
  NOT_EXEC_TYPE: '1',
  EXEC_TYPE: '2'
}

export const PARAMS_CONFIG_CLASS = {
  INTF_ENTER: 1,
  INTF_OUTER: 2,
  NET_OUTER: 3,
  ASYN_MESSAGE: 4,
  ENTER_MESSAGE: 5,
  OUTER_MESSAGE: 6
}

export const INIT_FILTER = {
  current: 1,
  limit: PAGE_SIZE
}

export const INIT_PAGINATION = {
  total: 0,
  simple: true,
  pageSize: PAGE_SIZE,
  showQuickJumper: true,
  showTotal: (total) => `总共 ${thousandComma(total)} 条数据`
}

export const COMMON_STATUS = [
  {value: true, text: '正常', color: '#1890FF'},
  {value: false, text: '停用', color: '#F5222D'}
]

export const SYSTEM_SETTING_STATUS = [
  {value: 1, text: '正常', color: '#1890FF'},
  {value: -1, text: '禁用', color: '#F5222D'}
]

export const CALL_RESULT_STATUS = [
  {value: 1, text: '正常', color: '#1890FF'},
  {value: 2, text: '异常', color: '#FADB14'},
  {value: 3, text: '超时', color: '#F5222D'},
  {value: 4, text: '无数据', color: '#BFBFBF'}
]
export const ENTERPRISE_STATUS = [
  {value: 2, text: '无效', color: '#BFBFBF'},
  {value: 1, text: '有效', color: '#1890FF'}
]
export const EMPI_EXACTRULE_STATUS = [
  {value: 0, text: '有效', color: '#1890FF'},
  {value: 1, text: '无效', color: '#BFBFBF'}
]
export const VALID_STATUS = [
  {value: 2, text: '无效', color: '#BFBFBF'},
  {value: 1, text: '有效', color: '#1890FF'}
]

export const ENTERPRISE_ENCRYPT = [
  {value: 0, text: '否'},
  {value: 1, text: '是'}
]

export const EMPI_RUN_STATUS = [
  {value: 0, text: '成功'},
  {value: 1, text: '失败'},
  {value: 2, text: '正在执行'}
]

export const ENTERPRISE_CLIENT_TYPR = [
  {value: 1, text: '保险行业'},
  {value: 2, text: '保险经纪公司'},
  {value: 3, text: '基因研究'},
  {value: 4, text: '医疗物资'},
  {value: 5, text: '药物研究'},
  {value: 6, text: '疾病研究'},
  {value: 7, text: '数据分析'},
  {value: 8, text: '数据展示'},
  {value: 9, text: '医院信息化'}
]

export const FUNCTION_TYPE = [
  {value: '电子病历解密函数', text: '电子病历解密函数'},
  {value: 'Spark UDF函数', text: 'Spark UDF函数'}
]

export const DATA_ELEMENT_TYPE = {
  ELEMENT_TYPE: '1',
  SAMPLE_BOOK_TYPE: '2'
}

export const CLASSIFY_TYPE = {
  TABLE_TYPE: '1',
  DATABASE_TYPE: '2'
}

export const FIELD_TAB_TYPE = {
  STRUCTURE_TYPE: '1',
  BROWSER_TYPE: '2',
  OPERATOR_TYPE: '3'
}

export const LIST_OPERATE = {
  EDIT: 'EDIT',
  RECORDS: 'RECORDS',
  TEST: 'TEST',
  LOGS: 'LOGS',
  DELETE: 'DELETE'
}

export const CONTENT_TYPE = {
  INTF_CONTENT: 'INTF_CONTENT',
  SERVICE_CONTENT: 'SERVICE_CONTENT'
}

export const INTF_CONTENT = {
  LIST_PAGE: 'LIST',
  INTF_PAGE: 'INTF'
}

export const SERVICE_CONTENT = {
  LIST_PAGE: 'LIST',
  SERVICE_PAGE: 'SERVICE'
}

export const INTF_TAB_TYPE = {
  INTF_INFO_TYPE: 'INFO',
  INTF_ENTERING_TYPE: 'ENTER',
  INTF_OUTTING_TYPE: 'OUTER',
  INTF_TEST_TYPE: 'TEST',
  INTF_CONFIGLOGS_TYPE: 'LOGS',
  INTF_USERECORDS_TYPE: 'RECORDS'
}

export const SERVICE_TAB_TYPE = {
  SERVICE_INFO_TYPE: 'INFO',
  SERVICE_TEST_TYPE: 'TEST',
  SERVICE_CONFIGLOGS_TYPE: 'LOGS',
  SERVICE_USERECORDS_TYPE: 'RECORDS'
}

export const ASYN_MESSAGE_TAB_TYPE = {
  ENTERING_TYPE: 'ENTERING',
  ENTERING_STRUCTURE_TYPE: 'ENTERING_STRUCTURE',
  OUTERING_TYPE: 'OUTERING',
  OUTERING_STRUCTURE_TYPE: 'OUTERING_STRUCTURE'
}

export const PARAM_STRUCTURE_TAB_TYPE = {
  PARAM_TYPE: 'PARAM',
  STRUCTURE_TYPE: 'STRUCTURE'
}

export const PARAM_MAP_TAB_TYPE = {
  ENTERING_TYPE: 'ENTERING',
  OUTERING_TYPE: 'OUTERING',
  STRUCTURE_TYPE: 'STRUCTURE'
}

export const DISPATCH_TYPE = {
  ALL_ETL_TYPE: {
    dictName: '全部ETL',
    dictNum: 1
  },
  HOSPITAL_TYPE: {
    dictName: '按医院',
    dictNum: 2
  },
  ETL_CLASS_TYPE: {
    dictName: '按ETL分类',
    dictNum: 3
  },
  CHOOSE_ETL_TYPE: {
    dictName: '指定ETL',
    dictNum: 4
  }
}

export const DISPATCH_MODE = {
  MANUAL_MODE: {
    dictName: '手动',
    dictNum: 1
  },
  TIMING_MODE: {
    dictName: '定时',
    dictNum: 2
  },
  MESSAGE_IMMEDIATELY_MODE: {
    dictName: '消息触发立即执行',
    dictNum: 3
  },
  MESSAGE_TIMING_MODE: {
    dictName: '消息触发定时执行',
    dictNum: 4
  }
}

export const MESSAGE_FORMAT = [
  {
    dictNum: 1,
    dictName: 'json',
    contentType: 'application/json'
  },
  {
    dictNum: 2,
    dictName: 'xml',
    contentType: 'application/xml'
  }
]

export const CLASS_TYPE = {
  ETL: 'etl',
  SCHEDULE: 'schedule',
  DATABASE: 'database',
  TABLE: 'table'
}

export const CATEGORY_FIELD_TYPE = {
  DATABASE_TYPE: {
    id: 'categoryId',
    name: 'categoryName',
    code: 'categoryCode'
  },
  TABLE_TYPE: {
    id: 'tableCategoryId',
    name: 'tableCategoryName',
    code: 'tableCategoryCode'
  }
}

/**
 * 常见正则表达式
 **/
export const phoneReg = /1\d{10}$/

export const modalFromLayout = {
  item: {
    labelCol: {span: 5},
    wrapperCol: {span: 19}
  },
  select: {
    labelCol: {span: 4},
    wrapperCol: {span: 6}
  },
  modal: {
    labelCol: {span: 7},
    wrapperCol: {span: 17}
  },
  half: {
    labelCol: {span: 8},
    wrapperCol: {span: 12}
  }
}

export const ETL_STATUS_DATA = [
  {
    value: 1,
    color: '#F5222D',
    text: '待审核'
  },
  {
    value: 2,
    color: '#1890FF',
    text: '已发布'
  },
  {
    value: 3,
    color: '#FADB14',
    text: '草稿'
  },
  {
    value: 4,
    color: '#BFBFBF',
    text: '已失效'
  }
]

export const SYSTEMLOG_CONFIGCATEGORY = [
  {value: 1, text: '企业配置管理'},
  {value: 2, text: '接口配置管理'},
  {value: 3, text: '服务配置管理'}
]
// empi
// 患者记录查询
export const EMPI_INDEXQUERY_STATUS = [
  {value: 0, text: '未进行匹配', color: '#BFBFBF'}, // 灰色
  {value: 1, text: '处理中', color: '#FADB14'}, // 黄色
  {value: 2, text: '精确匹配成功', color: '#1890FF'}, // 蓝色
  {value: 3, text: '生成新索引', color: '#52C41A'}, // 绿色
  {value: 4, text: '生成疑似', color: '#F5222D'} // 红色
]
// 患者主索引 患者记录查询 注册类型
export const EMPI_INDEXQUERYR_REGISTTYPE = [
  {value: '0', text: '门诊病人'},
  {value: '1', text: '住院病人'},
  {value: '2', text: '体验病人'}
]

// 患者主索引 操作类型
export const EMPI_INDEXMANAGER_OPERATIONTYPE = [
  {value: '系统新建索引', text: '系统新建索引'},
  {value: '系统关联索引', text: '系统关联索引'},
  {value: '人工新建索引', text: '人工新建索引'},
  {value: '人工关联索引', text: '人工关联索引'},
  {value: '系统模糊匹配', text: '系统模糊匹配'},
  {value: '删除关联', text: '删除关联'},
  {value: '关键信息', text: '关键信息'}
]

// 系统操作日志 规则修改日志 操作类型
export const EMPI_SYSLOG_RULEUPDATE_OPRATORTYPE = {
  insert: '新增',
  delete: '删除',
  update: '修改'
}

export const SYSTEMLOG_OPERATIONTYPE = [
  {value: 1, text: '新增'},
  {value: 2, text: '无效'},
  {value: 3, text: '删除'}
]

export const SYSTEMLOG_CONFIGURELOG_OPERATIONTYPE = [
  {value: 1, text: '新增', color: '#52C41A'},
  {value: 2, text: '修改', color: '#1890FF '},
  {value: 3, text: '删除', color: '#F5222D'}
]

export const DISPATCH_EXECUTE_STATUS = [
  {
    value: 1,
    color: '#FADB14',
    text: '等待执行'
  },
  {
    value: 4,
    color: '#F5222D',
    text: '执行失败'
  },
  {
    value: 5,
    color: '#BFBFBF',
    text: '已撤销'
  },
  {
    value: 2,
    color: '#52C41A',
    text: '正在执行'
  },
  {
    value: 3,
    color: '#1890FF',
    text: '执行完成'
  }
]

export const ETL_EXECUTE_STATUS = [
  {
    value: 1,
    color: '#FADB14',
    text: '等待执行'
  },
  {
    value: 4,
    color: '#F5222D',
    text: '执行失败'
  },
  {
    value: 6,
    color: '#BFBFBF',
    text: '已撤销'
  },
  {
    value: 2,
    color: '#52C41A',
    text: '正在执行'
  },
  {
    value: 3,
    color: '#1890FF',
    text: '执行完成'
  },
  {
    value: 5,
    color: '#BFBFBF',
    text: '未执行'
  },
  {
    value: 7,
    color: '#BFBFBF',
    text: '已终止'
  }
]

export const STEP_EXECUTE_STATUS = [
  {
    value: 2,
    color: '#F5222D',
    text: '执行失败'
  },
  {
    value: 1,
    color: '#1890FF',
    text: '执行成功'
  },
  {
    value: 3,
    color: '#BFBFBF',
    text: '未执行'
  },
  {
    value: 4,
    color: '#52C41A',
    text: '正在执行'
  }
]

export const SUITE_CONTENT = {
  SUITE_LIST: 1,
  ADD_SUITE: 2,
  EDIT_SUITE: 3
}

export const DICT_SET = {
  DIST_TYPE: {
    dictCode: 'DICT001',
    dictName: '字典类型'
  },
  DICT_STATUS: {
    dictCode: 'DICT002',
    dictName: '字典状态'
  },
  CLASS_TYPE: {
    dictCode: 'ETL010',
    dictName: '分类类别标识'
  },
  ETL_STATUS: {
    dictCode: 'ETL011',
    dictName: 'ETL配置状态'
  },
  ETL_EXE_RATE: {
    dictCode: 'ETL013',
    dictName: '执行频率'
  },
  ETL_STEP_TYPE: {
    dictCode: 'ETL014',
    dictName: '步骤类型'
  },
  DISPATCH_STATUS: {
    dictCode: 'ETL015',
    dictName: '调度状态'
  },
  RTL_EXE_STATUS: {
    dictCode: 'ETL016',
    dictName: 'ETL执行状态'
  },
  DISPATCH_MODE: {
    dictCode: 'ETL019',
    dictName: '调度模式'
  },
  DISPATCH_TYPE: {
    dictCode: 'ETL020',
    dictName: '调度类型'
  },
  STEP_STATUS: {
    dictCode: 'ETL021',
    dictName: '步骤执行状态'
  },
  MODELING_FIELD: {
    dictCode: 'MODEL010',
    dictName: '字段类型'
  },
  MODELING_DEFAULT: {
    dictCode: 'MODEL011',
    dictName: '默认值类型'
  },
  MODELING_PARTITION: {
    dictCode: 'MODEL012',
    dictName: '分区类型'
  },
  MODELING_PARTITION_INTERVAL: {
    dictCode: 'MODEL018',
    dictName: 'RANGE分区间隔'
  },
  MODELING_OPERATE: {
    dictCode: 'MODEL013',
    dictName: '操作符类型'
  },
  MODELING_CALCULATE: {
    dictCode: 'MODEL014',
    dictName: '运算符类型'
  },
  MODELING_DATABASE: {
    dictCode: 'MODEL015',
    dictName: '数据库类型'
  },
  MODELING_TABLE: {
    dictCode: 'MODEL017',
    dictName: '表类型'
  },
  INTF_TYPE: {
    dictCode: 'DIM001',
    dictName: '接口类型'
  },
  INTF_PROTOCOL: {
    dictCode: 'DIM002',
    dictName: '通信协议'
  },
  INTF_MESSAGE: {
    dictCode: 'DIM003',
    dictName: '消息格式'
  },
  INTF_STATUS: {
    dictCode: 'DIM004',
    dictName: '接口有效状态'
  },
  INTF_CONSUMER_TYPE: {
    dictCode: 'DIM005',
    dictName: '客户类型'
  },
  INTF_ORG_STATUS: {
    dictCode: 'DIM006',
    dictName: '生态企业状态'
  },
  SERVICE_CALL_TYPE: {
    dictCode: 'DIM007',
    dictName: '服务调用方式'
  },
  INTF_RESULT_FLAG: {
    dictCode: 'DIM009',
    dictName: '结果标志'
  },
  INTF_CONFIG_CLASS: {
    dictCode: 'DIM010',
    dictName: '配置分类'
  },
  INTF_DB_TYPE: {
    dictCode: 'DIM011',
    dictName: '数据库类型'
  },
  INTF_PROPERTY: {
    dictCode: 'DIM012',
    dictName: '接口属性'
  },
  INTF_COMP_TYPE: {
    dictCode: 'DIM013',
    dictName: '组件类型'
  },
  INTF_VALUE_TYPE: {
    dictCode: 'DIM014',
    dictName: '值类型'
  },
  INTF_OPT_TYPE: {
    dictCode: 'DIM017',
    dictName: '操作类型'
  },
  INTF_SERVER_STATUS: {
    dictCode: 'DIM018',
    dictName: '服务状态'
  },
  INTF_COMP_CLASS: {
    dictCode: 'DIM019',
    dictName: '组件分类'
  },
  INTF_CALL_TYPE: {
    dictCode: 'DIM021',
    dictName: '接口调用方式'
  },
  INTF_DESENSIT_TYPE: {
    dictCode: 'DIM022',
    dictName: '脱敏方式'
  },
  VALIDATE_TYPE: {
    dictCode: 'DIM024',
    dictName: '校验方式'
  },
  OPT_SYMBOL_TYPE: {
    dictCode: 'DIM025',
    dictName: '运算符'
  },
  MESSAGE_HANDLE_TYPE: {
    dictCode: 'DIM026',
    dictName: '消息处理方式'
  },
  STEP_TYPE: {
    dictCode: 'ETL014',
    dictName: '步骤类型'
  },
  STEP_SON_TYPE: {
    dictCode: 'ETL023',
    dictName: '步骤子类型'
  },
  PUSH_CYCLE_TYPE: {
    dictCode: 'DIM027',
    dictName: '推送周期'
  },
  HBASE_OPERATION_TYPE: {
    dictCode: 'DIM028',
    dictName: '步骤类型'
  },
  HBASE_RELATION_TYPE: {
    dictCode: 'DIM029',
    dictName: '步骤子类型'
  }
}

export const EVENT_TYPE = {
  ETL_TREE_CHANGED: 'ETL_TREE_CHANGED', // etl管理页左侧树有改变
  ETL_LIST_CHANGED: 'ETL_LIST_CHANGED', // etl列表有改变
  ETL_LOG_TREE_SELECTED: 'ETL_LOG_TREE_SELECTED', // etl日志左侧树选中
  ETL_LOG_TIME_CHANGED: 'ETL_LOG_TIME_CHANGED', // etl日志页时间控制树
  ETL_LOG_EXEC_TREE_CHANGED: 'ETL_LOG_EXEC_TREE_CHANGED', // etl日志已经执行树变更
  ETL_LOG_UNEXEC_TREE_CHANGED: 'ETL_LOG_UNEXEC_TREE_CHANGED', // etl日志待执行树变更
  ETL_TREE_CLASS_SELECTED: 'ETL_TREE_CLASS_SELECTED', // etl管理页左侧树选中
  DISPATCH_TREE_CHANGED: 'DISPATCH_TREE_CHANGED', // 调度管理页左侧树有改变
  DISPATCH_TABLE_CHANGED: 'DISPATCH_TABLE_CHANGED', // 调度管理页右侧表格有改变
  MODELING_TABLE_CHANGED: 'MODELING_TABLE_CHANGED', // 数据建模管理页右侧数据表表格有改变
  MODELING_TABLEPAGE_CHANGED: 'MODELING_TABLEPAGE_CHANGED', // 数据建模管理页右侧数据表表格页码有改变
  MODELING_STRUCTURE_CHANGED: 'MODELING_STRUCTURE_CHANGED', // 数据建模结构页刷新
  MODELING_CONTENT_CHANGED: 'MODELING_CONTENT_CHANGED', // 数据建模列表显示
  MODELING_RESET_NEWTABLE: 'MODELING_RESET_NEWTABLE', // 数据建模列表显示
  MODELING_TREE_CHANGED: 'MODELING_TREE_CHANGED', // 数据建模管理页左侧树有改变
  IS_TREE_CHANGED: 'IS_TREE_CHANGED', // 接口服务管理页左侧树有改变
  IS_TABLE_CHANGED: 'IS_TABLE_CHANGED', // 接口管理页右侧表格有改变
  IS_CONTENT_TAB_CHANGED: 'IS_CONTENT_TAB_CHANGED', // 接口服务tab页变化
  ENTERPRISE_TABLE_CHANGED: 'ENTERPRISE_TABLE_CHANGED', // 企业右侧表格有改变
  ENTERPRISE_TREE_CHANGED: 'ENTERPRISE_TREE_CHANGED', // 企业右侧表格有改变
  SET_DATA_ELEMENTID: 'SET_DATA_ELEMENTID', // 设置设置数据元ID
  GET_BROWSER_DATA: 'GET_BROWSER_DATA', // 获得数据建模字段浏览页数据
  GET_OPERATOR_DATA: 'GET_OPERATOR_DATA', // 获得数据建模字段操作页数据
  GET_STRUCTURE_DATA: 'GET_STRUCTURE_DATA', // 获得数据建模字段结构页数据
  SET_STRUCTURE_SHOW: 'SET_STRUCTURE_SHOW', // 显示结构页
  SET_CONTENT_NODE: 'SET_CONTENT_NODE', // 更新选中节点
  SET_CONTENT_TYPE: 'SET_CONTENT_TYPE', // 设置数据建模内容信息
  RELEVANCE_RECORD_CHANGE: 'RELEVANCE_RECORD_CHANGE', // 患者记录更新
  SAVE_COMPONENT_INFO: 'SAVE_COMPONENT_INFO', // 保存组件消息
  REACT_GRAPH_REFRASH: 'REACT_GRAPH_REFRASH' // 刷新有向图
}

export const MODELING_INIT_DICTCODE = ['MODEL010', 'MODEL011', 'MODEL012', 'MODEL018'] // 字段类型、分区类型、默认值

export const TRANSFORM_FIELDS = ['nullFlag', 'partitionField', 'dictCodeColumn', 'dictNameColumn', 'indexFlag', 'storeFlag'] // 忽略校验值

// 需要全局loading的URL
export const NEED_LOADING_URL = {
  ADD_TABLE: `data_modeling/${API_VER_1}/web/table`,
  UPDATE_FIELD: `data_modeling/${API_VER_1}/web/table/field`,
  GET_FIELD_DATA: `data_modeling/${API_VER_1}/web/table/content/page`
}

export const SKIP_MESSAGE = [
  `${API_VER_1}/web/table/content/page`,
  `${API_VER_1}/cecdata/interface`,
  `${API_VER_1}/web/service/test`,
  `${API_VER_1}/getFieldByDBTableList`,
  '/index_records/indexSplit',
  '/similar_patient/initIndex',
  '/similar_patient/reIndex',
  '/similar_patient/againMatches'
]

export const PERMS_IDENTS = {
  ETL_ADD: 'DM:CONF:ADD', // 新建ETL
  ETL_EXECUTE: 'DM:CONF:EXECUTE', // 立即执行
  ETL_EXECUTETIMING: 'DM:CONF:EXECUTETIMING', // 定时执行
  ETL_DEL: 'DM:CONF:DEL', // 删除ETL
  ETL_BATCHDEL: 'DM:CONF:BATCHDEL', // 批量删除ETL
  ETL_UPDATE: 'DM:CONF:UPDATE', // ETL编辑
  ETL_COPY: 'DM:CONF:COPY', // ETL复制
  SCHEDULE_ADD: 'DM:SCHEDULE:ADD', // 新增规则
  SCHEDULE_UPDATE: 'DM:SCHEDULE:UPDATE', // 编辑规则
  SCHEDULE_UPDATESTATUS: 'DM:SCHEDULE:UPDATESTATUS', // 修改状态
  SCHEDULE_DEL: 'DM:SCHEDULE:DEL', // 规则删除
  SCHEDULE_BATCHDEL: 'DM:SCHEDULE:BATCHDEL', // 规则批量删除
  LOG_QUERY: 'DM:LOG:QUERY', // 查看日志
  LOG_SCHEDULEQUERY: 'DM:LOG:SCHEDULEQUERY', // 查看调度任务
  ETLCLASS_ADD: 'DM:ETLCLASS:ADD', // 新增分类
  ETLCLASS_UPDATE: 'DM:ETLCLASS:UPDATE', // 编辑分类
  ETLCLASS_DEL: 'DM:ETLCLASS:DEL', // 删除分类
  ETLCLASS_UPDATESTATUS: 'DM:ETLCLASS:UPDATESTATUS', // 修改状态
  SCHEDULECLASS_ADD: 'DM:SCHEDULECLASS:ADD', // 新增规则分类
  SCHEDULECLASS_UPDATE: 'DM:SCHEDULECLASS:UPDATE', // 编辑规则分类
  SCHEDULECLASS_DEL: 'DM:SCHEDULECLASS:DEL', // 规则分类删除
  SCHEDULECLASS_UPDATESTATUS: 'DM:SCHEDULECLASS:UPDATESTATUS', // 修改规则分类状态
  MODEL_ADDTABLE: 'DM:MODEL:ADDTABLE', // 新建表
  MODEL_SETCATEGORY: 'DM:MODEL:SETCATEGORY', // 设置分类
  MODEL_DELTABLE: 'DM:MODEL:DELTABLE', // 删除表
  MODEL_BATCHDEL: 'DM:MODEL:BATCHDEL', // 新建表
  MODEL_QUERYTABLESTRUCTURE: 'DM:MODEL:QUERYTABLESTRUCTURE', // 查看结构
  MODEL_QUERYDATA: 'DM:MODEL:QUERYDATA', // 浏览数据
  MODEL_UPDATETABLE: 'DM:MODEL:UPDATETABLE', // 修改表
  MODEL_UPDATEFIELD: 'DM:MODEL:UPDATEFIELD', // 修改字段
  MODEL_DELFIELD: 'DM:MODEL:DELFIELD', // 删除字段
  MODEL_ADDFIELD: 'DM:MODEL:ADDFIELD', // 新增字段
  DATABASE_ADD: 'DM:DATABASE:ADD', // 新建数据库
  DATABASE_UPDATE: 'DM:DATABASE:UPDATE', // 编辑数据库
  DATABASE_QUERY: 'DM:DATABASE:QUERY', // 查询数据库
  DATABASE_UPDATESTATUS: 'DM:DATABASE:UPDATESTATUS', // 修改状态
  DATABASECATEGORY_ADD: 'DM:DATABASECATEGORY:ADD', // 新增数据库分类
  DATABASECATEGORY_UPDATE: 'DM:DATABASECATEGORY:UPDATE', // 修改数据库分类
  DATABASECATEGORY_DEL: 'DM:DATABASECATEGORY:DEL', // 删除数据库分类
  DATABASECATEGORY_UPDATESTATUS: 'DM:DATABASECATEGORY:UPDATESTATUS', // 修改数据库分类状态
  TABLECATEGORY_ADD: 'DM:TABLECATEGORY:ADD', // 新增数据表分类
  TABLECATEGORY_UPDATE: 'DM:TABLECATEGORY:UPDATE', // 修改数据表分类
  TABLECATEGORY_DEL: 'DM:TABLECATEGORY:DEL', // 删除数据表分类
  TABLECATEGORY_UPDATESTATUS: 'DM:TABLECATEGORY:UPDATESTATUS' // 修改数据表分类状态
}

export const CURRENT_MODE = {
  VIEW: 'view',
  EDIT: 'edit',
  NEW: 'new'
}

export default {
  ANT_SORT,
  PAGE_SIZE,
  INIT_FILTER,
  INIT_PAGINATION,
  ADD_OPREATE: 'add',
  EDIT_OPREATE: 'edit',
  VIEW_OPREATE: 'view',
  DB_INTF_TYPE: 1,
  DATE_FORMAT,
  API_VER_1,
  EMPI_RUN_STATUS,
  CHINESE_REGEX: /[\u4e00-\u9fa5]/,
  NAME_REGEX: /^.{4,30}$/,
  COMMON_REGEX: /^.{1,20}$/,
  PRIORITY_REGEX: /^.{1,10}$/,
  SPELLCODE_REGEX: /^[A-Za-z0-9]{1,20}$/,
  DB_TB_REGEX: /^[a-z][a-z0-9_]*$/,
  DB_TB_LENGTH_REGEX: /^.{1,50}$/,
  FORM_ITEM_LAYOUT: modalFromLayout,
  COMMON_STATUS,
  SYSTEM_SETTING_STATUS,
  VALID_STATUS,
  CALL_RESULT_STATUS,
  CLASS_TYPE,
  COMPONENT_TYPE,
  FUNCTION_TYPE,
  DICT_SET,
  DEFAULT_FIELD,
  XML_OPTION,
  NEED_LOADING_URL,
  EVENT_TYPE,
  SUITE_CONTENT,
  INTF_CONTENT,
  SERVICE_CONTENT,
  DISPATCH_TYPE,
  DISPATCH_MODE,
  CLASSIFY_TYPE,
  FIELD_TAB_TYPE,
  TRANSFORM_FIELDS,
  DATA_ELEMENT_TYPE,
  CATEGORY_FIELD_TYPE,
  PERMS_IDENTS,
  INTF_TAB_TYPE,
  SERVICE_TAB_TYPE,
  MESSAGE_FORMAT,
  MODELING_INIT_DICTCODE,
  CURRENT_MODE
}
