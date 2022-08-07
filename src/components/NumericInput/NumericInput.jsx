import React, {Component} from 'react'
import { Input } from 'antd'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

class NumericInput extends Component {
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

  onChange = (e) => {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    const value = e.target.value
    if (reg.test(value) || value === '') {
      this.setState({value})
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(value && value !== '' ? parseInt(value) : null)
      }
    }
  }
  render () {
    const {onChange, value, defaultValue, ...props} = this.props
    return (
      <Input
        onChange={this.onChange}
        value={this.state.value}
        maxLength={10}
        {...props}
      />
    )
  }
}

export default NumericInput
