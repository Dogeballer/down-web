import { thousandComma } from '@cecdataFE/bui'

export const PAGE_SIZE = 20

export const API_VER = 'v1.0'

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
  current: 1,
  limit: PAGE_SIZE
}

export const INIT_PAGE = {
  total: 0,
  size: 'small',
  showQuickJumper: true,
  showSizeChanger: true,
  defaultPageSize: PAGE_SIZE,
  pageSizeOptions: ['20', '30', '50', '100'],
  showTotal: (total) => `总共 ${thousandComma(total)} 条数据`
}

export default {
  phoneReg,
  USER_LIST,
  PAGE_SIZE: 20,
  API_VER: 'v1.0'
}
