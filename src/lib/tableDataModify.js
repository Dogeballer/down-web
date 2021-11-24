import { getUserData } from './storage'

function tableDataModify (
  tableData,
  rowKey,
  oldRecord,
  newRecord,
  defaultKeys = []
) {
  const username = getUserData()?.userName
  const newTableData = [...tableData]
  const oldRecords = Array.isArray(oldRecord) ? oldRecord : [oldRecord]
  const [timeKey = 'operationTime', userKey = 'operationUser'] = defaultKeys
  oldRecords.forEach(or => {
    const idx = newTableData.findIndex(r => r[rowKey] === or[rowKey])
    if (~idx) {
      newTableData[idx] = {
        ...or,
        [timeKey]: Date.now(),
        [userKey]: username,
        ...newRecord
      }
    }
  })

  return newTableData
}

export default tableDataModify
