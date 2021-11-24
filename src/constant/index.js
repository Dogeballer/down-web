import { thousandComma } from '@cecdataFE/bui'

export const PAGE_SIZE = 20

export const API_VER = 'v1'

export const phoneReg = /1\d{10}$/

export const modalFromLayout = {
  item: {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  },
  modal: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  },
  half: {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 }
  }
}

export const USER_LIST = [
  { userName: 'cecadmin', userPwd: 'admin123', role: 'admin' },
  { userName: 'cecop', userPwd: 'admin123', role: 'operator' },
  { userName: 'cecgp', userPwd: 'admin123', role: 'operator' }
]

export const DATE_FORMAT = {
  YYYYMM: 'YYYY-MM',
  YYYYMMDD: 'YYYY-MM-DD',
  YYYYMMDD2: 'YYYY/MM/DD',
  YYYYMMDDHH: 'YYYY-MM-DD HH',
  YYYYMMDDHHMM: 'YYYY-MM-DD HH:mm',
  YYYYMMDDHHMMSS: 'YYYY-MM-DD HH:mm:ss',
  HHMMSS: 'HH:mm:ss'
}

export const COMMON_STATUS = [
  { value: 1, text: '正常', color: '#1890FF' },
  { value: 0, text: '禁用', color: '#F5222D' }
]

export const INIT_FILTER = {
  page: 1,
  limit: PAGE_SIZE
}

export const INIT_PAGE = {
  total: 0,
  // size: 'small',
  // showQuickJumper: true,
  showSizeChanger: true,
  defaultPageSize: PAGE_SIZE,
  pageSizeOptions: ['20', '50', '100', '200'],
  showTotal: (total) => `总共 ${thousandComma(total)} 条数据`
}

export const DICT_SET = {
  DATA_STORAGE_CODE: [
    { value: 'HIVE', text: 'HIVE' },
    { value: 'KUDU', text: 'KUDU' },
    { value: 'HBASE', text: 'HBASE' },
    { value: 'ES', text: 'ES' }
  ],
  DATA_LEVEL: [
    { value: 1, text: '1级' },
    { value: 2, text: '2级' },
    { value: 3, text: '3级' },
    { value: 4, text: '4级' },
    { value: 5, text: '5级' },
    { value: 6, text: '6级' }
  ],
  DATA_ODS_STATUS: [
    { value: 1, text: '是' },
    { value: 0, text: '否' }
  ],
  // 数据风险 类型， 用于控制台
  RISK_TYPES: [
    {value: 'ldfx',text: '漏洞风险'},
    {value: 'wgfx',text: '违规风险'},
    {value: 'sjxl',text: '数据泄漏'},
    {value: 'kjcs',text: '跨境传输'},
    {value: 'gpfw',text: '高频访问'},
    {value: 'sjgdhq',text: '数据过度获取'},
    {value: 'sjph',text: '数据破坏'},
    {value: 'sjwtm',text: '数据未脱敏'},
    {value: 'sjdl',text: '数据抵赖'},
  ],
  // 日志类型: 1-正常访问日志，101-越权访问风险日志,102-数据库漏洞风险日志,103-应用漏洞风险日志,104-数据泄漏风险日志,105-数据违规风险日志,106-跨境传输风险日志,107-高频
  LOG_TYPES: [
    {value: 101,text: '越权访问风险'},
    {value: 102,text: '数据库漏洞风险'},
    {value: 103,text: '应用漏洞风险'},
    {value: 104,text: '数据泄漏风险'},
    {value: 105,text: '数据违规风险'},
    {value: 106,text: '跨境传输风险'},
    {value: 107,text: '高频访问风险'},
  ]
}

export default {
  phoneReg,
  USER_LIST,
  PAGE_SIZE: 20,
  API_VER: 'v1.0'
}
