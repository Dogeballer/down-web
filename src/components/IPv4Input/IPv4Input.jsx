import React, { Component } from 'react'

import { Input } from 'antd'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'

class IPv4Input extends Component {
  state = {
    value: this.props.defaultValue
  }

  static getDerivedStateFromProps (nextProps) {
    const props = {}
    if ('value' in nextProps) {
      props.value = nextProps.value
    }
    return isEmpty(props) ? null : props
  }

  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value)
    }
  }

  handleBlur = (e) => {
    const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
    let value = e.target.value
    if (!reg.test(value)) value = ''
    this.setState({ value })
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value)
    }
  }

  render () {
    const { onChange, value, ...props } = this.props
    return (
      <Input
        maxLength={32}
        value={this.state.value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        {...props}
      />
    )
  }
}

export default IPv4Input
