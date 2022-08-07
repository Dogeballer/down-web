import { Form, Icon, Button, Input } from 'antd/lib/index'
import React, { Component } from 'react'
import style from '../../../style.scss'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

let id = 1

class PublicRequestHeader extends Component {
  state = {
    keys: [0],
  }

  remove = k => {
    const keys = this.state.keys
    if (keys.length === 1) {
      return
    }
    this.setState({
      keys: keys.filter(key => key !== k)
    })
  }

  add = () => {
    const keys = this.state.keys
    const nextKeys = keys.concat(id++)
    this.setState({
      keys: nextKeys
    })
  }

  get values () {
    const params = {}
    this.items.forEach((item) => {
      if (item) {
        const { globalParam, paramValue } = item.value
        if (globalParam !== '' && globalParam) params[globalParam] = paramValue || ''
      }
    })
    return params
  }

  set values (values) {
    const newKey = []
    for (id = 0; id < Object.keys(values).length; id++) {
      newKey.push(id)
    }
    if (id === 0) {
      id = 1
      this.setState({ keys: [0] }, () => {
        this.items
          .filter(item => item)
          .forEach((item, index) => {
            if (item) {
              item.value = {}
            }
          })
      })
      return
    }

    this.setState({ keys: newKey }, () => {
      const params = []
      Object.keys(values).forEach((key) => {
        params.push({
          globalParam: key,
          paramValue: values[key]
        })
      })
      this.items
        .filter(item => item)
        .forEach((item, index) => {
          if (item) {
            item.value = params[index] || {}
          }
        })
    })
  }

  items = []

  render () {
    const { keys } = this.state
    this.items = []
    const formItems = keys.map((k) => (
      <ItemRow
        ref={ref => { this.items.push(ref) }}
        key={k}
        hasRemove={keys.length > 1}
        onRemove={() => this.remove(k)}
      />
    ))
    return (
      <div className={style['multi-form']}>
        {formItems}
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button type='dashed' onClick={this.add} style={{ width: '100%' }}>
            <Icon type='plus'/> 增加公共请求头
          </Button>
        </Form.Item>
      </div>
    )
  }
}

class ItemRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      globalParam: void 0,
      paramValue: void 0
    }
  }

  get value () {
    const param = {}
    param['globalParam'] = this.state.globalParam
    param['paramValue'] = this.state.paramValue
    return param
  }

  set value (value) {
    const { globalParam, paramValue } = value
    this.setState({
      globalParam: globalParam,
      paramValue: paramValue
    })
  }

  render () {
    const { globalParam, paramValue } = this.state
    const { hasRemove, onRemove } = this.props
    return (
      <div style={{ width: '100%', display: 'flex' }}>
        <Form.Item wrapperCol={{ span: 24 }} style={{ width: '50%', marginRight: '16px' }}>
          <Input
            placeholder={'请输入公共header参数名'}
            value={globalParam}
            onChange={(e) => {
              this.setState({
                globalParam: e.target.value,
              })
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} style={{ width: '50%' }}>
          <Input
            placeholder={'请输入套件公共请求头参数值'}
            value={paramValue}
            onChange={(e) => {
              this.setState({
                paramValue: e.target.value
              })
            }}
          />
        </Form.Item>
        {hasRemove ? (
          <Icon
            style={{ fontSize: '20px', marginLeft: '8px', lineHeight: '46px', color: '#F5222D' }}
            type='minus-circle-o'
            onClick={() => onRemove()}
          />
        ) : null}
      </div>
    )
  }
}

export default PublicRequestHeader
