import React, { Component, useEffect, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, Popover, Row, Select } from 'antd'
import UseCasesApi from '../../../../../../api/usecases'
import ProjectsApi from '../../../../../../api/projects'
import DatasourseApi from '../../../../../../api/datasourse'
import style from './style.scss'
import CaseGlobalParam from './components/useCaseGlobalParam'
import CaseCallBackParam from './components/useCaseCallBackParam'
import ProjectAPI from '../../../../../../api/projects'

const { Option, OptGroup } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker
const widthStyle = { width: '100%' }
const dropdownStyle = { maxWidth: 300, maxHeight: 300, overflow: 'auto' }
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }
const caseType = [
  { value: 0, text: '正向用例' },
  { value: 1, text: '异常用例' },
  { value: 2, text: '场景用例' },
  { value: 3, text: '流程用例' },
]
export const ModulesSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [ModulesList, setModulesList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    ProjectsApi.getProjectModulesSelector()
      .then(data => {
        setModulesList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  const { ...restProps } = props
  return <Select
    allowClear
    showSearch
    loading={loading}
    filterOption={(input, option) => {
      return typeof option.props.children === 'string' &&
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }}
    {...restProps}
  >
    {
      (ModulesList || []).map(project =>
        <OptGroup key={project.name} label={<span style={{
          fontSize: 16,
          fontWeight: 600
        }}>
              {project.name}
            </span>}>
          {
            (project.modules || []).map(module =>
              <Option
                key={`${project.name}.${module.name}`}
                value={module.id}
              >
                {module.name}
              </Option>
            )
          }
        </OptGroup>
      )
    }
  </Select>
}

export const DataSourceSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [dataSourceList, setDataSourceList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    DatasourseApi.getDataSourceList({ status: true })
      .then(data => {
        setDataSourceList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  return <Select
    placeholder={'请选择元数据'}
    showSearch={true}
    optionFilterProp={'children'}
    allowClear={true}
    loading={loading}
    {...props}
  >
    {(dataSourceList || []).map(({ id, name }) => <Option key={id} value={id}>{name}</Option>)}
  </Select>
}

class BasicInfo extends Component {
  _caseId = this.props.currentNode
  get caseId () {
    return this._caseId
  }

  set caseId (id) {
    this._caseId = id
    this.fetch(id)
  }

  originData = {}

  get values () {
    return { ...this.props.form.getFieldsValue() }
  }

  set values (data) {
    this.props.form.resetFields()
    this.props.form.setFieldsValue(data)
  }

  resetData (data = {}) {
    this.init(data, true)
  }

  fetch (caseId) {
    if (!caseId) return
    UseCasesApi.getUseCase(caseId)
      .then((response) => {
        const data = response.data || {}
        this.values = data
        this.preGlobalParamsSet.values = data.global_params
        this.preCallBackParamsSet.values = data.params
      })
  }

  init = (data, emptycaseId) => {
    const defaultValues = {
      type: 0,
    }
    if (emptycaseId) this._caseId = null
    this.values = { ...defaultValues, ...data }
  }

  componentDidMount () {
    if (this.caseId) {
      this.fetch(this.caseId)
    } else {
      const data = {}
      this.init(data)
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.currentNode === this.props.currentNode) return
    this.fetch(this.props.currentNode)
  }

  onSaveHandler = () => {
    // console.log(this.props.currentNode)
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = { ...values }
        data['global_params'] = this.preGlobalParamsSet.values
        if (this.props.currentNode) {
          UseCasesApi.updateUseCase(this.props.currentNode, { ...data })
            .then(() => {
              this.originData = { id: this.props.currentNode, ...data }
            })
        } else {
          UseCasesApi.createUseCase(data).then((response) => {
            this.originData = { ...data, id: response.data.id }
            this.fetch(response.data.id)
            this.props.saveId(response.data.id)
          })
        }
      }
    })
  }

  render () {
    const {
      getFieldValue,
      setFieldsValue,
      getFieldDecorator
    } = this.props.form
    const classId = getFieldValue('classId')

    return (
      <Form className={style['etl-info-form']} {...layout}>
        <div className={style['etl-info-form-section']}>
          <h3>基本信息</h3>
          <Row>
            <Col span={12} className={style['fix-col6']}>
              <Form.Item label={'名称'}>
                {getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入用例名称'
                  }]
                })(
                  <Input placeholder={'请输入用例名称'}/>
                )}
              </Form.Item>
              <Form.Item label={'维护者'}>
                {getFieldDecorator('user', {
                  rules: [{
                    required: true, message: '请输入维护者'
                  }]
                })(
                  <Input placeholder={'请输入维护者'}/>
                )}
              </Form.Item>
              <Form.Item label={'元数据'}>
                {getFieldDecorator('data_source', {
                })(
                  <DataSourceSelect/>
                )}
              </Form.Item>
            </Col>
            <Col span={12} className={style['fix-col6']}>
              <Form.Item label={'模块'}>
                {getFieldDecorator('modules', {
                  rules: [{
                    required: true, message: '请选择用例模块'
                  }]
                })(
                  <ModulesSelect
                    style={{ maxHeight: '300px' }}
                    placeholder={'请选择所属模块'}
                    filter={node => node.status === false}
                  />
                )}
              </Form.Item>
              <Form.Item label={'类型'}>
                {getFieldDecorator('type', {
                  rules: [{
                    required: true,
                    message: '请选择用例类型'
                  }]
                })(
                  <Select
                    placeholder={'请选择用例类型'}
                  >
                    {(caseType || []).map(({ value, text }) => <Option key={value} value={value}>{text}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            className={style['textArea-wrapper'] + ' ' + style['fix-col3']}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}

            label={'备注'}
          >
            {getFieldDecorator('describe', {})(
              <TextArea placeholder={'在此输入备注'}/>
            )}
          </Form.Item>
        </div>
        <div className={style['etl-info-form-section']}>
          <Popover
            content={'全局参数可设置时间函数转换，如’instantiation_time(\'minutes\',3,\'%Y-%m-%d %H:%M:%S\')‘，' +
            '转换后时间为当前时间+3min，如”2020-12-31 08:03:01“，支持的类型为days、weeks、seconds、minutes、hours，' +
            '如果想转换为时间戳，则更改格式为：’instantiation_time(\'minutes\',3,\'timestamp\')‘，默认为毫秒'}
            title="提示" trigger="click">
            <h3><a>全局参数及回调参数</a></h3>
          </Popover>
          <Row className={style['multi'] + ' ' + style['fix-col3']}>
            <Col span={3}>全局参数</Col>
            <Col span={21}>
              <CaseGlobalParam ref={ref => { this.preGlobalParamsSet = ref }}/>
            </Col>
          </Row>
          <Row className={style['multi'] + ' ' + style['fix-col3']}>
            <Col span={3}>回调参数</Col>
            <Col span={21}>
              <CaseCallBackParam ref={ref => { this.preCallBackParamsSet = ref }}/>
            </Col>
          </Row>
        </div>
        <div className={style['bottom-buttons']}>
          <div className={style['bottom-buttons-container']}>
            <Button
              type={'primary'}
              onClick={this.onSaveHandler}>
              保存
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

const BasicInfoEdit = Form.create({ name: 'ETLBasicInfo' })(BasicInfo)

export default BasicInfoEdit
