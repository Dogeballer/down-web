import React, { Component } from 'react'

import {
  Input
} from 'antd'

class InputField extends Component {
  render () {
    return (
      <Input {...this.props} />
    )
  }
}

export default InputField
