import React, { useState } from 'react'

import Resizer from '../../../../components/resizer'
import { LOG_TAB_TYPE } from '../../../../constant'
import LogSource from '../LogSource'
import ExecuteLog from '../ExecuteLog'

const LogContent = (props) => {
  const [isLeaf, setIsLeaf] = useState(false)
  const [logDate, setLogDate] = useState(Date.now())
  const [dispatchInfo, setDispatchInfo] = useState({})
  const [searchParams, setSearchParams] = useState({ execute_date: Date.now() })
  const onTreeNodeSelect = (isLeaf, data, params) => {
    const dateParam = { execute_date: logDate }
    setIsLeaf(isLeaf)
    setDispatchInfo(data)
    console.log(params)
    setSearchParams({ ...params })
  }
  const onLogDateChange = (date) => {
    setLogDate(date)
  }
  return (
    <Resizer
      style={{ height: '100%', width: '100%' }}
      left={
        <LogSource
          onTreeNodeSelect={onTreeNodeSelect}
          logDate={logDate}
          // execType={props.status === LOG_TAB_TYPE.EXEC_TYPE}
          // fetch={props.status === LOG_TAB_TYPE.EXEC_TYPE ? ETLLogExecTree : ETLLogUnExecTree}
        />
      }
      right={
        <ExecuteLog
          isLeaf={isLeaf}
          searchValue={searchParams}
          logDate={logDate}
          onLogDateChange={onLogDateChange}
        />
      }
    />
  )
}

export default LogContent
