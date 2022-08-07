import React, {Component} from 'react'

import {Input, Select, message, Divider} from 'antd'
import store from './store'
import {StickyCollapse, Table} from '@fishballer/bui'
import utilities from '../../../../../../../style/utilities.scss'
import IconFont from '../../../../../../../components/Iconfont'
import {getNegativeUnique} from '../../../../../../../lib/utils'
import {isEmpty} from '@fishballer/bui/dist/lib/utils'
import InterfaceAPI from '../../../../../../../api/interfaces'
import EllipsisText from '../../../../../../../components/EllipsisText'
import style from './style.scss'

const Option = Select.Option
const scrollObj = {x: 1050}

class InterfaceParam extends Component {
  state = {
    interfaceParamsList: [],
    pageSize: void 0,
    pageNum: void 0
  }
  paramsColumns = [
    {
      title: '参数名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 180,
      render: (value, record) => <Input
        value={value}
        onChange={(e) => this.handleFieldChange(e, 'name', record)}
      />
    },
    {
      title: '参数位置',
      key: 'param_in',
      dataIndex: 'param_in',
      align: 'center',
      width: 100,
      render: (value, record) => <Select
        allowClear
        value={value}
        placeholder={'请选择参数位置'}
        onChange={(value) => this.handleFieldChange(value, 'param_in', record)}
      >
        <Option value={'path'}>path</Option>
        <Option value={'query'}>query</Option>
        <Option value={'header'}>header</Option>
      </Select>
    },
    {
      title: '参数类型',
      key: 'type',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      render: (value, record) => <Select
        allowClear
        value={value}
        placeholder={'请选择参数类型'}
        onChange={(value) => this.handleFieldChange(value, 'type', record)}
      >
        <Option key={'string'} value={'string'}>string</Option>
        <Option key={'integer'} value={'integer'}>integer</Option>
      </Select>
    },
    {
      title: '是否必填',
      key: 'required',
      dataIndex: 'required',
      align: 'center',
      width: 100,
      render: (value, record) => <Select
        allowClear
        value={value}
        placeholder={'请选择是否必填'}
        onChange={(value) => this.handleFieldChange(value, 'required', record)}
      >
        <Option key={true} value={true}>是</Option>
        <Option key={false} value={false}>否</Option>
      </Select>
    }, {
      title: '版本号',
      key: 'version',
      dataIndex: 'version',
      align: 'center',
      width: 100,
      render: (value, record) => <Input
        value={value}
        onChange={(e) => this.handleFieldChange(e, 'version', record)}
      />
    },
    {
      title: '参数描述',
      key: 'describe',
      dataIndex: 'describe',
      align: 'center',
      width: 250,
      render: (value, record) => <Input
        value={value}
        onChange={(e) => this.handleFieldChange(e, 'describe', record)}
      />
    },
    {
      title: '示例值',
      key: 'example',
      dataIndex: 'example',
      align: 'center',
      width: 150,
      render: (value, record) => <Input
        value={value}
        onChange={(e) => this.handleFieldChange(e, 'example', record)}
      />
    },
    {
      title: '操作',
      key: 'opreate',
      dataIndex: 'opreate',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (value, record, index) => <div className={utilities['opt-display-center']}>
        <IconFont
          type={'icon-zengjia1'}
          style={{fontSize: 24}}
          onClick={() => this.handleAddFieldRow(index)}
        />
        <Divider type='vertical'/>
        <IconFont
          type={'icon-shanchu1'}
          style={{fontSize: 24}}
          onClick={() => this.handleDelFieldRow(record)}
        />
      </div>
    }
  ]

  set values(values) {
    const {
      interface_param
    } = values
    this.setState({
      interfaceParamsList: !isEmpty(interface_param) ? interface_param : [{
        ...store.paramInfo,
        id: getNegativeUnique()
      }]
    })
  }

  get values() {
    const {
      interfaceParamsList
    } = this.state
    // console.log(interfaceParamsList)
    return interfaceParamsList
  }

  componentDidMount = () => {
    this.values = this.props.values || {}
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.values === this.props.values) return
    this.values = this.props.values || {}
  }

  handleFieldChange = (e, key, record) => {
    let value = e

    if (e && e.target) {
      value = e.target.value
    }

    const {interfaceParamsList} = this.state
    interfaceParamsList.forEach(item => {
      if (item.id === record.id) item[key] = value
    })
    this.setState({interfaceParamsList: [...interfaceParamsList]})
  }

  handleAddFieldRow = (index) => {
    const {interfaceParamsList} = this.state
    interfaceParamsList.splice(index + 1, 0, {
      ...store.paramInfo,
      id: getNegativeUnique()
    })
    this.setState({interfaceParamsList: [...interfaceParamsList]})
  }

  handleDelFieldRow = (record) => {
    const {interfaceParamsList} = this.state
    // if (interfaceParamsList.length === 1) return message.warning('保留最后一条规则')
    if (Math.sign(record.id) === -1) {
      this.setState({interfaceParamsList: interfaceParamsList.filter(item => item.id !== record.id)})
      if (interfaceParamsList.length === 1) {
        this.setState({
          interfaceParamsList: [{
            ...store.paramInfo,
            id: getNegativeUnique()
          }]
        })
      }
    } else {
      InterfaceAPI.deleteInterfaceParam(record.id).then(
        (response) => {
          if (response.code === 0)
            this.setState({interfaceParamsList: interfaceParamsList.filter(item => item.id !== record.id)})
          if (interfaceParamsList.length === 1) {
            this.setState({
              interfaceParamsList: [{
                ...store.paramInfo,
                id: getNegativeUnique()
              }]
            })
          }
        }
      )
    }
    this.setState({interfaceParamsList: interfaceParamsList.filter(item => item.id !== record.id)})
  }

  render() {
    return (
      <div className={style['es-hbase-table']}>
        <Table
          bordered
          rowKey={'id'}
          scroll={scrollObj}
          columns={this.paramsColumns}
          dataSource={this.state.interfaceParamsList}
          pagination={false}
          style={{marginBottom: 10}}
        />
      </div>
    )
  }
}

export default InterfaceParam
