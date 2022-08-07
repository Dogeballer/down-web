import React, { Component } from 'react'
import { Select } from 'antd'
import electronAPI from '../../api/electron'

const Option = Select.Option
class UdfSelect extends Component {
  state = {
    loading: false,
    funcList: []
  }
  componentDidMount =() => {
    this.getUDF()
  }
  getUDF = () => {
    this.setState({loading: true})
    electronAPI.getUDF()
      .then((response) => {
        if (response.code === 0) {
          this.setState({funcList: response.data})
        }
      })
      .finally(() => {
        this.setState({loading: false})
      })
  }
  render () {
    return (
      <Select
        showSearch
        allowClear
        placeholder={'请选择解密函数'}
        loading={this.state.loading}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...this.props}
      >
        {this.state.funcList.map(item =>
          <Option
            key={item.udfCode}
            value={item.udfCode}
          >
            {`${item.udfCode} (${item.udfName})`}
          </Option>
        )}
      </Select>
    )
  }
}

export default UdfSelect
