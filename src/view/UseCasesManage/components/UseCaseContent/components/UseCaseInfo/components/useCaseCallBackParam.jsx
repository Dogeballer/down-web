import { Form, Icon, Button, Input } from 'antd/lib/index'
import React, { Component } from 'react'
import style from '../../../style.scss'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

let id = 1

class CaseCallBackParam extends Component {
  state = {
    keys: [0],
  }

  get values () {
    const params = {}
    this.items.forEach((item) => {
      if (item) {
        const { callBackParam, paramValue } = item.value
        if (callBackParam !== '' && callBackParam) params[callBackParam] = paramValue || ''
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
          callBackParam: key,
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
      />
    ))
    return (
      <div className={style['multi-form']}>
        {formItems}
        <Form.Item wrapperCol={{ span: 24 }}>
          {/*<Button type='dashed' onClick={this.add} style={{ width: '100%' }}>*/}
          {/*  <Icon type='plus'/> 增加全局参数*/}
          {/*</Button>*/}
        </Form.Item>
      </div>
    )
  }
}

class ItemRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      callBackParam: void 0,
      paramValue: void 0
    }
  }

  set value (value) {
    const { callBackParam, paramValue } = value
    this.setState({
      callBackParam: callBackParam,
      paramValue: paramValue
    })
  }

  render () {
    const { callBackParam, paramValue } = this.state
    return (
      <div style={{ width: '100%', display: 'flex' }}>
        <Form.Item wrapperCol={{ span: 24 }} style={{ width: '50%', marginRight: '16px' }}>
          <Input
            disabled={true}
            placeholder={'请输入参数名,按照"{{callBackParam}}格式"'}
            value={callBackParam}
            onChange={(e) => {
              this.setState({
                callBackParam: e.target.value,
              })
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} style={{ width: '50%' }}>
          <Input
            disabled={true}
            placeholder={'回调参数值无法设置'}
            value={paramValue}
            onChange={(e) => {
              this.setState({
                paramValue: e.target.value
              })
            }}
          />
        </Form.Item>
      </div>
    )
  }
}

export default CaseCallBackParam
