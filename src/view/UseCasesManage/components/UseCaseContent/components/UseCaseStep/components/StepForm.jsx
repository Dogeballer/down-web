import React, { Component, useEffect, useState } from 'react'
import { Button, Form, Input, Select, Modal, message, InputNumber, Empty, Col } from 'antd'
import style from './style.scss'
import UseCasesApi from '../../../../../../../api/usecases'
import ModuleApi from '../../../../../../../api/modules'
import InterfaceAPI from '../../../../../../../api/interfaces'
import NumericInput from '../../../../../../../components/NumericInput/NumericInput'
import TextArea from 'antd/es/input/TextArea'
import utilities from '../../../../../../../style/utilities.scss'
import CaseInterface from './UseCaseInterfaceConfig'
import SqlScript from './UseCaseSqlScriptConfig'
import { isEmpty, isJSON } from '../../../../../../../lib/utils'
import datasourse from '../../../../../../../api/datasourse'
import { DataSourceSelect } from '../../UseCaseInfo/UseCaseInfo'

const { Option, OptGroup } = Select

const InterfaceSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [InterfaceList, setInterfaceList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    UseCasesApi.getUseCase(props.currentNode)
      .then((response) => {
        const module_id = response.data.modules
        ModuleApi.getModule(module_id).then((data) => {
          const project_id = data.data.project
          const params = { project: project_id }
          InterfaceAPI.getInterfaceSelector({ params })
            .then((data) => {
              setInterfaceList(data.data.items)
            })
        })
      }).finally(() => setLoading(false))
  }
  const { ...restProps } = props
  return <Select
    allowClear
    showSearch
    loading={loading}
    placeholder={'请选择接口'}
    filterOption={(input, option) => {
      return typeof option.props.children === 'string' &&
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }}
    {...restProps}
  >
    {
      (InterfaceList || []).map(interface_class =>
        <OptGroup key={interface_class.name} label={<span style={{
          fontSize: 16,
          fontWeight: 600
        }}
        >
              {interface_class.name}
            </span>}>
          {
            (interface_class.children || []).map(interfaceInfo =>
              <Option
                key={`${interfaceInfo.name}.${interfaceInfo.name}`}
                value={interfaceInfo.id}
              >
                {interfaceInfo.name + '-(' + interfaceInfo.path + ')'}
              </Option>
            )
          }
        </OptGroup>
      )
    }
  </Select>
}

class Step extends Component {
  constructor (props) {
    super(props)
    this.state = {
      saveLoading: false,
      type: 0,
      param: [],
      body: '',
      id: undefined,
      data_source: undefined,
      sql_script: ''
    }
  }

  get values () {
    const { param, body, interfaceId, type, id, sql_script } = this.state
    // console.log(body)
    const formData = this.props.form.getFieldsValue()
    switch (type) {
      default:
        const caseBody = () => {
          if (body.length !== 0) {
            if (!isJSON(body)) return message.info('请输入正确的JSON格式')
            return JSON.parse(body)
          } else {
            return {}
          }
        }
        return { id, ...formData, param, type, ...{ body: caseBody() } }
      case 1:
        const { time } = formData
        return { id, ...formData, type, param, ...{ body: { time: time } } }
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return { id, ...formData, param, type, sql_script }
    }
  }

  set values (values) {
    this.props.form.resetFields()
    if (values.type === 1) {
      this.setState({
        id: values.id,
        type: values.type,
        body: { time: values.time ? values.time : values.body.time },
      })
    } else if ([4, 5, 6, 7, 8, 9].includes(values.type)) {
      this.setState(
        {
          id: values.id,
          type: values.type,
          sql_script: values.sql_script
        }
      )
    } else {
      this.setState({
        id: values.id,
        type: values.type,
        param: (isEmpty(values.param)) ? [] : values.param,
        body: isEmpty(values.body) ? '' : JSON.stringify(values.body, null),
        interfaceId: values.interface
      })
    }
    const time = () => {
      if (values.type === 1) {
        let body
        try {
          body = values.body
        } catch (e) {
          body = null
        }
        if (body) {
          return { time: values.body.time }
        }
      }
    }
    this.props.form.setFieldsValue({
      ...time(),
      ...values,
    })
  }

  componentDidMount () {
    this.getCaseDatasource()
    this.values = this.props.values || {}
  }

  componentDidUpdate (prevProps) {
    if (prevProps.index === this.props.index && prevProps.currentNode === this.props.currentNode && this.props.values === prevProps.values) return
    // console.log(this.props.values)
    this.values = this.props.values
  }

  getCaseDatasource = () => {
    UseCasesApi.getUseCase(this.props.currentNode)
      .then((response) => {
        const data_source = response.data.data_source
        this.setState({ data_source: data_source })
      }).finally()
  }

  onParamChange = (param) => {
    this.setState({ param: param })
  }
  onBodyChange = (body) => {
    this.setState({ body: body })
  }
  onSqlChange = (sql) => {
    this.setState({ sql_script: sql })
  }
  saveHandler = () => {
    // console.log(this.values)
    this.props.onSave(this.values)
  }
  deleteHandler = () => {
    Modal.confirm({
      centered: true,
      title: '提示',
      content: '确定要删除此步骤吗?',
      onOk: () => {
        this.props.onDelete()
      }
    })
  }
  copyHandler = () => {
    Modal.confirm({
      centered: true,
      title: '提示',
      content: '复制当前步骤?',
      onOk: () => {
        this.props.onCopy()
      }
    })
  }
  dataSourceChangeHandle = (value) => {
    this.setState({ data_source: value })
  }
  renderChildren = () => {
    let element
    const { index, form, values } = this.props
    switch (values.type) {
      case 1:
        element = <Empty
          image={require('../../../../../../../assets/images/empty.png')}
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        />
        break
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        element = <SqlScript
          caseId={this.props.currentNode}
          data_source={this.state.data_source}
          sql_script={values.sql_script}
          stepId={values.id}
          type={values.type}
          onSqlChange={this.onSqlChange}
        />
        break
      default:
        element = <CaseInterface
          interfaceId={values.case_interface}
          params={values.param}
          body={values.body}
          stepId={values.id}
          type={values.type}
          onParamChange={this.onParamChange}
          onBodyChange={this.onBodyChange}
        />
        break
    }
    return element
  }

  render () {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { currentNode, values, form } = this.props
    const { setFieldsValue, getFieldValue, getFieldDecorator } = form
    return (
      <Form
        {...layout}
        className={style['step-form']}
        layout={'inline'}
      >
        <div className={style['items']}>
          <div className={style['row1']}>
            <Form.Item label={'名称'}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入步骤名称' }]
              })(
                <Input
                  placeholder={'请输入步骤名称'}
                />
              )}
            </Form.Item>
            {[0, 2, 3].includes(values.type) ? <Form.Item
              label="接口"
              style={{ marginRight: 16 }}
            >
              {getFieldDecorator('case_interface', {
                initialValue: values.case_interface,
                rules: [{ required: true, message: '请选择步骤类型' }]
              })(
                <InterfaceSelect
                  disabled={true}
                  currentNode={this.props.currentNode}
                />
              )}
            </Form.Item> : null}
            {values.type === 1 ? <Form.Item
                label="暂停"
                style={{ marginRight: 16 }}
              >
                {getFieldDecorator('time', {
                  rules: [{ required: true, message: '请填写暂停时间' }]
                })(
                  <NumericInput placeholder={'请填写暂停时间'}
                                onChange={(value) => {
                                  setFieldsValue({ name: `暂停${value}s`, })
                                }}
                  />
                )}
              </Form.Item>
              : null}
            <Form.Item label={'排序'} style={{ marginLeft: 5 }}>
              {getFieldDecorator('sort', {
                rules: [{ required: true, message: '请输入排序' }]
              })(
                <NumericInput placeholder={'请填写排序'}/>
              )}
            </Form.Item>
            <Form.Item label={'状态'}>
              {getFieldDecorator('status', {
                initialValue: true,
                rules: [{ required: true, message: '请选择状态' }]
              })(
                <Select allowClear>
                  <Option value={true} key={1}>有效</Option>
                  <Option value={false} key={2}>无效</Option>
                </Select>
              )}
            </Form.Item>
          </div>
          {[2, 6].includes(values.type) ? <div className={style['row1']}>
              <Form.Item label={'次数'}>
                {getFieldDecorator('wrap_count', {
                  rules: [{ required: true, message: '请输入轮询次数' }]
                })(
                  <NumericInput placeholder={'轮询次数'}/>
                )}
              </Form.Item>
              <Form.Item label={'间隔'} style={{ marginLeft: 5 }}>
                {getFieldDecorator('polling_interval', {
                  rules: [{ required: true, message: '轮询间隔' }]
                })(
                  <NumericInput placeholder={'轮询间隔'}/>
                )}
              </Form.Item>
            </div>
            : null}
          {[3, 8, 9].includes(values.type) ?
            <div className={style['row1']}>
              <Form.Item label={'参数'}>
                {getFieldDecorator('loop_parameter', {
                  rules: [{ required: true, message: '请输入循环参数' }]
                })(
                  <Input placeholder={'循环参数'} disabled={true}/>
                )}
              </Form.Item>
            </div>
            : null}
          {[4, 5, 6, 7, 8, 9].includes(values.type) ?
            <div className={style['row1']}>
              <Form.Item label={'元数据'}>
                {getFieldDecorator('data_source', {})(
                  <DataSourceSelect
                    onChange={(value) => this.dataSourceChangeHandle(value)}
                    placeholder={'元数据'}/>
                )}
              </Form.Item>
            </div>
            : null}
          <div className={style['children-wrapper']}>
            {this.renderChildren()}
          </div>
          <div className={style['remark-wrapper']}>
            <span className={style['remark-title']}>步骤备注：</span>
            <div className={style['remark-textarea']}>
              {getFieldDecorator('describe')(
                <TextArea
                  maxLength={500}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  style={{ overflowY: 'auto' }}
                />
              )}
            </div>
          </div>
        </div>
        <div className={style['bottom-buttons']}>
          <Button
            ghost
            type="danger"
            disabled={!currentNode}
            onClick={this.deleteHandler}
          >
            删除
          </Button>
          <Button
            ghost
            type="primary"
            disabled={!this.state.id}
            onClick={this.copyHandler}
            style={{ marginLeft: 40 }}
          >
            复制步骤
          </Button>
          <div className={style['bottom-buttons-right']}>
            <Button
              type={'primary'}
              disabled={!currentNode}
              onClick={() => this.saveHandler()}
              loading={this.state.saveLoading}>
              保存步骤
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

const StepForm = Form.create({ name: 'StepForm' })(Step)

export default StepForm