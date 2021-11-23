import React, { useMemo, useReducer } from 'react'
import { Resizer } from '@cecdataFE/bui'
import AsideTree from './components/AsideTree'
import ClassifyContext from './context'
import DatabaseTable from './components/DatabaseTable'

const initState = {
  selected: null
}
const reducer = (state, action) => {
  const [type, payload] = action
  switch (type) {
    case 'setSelected': {
      const { dataAssetIp, dbServerName, tableName, tableNameNotes } = payload
      let key = ''
      if (tableName) {
        key = `${dataAssetIp}_${dbServerName}_${tableName}`
      } else if (dbServerName) {
        key = `${dataAssetIp}_${dbServerName}`
      } else if (dataAssetIp) {
        key = dataAssetIp
      }
      state.selected = {
        dataAssetIp,
        dbServerName,
        tableName,
        tableNameNotes,
        key
      }
      return { ...state }
    }
  }
}

const ClassifyGradeMark = (props) => {
  const [state, dispatch] = useReducer(reducer, { ...initState })
  const { editable = true } = props
  return (
    <ClassifyContext.Provider value={{ state, dispatch: (type, action) => dispatch([type, action]) }}>
      <Resizer left={<AsideTree editable={editable} />} right={<DatabaseTable editable={editable} />} />
    </ClassifyContext.Provider>
  )
}

export default ClassifyGradeMark
