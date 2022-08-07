import React, { Component } from 'react'

import {
  DatePicker
} from 'antd'

class DatePickerField extends Component {
  render () {
    return (
      <DatePicker {...this.props} />
    )
  }
}

export default DatePickerField
