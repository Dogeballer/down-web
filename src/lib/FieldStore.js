/**
 * @author 陆海鹍
 * @date 2020-04-13 09:41:55
 * @description 描述 单例增量保存表字段列表
 * @email luhaikun@cecdat.com
 * @copyright Copyright 2018 CEC(Fujian) Healthcare Big Data Operation Service Co., Ltd. All rights reserved.
 */

class FieldStore {
  constructor () {
    this.tableMap = {}
  }

  getTableField = (tableId) => {
    return this.tableMap[tableId]
  }

  setTableField = (tableId, fieldInfo) => {
    if (this.tableMap[tableId]) return
    this.tableMap[tableId] = fieldInfo
  }
}

export default (function () {
  let instance = null
  return function () {
    if (!instance) instance = new FieldStore()
    return instance
  }
})()
