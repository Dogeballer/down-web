import React, { Component } from 'react'
import { Select } from 'antd'
import electronAPI from '../../api/electron'

const Option = Select.Option
class DunsSelect extends Component {
  state = {
    loading: false,
    orgList: []
  }
  componentDidMount =() => {
    this.getOrgList()
  }
  getOrgList = () => {
    this.setState({loading: true})
    electronAPI.getHospital()
      .then((response) => {
        if (response.code === 0) {
          this.setState({orgList: response.data || []})
        }
      })
      .finally(() => {
        this.setState({loading: false})
      })
  }
  render () {
    const { loading, orgList } = this.state
    const { disabled, ...restProps } = this.props
    return (
      <Select
        showSearch
        allowClear
        placeholder={'选择医院'}
        loading={this.state.loading}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        disabled={loading || disabled}
        {...restProps}
      >
        {(orgList || []).map(item =>
          <Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Option>
        )}
      </Select>
    )
  }
}

export default DunsSelect
