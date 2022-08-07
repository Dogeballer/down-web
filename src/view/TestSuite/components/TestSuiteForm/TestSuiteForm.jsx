import React, { Component, useEffect, useState } from 'react'

import { Button, Col, Form, Icon, Input, message, Modal, Row, Select, Table, TimePicker, Collapse } from 'antd'

import moment from 'moment'
import classnames from 'classnames'
import constant from '../../../../constant'
import testSuiteAPI from '../../../../api/testsuite'
import useCasesAPI from '../../../../api/usecases'
import { StickyCollapse } from '@fishballer/bui'
// import FilterModal from '../../../../components/FilterModal'
import utilities from '../../../../style/utilities.scss'
import NumericInput from '../../../../components/NumericInput/NumericInput'
// import ClassSelect from '../../../../components/ClassSelect/ClassSelect'
// import HospitalSelect from '../../../../components/HospitalSelect/HospitalSelect'
import style from './style.scss'
import ClassSelect from '../../../../components/ClassSelect/ClassSelect'
import EnvironmentAPI from '../../../../api/environment'
import FilterModal from '../../../../components/FilterModal'
import { isEmpty } from '../../../../lib/utils'
import IconFont from '../../../../components/Iconfont'
import CaseGlobalParam
  from '../../../UseCasesManage/components/UseCaseContent/components/UseCaseInfo/components/useCaseGlobalParam'
import CaseCallBackParam
  from '../../../UseCasesManage/components/UseCaseContent/components/UseCaseInfo/components/useCaseCallBackParam'
import SuiteGlobalParam from './components/SuiteGlobalParam'
import PublicRequestHeader from './components/PublicRequestHeader'
import UseCasesApi from '../../../../api/usecases'
import ModuleApi from '../../../../api/modules'
import InterfaceAPI from '../../../../api/interfaces'
// import HospitalSelect from '../../../../components/HospitalSelect/HospitalSelect'
// import FilterModal from '../../../../components/FilterModal'
const { OptGroup } = Select

export const EnvironmentSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [environmentList, setEnvironmentList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    EnvironmentAPI.getEnvironmentList()
      .then(data => {
        setEnvironmentList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  return <Select
    showSearch={true}
    optionFilterProp={'children'}
    loading={loading}
    {...props}
  >
    {(environmentList || []).map(({ id, name }) => <Option key={id} value={id}>{name}</Option>)}
  </Select>
}
const UseCaseSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [UseCaseList, setUseCaseList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    UseCasesApi.getUseCaseSelector()
      .then((response) => {
        setUseCaseList(response.data.items)
      }).finally(() => setLoading(false))
  }
  const { ...restProps } = props
  return <Select
    allowClear
    showSearch
    loading={loading}
    placeholder={'请选择前置用例'}
    filterOption={(input, option) => {
      return typeof option.props.children === 'string' &&
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }}
    {...restProps}
  >
    {
      (UseCaseList || []).map(module =>
        <OptGroup key={module.name} label={<span style={{
          fontSize: 16,
          fontWeight: 600
        }}
        >
              {module.name}
            </span>}>
          {
            (module.children || []).map(useCaseInfo =>
              <Option
                key={useCaseInfo.id}
                value={useCaseInfo.id}
              >
                {useCaseInfo.name}
              </Option>
            )
          }
        </OptGroup>
      )
    }
  </Select>
}

const {
  PAGE_SIZE,
  CLASS_TYPE,
  SPELLCODE_REGEX
} = constant
const Option = Select.Option
const { confirm } = Modal
const { Panel } = Collapse
const modeList = [
  { name: '手动执行', value: 0 },
  { name: '调度执行', value: 1 }
]
const typeList = [
  { name: '按项目', value: 0 },
  { name: '按模块', value: 1 },
  { name: '自定义', value: 2 },
]

class TestSuiteForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      loading: false,
      mode: 1,
      selectedRowKeys: [],
      visible: false,
      timingVisible: false,
      suiteInfo: {},
      environmentList: [],
      caseList: []
    }
    this.filter = {}
  }

  componentDidMount () {
    this.getData(this.props.currentSuiteId)
    this.fetchEnvironmentList()
  }

  componentDidUpdate = prevProps => {
    if (prevProps.currentSuiteId === this.props.currentSuiteId) return
    this.getData(this.props.currentSuiteId)
  }

  getData = (suiteId) => {
    if (!suiteId) {
      this.getCaseList(this.filter)
    } else {
      testSuiteAPI.getTestSuite(suiteId)
        .then(({ data }) => {
          const caseList = data.cases || []
          const selectedRowKeys = data.cases.map(({ id }) => id)
          this.preGlobalParamsSet.values = data.global_params
          this.prePublicRequestHeaderSet.values = data.public_headers
          this.setState({
            suiteInfo: data,
            caseList: caseList,
            selectedRowKeys
          }, () => this.getCaseList(this.filter, caseList))
        })
    }
  }
  getCaseList = (params = this.filter, caseList = []) => {
    this.setState({ loading: true })
    useCasesAPI.getSuiteUseCasesList(params)
      .then(({ data }) => {
        let listData = []
        if (!isEmpty(data.items)) {
          listData = data.items
          listData.forEach((item, itemIndex) => {
            const listIds = listData.map(({ id }) => id)
            caseList.forEach((value, index) => {
              if (item.id === value.id) {
                listData[itemIndex] = caseList[index]
              }
              if (listIds.findIndex((element) => element === value.id) === -1) {
                listData.unshift(caseList[index])
              }
            })
          })
        } else {
          listData = caseList
        }
        // console.log(listData)
        this.setState({
          loading: false,
          data: listData,
        })
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  }

  fetchEnvironmentList = () => {
    EnvironmentAPI.getEnvironmentList()
      .then(data => {
        this.setState({ environmentList: data.data.items })
      })
  }

  handleOnOk = (values) => {
    this.filter = { ...values }
    this.getCaseList(this.filter, this.state.caseList)
    this.handleToggleVisible()
  }

  handleToggleVisible = () => {
    this.setState(preState => {
      preState.visible = !preState.visible
      return preState
    })
  }

  onSelectChange = selectedRowKeys => {
    console.log(selectedRowKeys)
    this.setState({ selectedRowKeys })
  }

  handleOpenChange = open => this.setState({ timingVisible: open })

  handleClose = () => this.setState({ timingVisible: false })

  updateTableInfo = (key, value, record, fixEmpty) => {
    const newData = [...this.state.data]
    const index = newData.findIndex(item => item.id === record.id)
    newData[index] = { ...newData[index], [key]: value }
    this.setState({ data: newData })
  }
  handleSave = () => {
    const { currentClassId, currentSuiteId } = this.props
    this.props.form.validateFields((err, values) => {
      if (err) return
      if (isEmpty(this.state.selectedRowKeys)) return message.warning('请配置套件对应用例')
      for (let key in values) {
        if (values[key] instanceof moment) {
          values[key] = values[key].valueOf()
        }
      }
      let casesList = this.state.data.filter((item) => {
        if (this.state.selectedRowKeys.findIndex((element) => element === item.id) !== -1)
          return true
      })
      casesList.map((item) => item['case'] = item.id)
      values.cases = casesList
      values = { ...values }
      values['global_params'] = this.preGlobalParamsSet.values
      values['public_headers'] = this.prePublicRequestHeaderSet.values
      if (currentSuiteId) {
        testSuiteAPI.updateTestSuite(currentSuiteId, values).then(() => {
          this.props.setCurrentNode({ type: 1, classId: currentClassId })
        })
      } else {
        testSuiteAPI.createTestSuite(values).then(() => {
          this.props.setCurrentNode({ type: 1, classId: currentClassId })
        })
      }
    })
  }
  handleSuiteExecute = () => {
    const { currentSuiteId } = this.props
    if (!currentSuiteId) {
      return message.warning('请先保存当前测试套件')
    }
    confirm({
      title: '提示',
      content: '确认提交测试套件到任务执行？',
      okText: '确认',
      okButtonProps: {
        type: 'primary'
      },
      cancelText: '取消',
      onOk: () => {
        // console.log({ selectedRowKeys })
        message.info('提交成功')
        testSuiteAPI.asyncSuiteExecute(currentSuiteId)
          .then((response) => {
            if (response.code === 0) {

            }
          })
      },
      onCancel () {}
    })
  }

  render () {
    const {
      data,
      loading,
      visible,
      timingVisible,
      selectedRowKeys,
      suiteInfo
    } = this.state
    const {
      getFieldDecorator
    } = this.props.form

    const type = this.props.form.getFieldValue('type') || suiteInfo.type

    const mode = this.props.form.getFieldValue('mode') || suiteInfo.mode

    const columns = [
      {
        title: '用例ID',
        dataIndex: 'id',
        width: 100,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '名称',
        dataIndex: 'name',
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.name
        })
      },
      {
        title: '用例类型',
        dataIndex: 'type',
        width: 100,
        ellipsis: true,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        }
      },
      {
        title: '维护人员',
        dataIndex: 'user',
        width: 100,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.user
        })
      }, {
        title: '所属项目',
        dataIndex: 'project',
        width: 150,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.project
        })
      }, {
        title: '所属模块',
        dataIndex: 'modules',
        width: 150,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.modules
        })
      },
      {
        title: '独立执行环境',
        key: 'environment',
        dataIndex: 'environment',
        width: 200,
        fixed: 'right',
        shouldCellUpdate (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        render: (text, record) =>
          <Select
            showSearch={true}
            optionFilterProp={'children'}
            fake
            allowClear={true}
            value={text}
            placeholder={'请选择独立执行环境'}
            style={{ width: '100%' }}
            onChange={(value) => this.updateTableInfo('environment', value, record)}
          >
            {(this.state.environmentList || []).map(({ id, name }) => <Option key={id} value={id}>{name}</Option>)}
          </Select>
      }
    ]

    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true
    }

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 }
    }

    const initFlag = Object.keys(suiteInfo).length > 0

    return (
      <div className={style['dispatch-rule-wrapper']}>
        <div className={style['dispatch-rule-content']}>
          <div className={style['dispatch-rule-config']}>
            <div className={style['dispatch-rule-config-title']}>
              <span>套件配置</span>
            </div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <div className={style['dispatch-rule-form']}>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="套件名称">
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          // pattern: NAME_REGEX,
                          message: '套件名称不为空'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.name : void 0
                    })(
                      <Input placeholder="套件名称"/>
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="套件分类">
                    {getFieldDecorator('suite_class', {
                      rules: [
                        {
                          required: true,
                          message: '套件分类不可为空,且长度不能超过20'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.suite_class : (this.props.suite_class || void 0)
                    })(
                      <ClassSelect
                        hideDisabledClassChildren
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        classType={CLASS_TYPE.SCHEDULE}
                        placeholder={'请选择套件分类'}
                      />
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="模式">
                    {getFieldDecorator('mode', {
                      rules: [
                        {
                          required: true,
                          message: '模式不可为空'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.mode : void 0
                    })(
                      <Select
                        style={{ width: '100%' }}
                        placeholder={'请选择模式'}
                      >
                        {
                          modeList.map((item) =>
                            <Option key={item.value} value={item.value}>{item.name}</Option>)
                        }
                      </Select>
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className={style['dispatch-rule-form']}>
                {
                  (mode === 1)
                    ? <div className={style['dispatch-rule-form-item']}>
                      <Form.Item label="执行时间">
                        {getFieldDecorator('timing', {
                          rules: [{ required: true, message: '执行时间不可为空' }],
                          initialValue: initFlag ? moment(suiteInfo.timing) : moment(Date.now())
                        })(
                          <TimePicker
                            format={'HH:mm'}
                            open={timingVisible}
                            style={{ width: '100%' }}
                            onOpenChange={this.handleOpenChange}
                            placeholder={'请选择执行时间'}
                            addon={() => <Button type="primary" onClick={this.handleClose}>确定</Button>}
                          />
                        )}
                      </Form.Item>
                    </div>
                    : null
                }
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="编码">
                    {getFieldDecorator('code', {
                      rules: [
                        {
                          required: true,
                          // pattern: SPELLCODE_REGEX,
                          message: '编码不可为空,且长度不能超过20字母'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.code : void 0
                    })(
                      <Input placeholder="编码"/>
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="执行环境">
                    {getFieldDecorator('environment', {
                      rules: [
                        {
                          required: true,
                          message: '执行环境不可为空'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.environment : void 0
                    })(
                      <EnvironmentSelect placeholder="执行环境"/>
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className={style['dispatch-rule-form']}>
                {/*<div className={style['dispatch-rule-form-item']}>*/}
                {/*  <Form.Item label='套件类型'>*/}
                {/*    {getFieldDecorator('type', {*/}
                {/*      rules: [{ required: true, message: '套件类型不可为空' }],*/}
                {/*      initialValue: initFlag ? suiteInfo.type : void 0*/}
                {/*    })(*/}
                {/*      <Select style={{ width: '100%' }} placeholder={'请选择套件类型'}>*/}
                {/*        {*/}
                {/*          typeList.map((item) => <Option key={item.value} value={item.value}>{item.name}</Option>)*/}
                {/*        }*/}
                {/*      </Select>*/}
                {/*    )}*/}
                {/*  </Form.Item>*/}
                {/*</div>*/}
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="线程数">
                    {getFieldDecorator('thread_count', {
                      rules: [{ required: true, message: '线程数不可为空' }],
                      initialValue: initFlag ? suiteInfo.thread_count : void 0
                    })(
                      <NumericInput placeholder={'请填写线程数'}/>
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="前置用例">
                    {getFieldDecorator('precondition_case', {
                      rules: [],
                      initialValue: initFlag ? suiteInfo.precondition_case : void 0
                    })(
                      <UseCaseSelect/>
                    )}
                  </Form.Item>
                </div>
                {/*<div className={style['dispatch-rule-form-item']}>*/}
                {/*  {*/}
                {/*    type === 0 || type === 1*/}
                {/*      ? <Form.Item label={type === 0 ? '选择项目' : '选择模块'}>*/}
                {/*        {getFieldDecorator('type_value', {*/}
                {/*          initialValue: initFlag ? suiteInfo.type_value : void 0*/}
                {/*        })(*/}
                {/*          type === 0*/}
                {/*            ? <ProjectSelect*/}
                {/*              placeholder={'请选择项目'}*/}
                {/*            />*/}
                {/*            : <ModulesSelect*/}
                {/*              classType={'etl'}*/}
                {/*              hideDisabledClassChildren*/}
                {/*              placeholder={'请选择用例模块'}*/}
                {/*            />*/}
                {/*        )}*/}
                {/*      </Form.Item>*/}
                {/*      : null*/}
                {/*  }*/}
                {/*</div>*/}
              </div>
            </Form>
          </div>
          <div>
            <Collapse>
              <Panel header="公共请求头与全局参数配置" key="1" forceRender>
                {/*<div className={style['etl-info-form-section']}>*/}
                {/*  <h3>公共请求头与全局参数</h3>*/}
                <Row className={style['multi'] + ' ' + style['fix-col3']}>
                  <Col span={2} style={{
                    paddingTop: 10,
                    paddingRight: 8,
                    textAlign: 'right'
                  }}>公共请求头:</Col>
                  <Col span={10}>
                    <PublicRequestHeader ref={ref => { this.prePublicRequestHeaderSet = ref }}/>
                  </Col>
                  <Col span={2} style={{
                    paddingTop: 10,
                    paddingRight: 8,
                    textAlign: 'right'
                  }}>全局参数:</Col>
                  <Col span={10}>
                    <SuiteGlobalParam ref={ref => { this.preGlobalParamsSet = ref }}/>
                  </Col>
                </Row>
                {/*<Row className={style['multi'] + ' ' + style['fix-col3']}>*/}
                {/*  <Col span={3}>全局参数</Col>*/}
                {/*  <Col span={21}>*/}
                {/*    <SuiteGlobalParam ref={ref => { this.preGlobalParamsSet = ref }}/>*/}
                {/*  </Col>*/}
                {/*</Row>*/}
                {/*</div>*/}
              </Panel>
            </Collapse>
          </div>
          <div className={classnames(utilities['table-wrapper'], style['dispatch-rule-table'])}>
            <div className={style['dispatch-rule-title']}>
              <span>用例列表</span>
              <a onClick={this.handleToggleVisible}>按条件筛选</a>
            </div>
            <Table
              bordered
              size={'small'}
              rowKey={'id'}
              loading={loading}
              dataSource={data}
              pagination={false}
              columns={columns}
              scroll={{ x: 1280 }}
              rowSelection={rowSelection}
            />
          </div>
        </div>
        <div className={style['dispatch-rule-footer']}>
          <Button
            type="primary"
            onClick={this.handleSuiteExecute}
            style={{ marginRight: 15 }}
          >
            <IconFont type={'icon-shoudong'}/> 手动执行 </Button>
          <Button
            type="primary"
            onClick={this.handleSave}
          >
            <Icon type="save"/> 确定 </Button>
        </div>
        {
          visible
            ? <FilterModal
              visible
              title={'筛选'}
              onOk={this.handleOnOk}
              onCancel={this.handleToggleVisible}
            />
            : null
        }
      </div>
    )
  }
}

export default Form.create()(TestSuiteForm)
