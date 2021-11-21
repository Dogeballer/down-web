import React, { useState } from 'react'

import { Switch } from 'antd'

const StatusSwitch = (props) => {
  const { value, checkedValue = 1, uncheckedValue = 0, fetcher, onFinish } = props
  const [loading, setLoading] = useState(false)
  const handleChange = (checked) => {
    setLoading(true)
    const changedValue = checked ? checkedValue : uncheckedValue
    fetcher(changedValue)
      .then(() => {
        setLoading(false)
        typeof onFinish === 'function' && onFinish(changedValue)
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
      onChange={handleChange}
    />
  )
}

export default StatusSwitch
