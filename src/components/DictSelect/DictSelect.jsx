import React from 'react'

import { Select } from 'antd'

const Option = Select.Option
const DictSelect = (props) => {
  const { options = [], searchable, ...restProps } = props
  const searchProps = searchable
    ? {
        showSearch: true,
        filterOption: (input, option) => {
          const { children, label } = option.props
          if (Array.isArray(children) && typeof label === 'string') {
            return label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          } else if (typeof children === 'string') {
            return children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          return false
        }
      }
    : {}
  return (
    <Select
      allowClear
      {...searchProps}
      {...restProps}
    >
      {
        options.map(v => (
          <Option value={v.dictCode} key={v.dictCode}>{v.dictName}</Option>
        ))
      }
    </Select>
  )
}

export default DictSelect
