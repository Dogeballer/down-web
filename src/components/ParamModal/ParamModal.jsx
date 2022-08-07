import React, { Component } from 'react'
import ParamContent from './component/ParamContent'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import { Button } from 'antd'
import style from './style.scss'

class ParamModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      params: {},
      optionList: this.props.options || []
    }
  }

  componentDidMount = () => {
    if (this.props.dataSource) {
      this.setState({
        params: this.props.dataSource
      })
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.dataSource) {
      this.setState({
        params: nextProps.dataSource
      })
    }
  }

  handleDelParam = (i) => {
    const { params } = this.state
    Object.keys(params).map(item => {
      if (item === '') delete params['']
    })
    delete params[i]
    this.setState({
      params
    })
  }

  handleAddParam = () => {
    const { params } = this.state
    params[''] = ''
    this.setState({ params })
  }

  handleProcessData = (data) => {
    let values = { ...this.state.params }
    const keyList = Object.keys(values)
    const key = Object.keys(data)[0]
    if (keyList.includes(key)) {
      Object.keys(values).map(item => {
        values[item] = Object.values(data)[0]
      })
    } else {
      values = { ...this.state.params, ...data.values }
      Object.keys(values).map(item => {
        if (item === '' && isEmpty(values[''])) delete values['']
      })
    }
    this.setState({
      params: values
    })
  }

  handleOptionList = (list) => {
    this.setState({ unSelected: list })
  }

  render () {
    const { params, optionList } = this.state
    const keys = Object.keys(params)
    const disableMode = this.props.viewOnly
    const unSelected = isEmpty(keys) ? optionList : optionList.filter(item => !keys.includes(item.field))
    const values = {
      iniOptions: optionList,
      unSelected,
      handleOptionList: (list) => this.handleOptionList(list),
      disableMode
      // data: (values) => this.handleProcessData({ values })
    }
    return (
      <div key={this.props.keyId}>
        <div className={style['dynamic-param']}>
          {
            isEmpty(keys)
              ? <ParamContent
                dataValue={{}}
                keyId={0}
                key={0}
                handleRemove={() => this.handleDelParam('')}
                data={(values) => this.handleProcessData({ values })}
                type='input'
                {...values}
              />
              : keys.map((item, index) => {
                const dataValue = {
                  keyName: item,
                  value: params[item]
                }
                const ele = optionList.find(i => item === i.field)
                if (ele) dataValue.hint = ele.hint
                if (ele && ele.select) dataValue.typeList = ele.optionList
                return (
                  <ParamContent
                    keyId={index + item}
                    key={index + item}
                    handleRemove={!disableMode ? () => this.handleDelParam(item) : null}
                    data={(values) => this.handleProcessData({ values })}
                    {...values}
                    dataValue={dataValue}
                  />
                )
              }
              )
          }
        </div>
        <div className={style['table-param-add']}>
          <Button
            icon='plus'
            type='dashed'
            disabled={disableMode}
            onClick={() => this.handleAddParam()}>新增参数</Button>
        </div>
      </div>
    )
  }
}
export default ParamModal
