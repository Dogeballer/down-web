import React, { useState } from 'react'

import { Switch } from 'antd'

const StatusSwitch = (props) => {
  const { value, record, data, fetcher, dataKey = 'id', setData } = props
  const [loading, setLoading] = useState(false)
  const handleChange = (status, record, data) => {
    setLoading(true)
    fetcher(record[dataKey], status)
      .then(() => {
        const newData = [...data]
        const idx = newData.findIndex(v => v[dataKey] === record[dataKey])
        newData.splice(idx, 1, {
          ...record,
          showStatus: status
        })
        setLoading(false)
        setData(newData)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  return (
    <Switch
      checked={!!value}
      checkedChildren='开'
      unCheckedChildren='关'
      loading={loading}
      onChange={() => handleChange(value ? 0 : 1, record, data)}
    />
  )
}

export default StatusSwitch
