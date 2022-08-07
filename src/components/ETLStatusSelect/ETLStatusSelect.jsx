import { Select } from 'antd'
import React, { Component } from 'react'
import { ETL_STATUS_DATA } from '../../constant'

const { Option } = Select

class ETLStatusSelect extends Component {
  render () {
    return (
      <Select {...this.props}>
        {ETL_STATUS_DATA.map(({value, text}) => (
          <Option key={value} value={value}>{text}</Option>
        ))}
      </Select>
    )
  }
}

export default ETLStatusSelect
