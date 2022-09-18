import React, {Component, useEffect, useState} from 'react'
import {Button, Empty, Form, Input, message, Modal, Select} from 'antd'
import style from './style.scss'
import UseCasesApi from '../../../../../../../api/usecases'
import ModuleApi from '../../../../../../../api/modules'
import InterfaceAPI from '../../../../../../../api/interfaces'
import NumericInput from '../../../../../../../components/NumericInput/NumericInput'
import TextArea from 'antd/es/input/TextArea'
import CaseInterface from './UseCaseInterfaceConfig'
import SqlScript from './UseCaseSqlScriptConfig'
import {isEmpty, isJSON} from '../../../../../../../lib/utils'
import {DataSourceSelect} from '../../UseCaseInfo/UseCaseInfo'
import Mqtt from "./UseCaseMqtt";

const {Option, OptGroup} = Select

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
          const params = {project: project_id}
          InterfaceAPI.getInterfaceSelector({params})
            .then((data) => {
              setInterfaceList(data.data.items)
            })
        })
      }).finally(() => setLoading(false))
  }
  const {...restProps} = props
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
  constructor(props) {
    super(props)
    this.state = {
      saveLoading: false,
      type: 0,
      param: [],
      body: '',
      id: undefined,
      data_source: undefined,
      sql_script: '',
      mqtt: undefined,
      qos: 0,
      topic: ''
    }
  }

  get values() {
    const {param, body, interfaceId, type, id, sql_script, mqtt, qos, topic} = this.state
    const formData = this.props.form.getFieldsValue()
    switch (type) {
      default:
        // const caseBody = () => {
        //   if (body.length !== 0) {
        //     if (!isJSON(body)) return message.info('请输入正确的JSON格式')
        //     return JSON.parse(body)
        //   } else {
        //     return {}
        //   }
        // }
        return {id, ...formData, param, type, body}
      case 1:
        const {time} = formData
        return {id, ...formData, type, param, ...{body: JSON.stringify({time: time}, null)}}
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return {id, ...formData, param, type, sql_script}
      case 11:
        const {times} = formData
        return {id, ...formData, mqtt, qos, topic, type, ...{body: JSON.stringify({times: times}, null)}}
      case 10:
      case 12:
        return {id, ...formData, mqtt, qos, topic, type, body}
    }
  }

  set values(values) {
    this.props.form.resetFields()
    if (values.type === 1) {
      this.setState({
        id: values.id,
        type: values.type,
        body: {time: values.time ? values.time : values.body.time},
      })
    } else if ([4, 5, 6, 7, 8, 9].includes(values.type)) {
      this.setState(
        {
          id: values.id,
          type: values.type,
          sql_script: values.sql_script
        }
      )
    } else if ([10, 12].includes(values.type)) {
      this.setState(
        {
          id: values.id,
          type: values.type,
          body: values.body,
          mqtt: values.mqtt,
          topic: values.topic,
          qos: values.qos,
        }
      )
    } else if (values.type === 11) {
      this.setState(
        {
          id: values.id,
          type: values.type,
          body: {times: values.times ? values.times : values.body.times},
          mqtt: values.mqtt,
          topic: values.topic,
          qos: values.qos,
        }
      )
    } else {
      this.setState({
        id: values.id,
        type: values.type,
        param: (isEmpty(values.param)) ? [] : values.param,
        body: isEmpty(values.body) ? '' : values.body,
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
          return {time: JSON.parse(values.body).time}
        }
      }
    }
    const times = () => {
      if (values.type === 11) {
        let body
        try {
          body = values.body
        } catch (e) {
          body = null
        }
        if (body) {
          return {times: JSON.parse(values.body).times}
        }
      }
    }
    this.props.form.setFieldsValue({
      ...time(),
      ...times(),
      ...values,
    })
  }

  componentDidMount() {
    this.getCaseDatasource()
    this.values = this.props.values || {}
  }

  componentDidUpdate(prevProps) {
    if (prevProps.index === this.props.index && prevProps.currentNode === this.props.currentNode && this.props.values === prevProps.values) return
    // console.log(this.props.values)
    this.values = this.props.values
  }

  getCaseDatasource = () => {
    UseCasesApi.getUseCase(this.props.currentNode)
      .then((response) => {
        const data_source = response.data.data_source
        this.setState({data_source: data_source})
      }).finally()
  }

  onParamChange = (param) => {
    this.setState({param: param})
  }
  onBodyChange = (body) => {
    this.setState({body: body})
  }
  onSqlChange = (sql) => {
    this.setState({sql_script: sql})
  }
  saveHandler = () => {
    const {type, mqtt, topic, body} = this.values
    if ([0, 2, 3].includes(type)) {
      if (!isJSON(body) && !isEmpty(body)) return message.info('请输入正确的JSON格式')
    }
    if ([10, 11, 12].includes(type)) {
      if ([10, 12].includes(type))
        if (isEmpty(body)) return message.info('请输入推送消息')
      if (!mqtt) return message.info('请选择连接客户端')
      if (!topic) return message.info('请填写主题')
    }
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
    this.setState({data_source: value})
  }
  mqttChangeHandle = (value) => {
    this.setState({mqtt: value})
  }
  topicChangeHandle = (value) => {
    this.setState({topic: value})
  }
  qosChangeHandle = (value) => {
    this.setState({qos: value})
  }
  renderChildren = () => {
    let element
    const {index, form, values} = this.props
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
      case 10:
      case 11:
      case 12:
        element = <Mqtt
          stepId={values.id}
          type={values.type}
          mqtt={values.mqtt}
          body={values.body}
          qos={values.qos}
          topic={values.topic}
          onBodyChange={this.onBodyChange}
          onMqttChange={this.mqttChangeHandle}
          onTopicChange={this.topicChangeHandle}
          onQosChange={this.qosChangeHandle}
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

  render() {
    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18}
    }
    const {currentNode, values, form} = this.props
    const {setFieldsValue, getFieldValue, getFieldDecorator} = form
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
                rules: [{required: true, message: '请输入步骤名称'}]
              })(
                <Input
                  placeholder={'请输入步骤名称'}
                />
              )}
            </Form.Item>
            {[0, 2, 3].includes(values.type) ? <Form.Item
              label="接口"
              style={{marginRight: 16}}
            >
              {getFieldDecorator('case_interface', {
                initialValue: values.case_interface,
                rules: [{required: true, message: '请选择步骤类型'}]
              })(
                <InterfaceSelect
                  disabled={true}
                  currentNode={this.props.currentNode}
                />
              )}
            </Form.Item> : null}
            {values.type === 1 ? <Form.Item
                label="暂停"
                style={{marginRight: 16}}
              >
                {getFieldDecorator('time', {
                  rules: [{required: true, message: '请填写暂停时间'}]
                })(
                  <NumericInput placeholder={'请填写暂停时间'}
                                onChange={(value) => {
                                  setFieldsValue({name: `暂停${value}s`,})
                                }}
                  />
                )}
              </Form.Item>
              : null}
            <Form.Item label={'排序'} style={{marginLeft: 5}}>
              {getFieldDecorator('sort', {
                rules: [{required: true, message: '请输入排序'}]
              })(
                <NumericInput placeholder={'请填写排序'}/>
              )}
            </Form.Item>
            <Form.Item label={'状态'}>
              {getFieldDecorator('status', {
                initialValue: true,
                rules: [{required: true, message: '请选择状态'}]
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
                  rules: [{required: true, message: '请输入轮询次数'}]
                })(
                  <NumericInput placeholder={'轮询次数'}/>
                )}
              </Form.Item>
              <Form.Item label={'间隔'} style={{marginLeft: 5}}>
                {getFieldDecorator('polling_interval', {
                  rules: [{required: true, message: '轮询间隔'}]
                })(
                  <NumericInput placeholder={'轮询间隔'}/>
                )}
              </Form.Item>
            </div>
            : null}
          {[3, 8, 9, 12].includes(values.type) ?
            <div className={style['row1']}>
              <Form.Item label={'参数'}>
                {getFieldDecorator('loop_parameter', {
                  rules: [{required: true, message: '请输入循环参数'}]
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
          {values.type === 11 ?
            <div className={style['row1']}>
              {/*<Form.Item label={'MQTT'}>*/}
              {/*  {getFieldDecorator('mqtt', {*/}
              {/*    rules: [{required: true, message: '请选择mqtt客户端'}]*/}
              {/*  })(*/}
              {/*    <MqttSelect*/}
              {/*      onChange={(value) => this.mqttChangeHandle(value)}*/}
              {/*      placeholder={'请选择MQTT客户端'}/>*/}
              {/*  )}*/}
              {/*</Form.Item>*/}
              {/*<Form.Item label={'topic'}>*/}
              {/*  {getFieldDecorator('topic', {*/}
              {/*    rules: [{required: true, message: '请输入topic'}]*/}
              {/*  })(*/}
              {/*    <Input*/}
              {/*      placeholder={'请输入topic'}*/}
              {/*      onChange={(value) => this.topicChangeHandle(value)}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*</Form.Item>*/}
              {/*  <Form.Item*/}
              {/*    label="qos"*/}
              {/*    style={{marginRight: 16}}*/}
              {/*  >*/}
              {/*    {getFieldDecorator('qos', {*/}
              {/*      rules: [{required: true, message: '请填写qos'}]*/}
              {/*    })(*/}
              {/*      <NumericInput placeholder={'请填写qos'}/>*/}
              {/*    )}*/}
              {/*  </Form.Item>*/}
              <Form.Item
                label="times"
                style={{marginRight: 16}}
              >
                {getFieldDecorator('times', {
                  rules: [{required: true, message: '请填写次数'}]
                })(
                  <NumericInput placeholder={'请填写次数'}/>
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
                  autoSize={{minRows: 3, maxRows: 3}}
                  style={{overflowY: 'auto'}}
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
            style={{marginLeft: 40}}
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

const StepForm = Form.create({name: 'StepForm'})(Step)

export default StepForm