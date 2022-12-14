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
    placeholder={'?????????????????????'}
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
  { name: '????????????', value: 0 },
  { name: '????????????', value: 1 }
]
const typeList = [
  { name: '?????????', value: 0 },
  { name: '?????????', value: 1 },
  { name: '?????????', value: 2 },
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
      if (isEmpty(this.state.selectedRowKeys)) return message.warning('???????????????????????????')
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
      return message.warning('??????????????????????????????')
    }
    confirm({
      title: '??????',
      content: '??????????????????????????????????????????',
      okText: '??????',
      okButtonProps: {
        type: 'primary'
      },
      cancelText: '??????',
      onOk: () => {
        // console.log({ selectedRowKeys })
        message.info('????????????')
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
        title: '??????ID',
        dataIndex: 'id',
        width: 100,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '??????',
        dataIndex: 'name',
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.name
        })
      },
      {
        title: '????????????',
        dataIndex: 'type',
        width: 100,
        ellipsis: true,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        }
      },
      {
        title: '????????????',
        dataIndex: 'user',
        width: 100,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.user
        })
      }, {
        title: '????????????',
        dataIndex: 'project',
        width: 150,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.project
        })
      }, {
        title: '????????????',
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
        title: '??????????????????',
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
            placeholder={'???????????????????????????'}
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
              <span>????????????</span>
            </div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <div className={style['dispatch-rule-form']}>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          // pattern: NAME_REGEX,
                          message: '?????????????????????'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.name : void 0
                    })(
                      <Input placeholder="????????????"/>
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('suite_class', {
                      rules: [
                        {
                          required: true,
                          message: '????????????????????????,?????????????????????20'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.suite_class : (this.props.suite_class || void 0)
                    })(
                      <ClassSelect
                        hideDisabledClassChildren
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        classType={CLASS_TYPE.SCHEDULE}
                        placeholder={'?????????????????????'}
                      />
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="??????">
                    {getFieldDecorator('mode', {
                      rules: [
                        {
                          required: true,
                          message: '??????????????????'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.mode : void 0
                    })(
                      <Select
                        style={{ width: '100%' }}
                        placeholder={'???????????????'}
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
                      <Form.Item label="????????????">
                        {getFieldDecorator('timing', {
                          rules: [{ required: true, message: '????????????????????????' }],
                          initialValue: initFlag ? moment(suiteInfo.timing) : moment(Date.now())
                        })(
                          <TimePicker
                            format={'HH:mm'}
                            open={timingVisible}
                            style={{ width: '100%' }}
                            onOpenChange={this.handleOpenChange}
                            placeholder={'?????????????????????'}
                            addon={() => <Button type="primary" onClick={this.handleClose}>??????</Button>}
                          />
                        )}
                      </Form.Item>
                    </div>
                    : null
                }
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="??????">
                    {getFieldDecorator('code', {
                      rules: [
                        {
                          required: true,
                          // pattern: SPELLCODE_REGEX,
                          message: '??????????????????,?????????????????????20??????'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.code : void 0
                    })(
                      <Input placeholder="??????"/>
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('environment', {
                      rules: [
                        {
                          required: true,
                          message: '????????????????????????'
                        }
                      ],
                      initialValue: initFlag ? suiteInfo.environment : void 0
                    })(
                      <EnvironmentSelect placeholder="????????????"/>
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className={style['dispatch-rule-form']}>
                {/*<div className={style['dispatch-rule-form-item']}>*/}
                {/*  <Form.Item label='????????????'>*/}
                {/*    {getFieldDecorator('type', {*/}
                {/*      rules: [{ required: true, message: '????????????????????????' }],*/}
                {/*      initialValue: initFlag ? suiteInfo.type : void 0*/}
                {/*    })(*/}
                {/*      <Select style={{ width: '100%' }} placeholder={'?????????????????????'}>*/}
                {/*        {*/}
                {/*          typeList.map((item) => <Option key={item.value} value={item.value}>{item.name}</Option>)*/}
                {/*        }*/}
                {/*      </Select>*/}
                {/*    )}*/}
                {/*  </Form.Item>*/}
                {/*</div>*/}
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="?????????">
                    {getFieldDecorator('thread_count', {
                      rules: [{ required: true, message: '?????????????????????' }],
                      initialValue: initFlag ? suiteInfo.thread_count : void 0
                    })(
                      <NumericInput placeholder={'??????????????????'}/>
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label="????????????">
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
                {/*      ? <Form.Item label={type === 0 ? '????????????' : '????????????'}>*/}
                {/*        {getFieldDecorator('type_value', {*/}
                {/*          initialValue: initFlag ? suiteInfo.type_value : void 0*/}
                {/*        })(*/}
                {/*          type === 0*/}
                {/*            ? <ProjectSelect*/}
                {/*              placeholder={'???????????????'}*/}
                {/*            />*/}
                {/*            : <ModulesSelect*/}
                {/*              classType={'etl'}*/}
                {/*              hideDisabledClassChildren*/}
                {/*              placeholder={'?????????????????????'}*/}
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
              <Panel header="????????????????????????????????????" key="1" forceRender>
                {/*<div className={style['etl-info-form-section']}>*/}
                {/*  <h3>??????????????????????????????</h3>*/}
                <Row className={style['multi'] + ' ' + style['fix-col3']}>
                  <Col span={2} style={{
                    paddingTop: 10,
                    paddingRight: 8,
                    textAlign: 'right'
                  }}>???????????????:</Col>
                  <Col span={10}>
                    <PublicRequestHeader ref={ref => { this.prePublicRequestHeaderSet = ref }}/>
                  </Col>
                  <Col span={2} style={{
                    paddingTop: 10,
                    paddingRight: 8,
                    textAlign: 'right'
                  }}>????????????:</Col>
                  <Col span={10}>
                    <SuiteGlobalParam ref={ref => { this.preGlobalParamsSet = ref }}/>
                  </Col>
                </Row>
                {/*<Row className={style['multi'] + ' ' + style['fix-col3']}>*/}
                {/*  <Col span={3}>????????????</Col>*/}
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
              <span>????????????</span>
              <a onClick={this.handleToggleVisible}>???????????????</a>
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
            <IconFont type={'icon-shoudong'}/> ???????????? </Button>
          <Button
            type="primary"
            onClick={this.handleSave}
          >
            <Icon type="save"/> ?????? </Button>
        </div>
        {
          visible
            ? <FilterModal
              visible
              title={'??????'}
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
