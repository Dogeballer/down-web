import React, { Component } from 'react'
import { Select, Icon, Input, Tooltip, message } from 'antd'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import style from './style.scss'

class ParamContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      map: {}
    }
  }

  handleParamChange = (e) => {
    const { map } = this.state
    const { unSelected } = this.props
    const temp = unSelected.filter(i => i.field !== e)
    map[e] = ''
    this.setState({
      map
    }, () => {
      this.props.data(map)
      this.props.handleOptionList(temp)
    })
  }

  handleInputChange = (e) => {
    const { map } = this.state
    const { dataValue } = this.props
    map[dataValue.keyName] = e.target.value
    if (dataValue.keyName === 'TTL' && e.target.value > 2147483647) {
      message.warning('最大长度不超过2147483647')
    }
    this.setState({
      map
    }, () => this.props.data(map))
  }

  handleSelect = (e) => {
    const { map } = this.state
    const { dataValue } = this.props
    map[dataValue.keyName] = e
    this.setState({
      map
    }, () => this.props.data(map))
  }

  handleBlur = () => {
    const { map } = this.state
    if (!isEmpty(map)) {
      this.props.data(map)
    }
  }

  render () {
    const {
      handleRemove,
      keyId,
      unSelected } = this.props
    const defaultObj = this.props.dataValue || {}

    return (
      <div className={style['table-param']} key={keyId}>
        <span className={style['table-param-title']} > 参数 :</span>
        <Select
          className={style['table-param-select']}
          defaultValue={defaultObj.keyName || ''}
          value={defaultObj.keyName || ''}
          disabled={!!defaultObj.keyName}
          onChange={(e) => this.handleParamChange(e)}
          onBlur={() => this.handleBlur}>
          {
            unSelected.map(item => {
              return (
                <Select.Option key={item.field} value={item.field}>{item.field}</Select.Option>
              )
            })
          }
        </Select>
        <Input
          style={{ display: !defaultObj.typeList ? 'inline-block' : 'none' }}
          placeholder='参数值'
          defaultValue={defaultObj.value}
          value={defaultObj.value}
          disabled={!defaultObj.keyName}
          onChange={(e) => this.handleInputChange(e)}
          type={defaultObj.keyName === 'TTL' ? 'number' : null}
          onBlur={() => this.handleBlur} />

        <Select
          style={{ display: defaultObj.typeList ? 'inline-block' : 'none', width: 120 }}
          placeholder='参数值'
          value={defaultObj.value}
          disabled={!defaultObj.keyName}
          onChange={(e) => this.handleSelect(e)}
          onBlur={() => this.handleBlur}
        >
          {
            defaultObj.typeList &&
            defaultObj.typeList.map(item =>
              <Select.Option
                key={item.value}
                value={item.value}>{item.value}</Select.Option>)
          }
        </Select>

        <Tooltip placement='top' title={this.state['title' + keyId] || defaultObj.hint}>
          <Icon
            type='info-circle'
            style={{
              fontSize: '18px',
              color: '#FBA90F',
              paddingLeft: 8 }} />
        </Tooltip>
        <Icon
          type='minus-circle'
          style={{ fontSize: '18px', color: 'red', paddingLeft: 8 }}
          onClick={handleRemove}
        />
      </div>
    )
  }
}
export default ParamContent
