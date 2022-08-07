import React, { Component } from 'react'

import {
  Select
} from 'antd'

class SelectField extends Component {
  render () {
    const { option } = this.props
    const { Option } = Select
    return (

      <Select {...this.props} >
        {
          option.map((option, i) => {
            return (<Option key={i} value={option.value}> {option.text} </Option>)
          })}
      </Select>
    )
  }
}

export default SelectField
