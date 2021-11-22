function tableDataModify (tableData, rowKey, oldRecord, newRecord) {
  const newTableData = [...tableData]
  const oldRecords = Array.isArray(oldRecord) ? oldRecord : [oldRecord]

  oldRecords.forEach(or => {
    const idx = newTableData.findIndex(r => r[rowKey] === or[rowKey])
    if (~idx) {
      newTableData[idx] = { ...or, ...newRecord }
    }
  })

  return newTableData
}

export default tableDataModify
