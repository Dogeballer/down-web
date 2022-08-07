import React, { Component } from 'react'

import {
  Icon,
  Form,
  Input,
  Select,
  Button,
  TimePicker
} from 'antd'

import Table from '../../../../components/Table'
import moment from 'moment'
import classnames from 'classnames'
import constant, { PERMS_IDENTS, INIT_PAGINATION } from '../../../../constant'
import testSuiteAPI from '../../../../api/testsuite'
import FilterModal from '../../../../components/FilterModal'
import utilities from '../../../../style/utilities.scss'
import NumericInput from '../../../../components/NumericInput/NumericInput'
import ClassSelect from '../../../../components/ClassSelect/ClassSelect'
import HospitalSelect from '../../../../components/HospitalSelect/HospitalSelect'
import dictionaryAPI from '../../../../api/dictionary'
import style from './style.scss'

const {
  PAGE_SIZE,
  CLASS_TYPE,
  DICT_SET,
  PRIORITY_REGEX,
  SPELLCODE_REGEX
} = constant
const Option = Select.Option
const CURRENT_CATEGORY = [
  {
    field: 'typeList',
    dictCode: DICT_SET.DISPATCH_TYPE.dictCode
  },
  {
    field: 'modeList',
    dictCode: DICT_SET.DISPATCH_MODE.dictCode
  }
]
class TestSuiteForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectValue: 1,
      modeList: [
        { name: '手动执行', value: 3 }
      ],
      typeList: [
        { name: '全部ETL', value: 1 }
      ],
      data: [],
      loading: false,
      dispatchMode: 1,
      selectedRowKeys: [],
      visible: false,
      timingVisible: false,
      dispatchInfo: {},
      pagination: { ...INIT_PAGINATION }
    }
    this.filter = {
      limit: PAGE_SIZE,
      current: 1
    }
  }

  componentDidMount () {
    CURRENT_CATEGORY.map(item => this.getDictList(item.field, item.dictCode))
    this.getData(this.props.currentScheduleId)
  }

  componentDidUpdate = prevProps => {
    if (prevProps.currentScheduleId === this.props.currentScheduleId) return
    this.getData(this.props.currentScheduleId)
  }

  getData = (scheduleId) => {
    if (!scheduleId) {
      this.getETLList(this.filter)
    } else {
      dispatchAPI.getSchedule(scheduleId)
        .then(({data}) => {
          this.filter.scheduleId = data.id
          this.filter.orgCode = data.scheduleOrgCode
          this.filter.classId = data.scheduleEtlClassId
          const scheduleEtlList = data.scheduleEtlList || []
          const selectedRowKeys = [...scheduleEtlList]
          this.setState({
            dispatchInfo: data,
            selectedRowKeys
          }, () => this.getETLList(this.filter))
        })
    }
  }

  /**
   * 提交表单
   */
  handleSave = () => {
    const { currentClassId, currentScheduleId } = this.props
    this.props.form.validateFields((err, values) => {
      if (err) return
      if (values.type === 4) values.scheduleEtlList = this.state.selectedRowKeys
      for (let key in values) {
        if (values[key] instanceof moment) {
          values[key] = values[key].valueOf()
        }
      }
      let requestMethod
      if (currentScheduleId) {
        values = { ...values, id: currentScheduleId }
        requestMethod = dispatchAPI.updateSchedule
      } else {
        requestMethod = dispatchAPI.addSchedule
      }
      requestMethod(values)
        .then(() => {
          this.props.setCurrentNode({ type: 1, classId: currentClassId })
        })
    })
  }

  getETLList = (params = this.filter) => {
    this.setState({ loading: true })
    dispatchAPI.getETLList(params)
      .then(({data}) => {
        this.setState({
          loading: false,
          data: data.list,
          pagination: {
            ...this.state.pagination,
            total: data.total,
            current: this.filter.current
          } })
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  }

  getDictList = (field, dictCode) => {
    dictionaryAPI.getDictList(dictCode)
      .then(({data}) => {
        this.setState({ [field]: data.list })
      })
  }

  handleSelectGroup = value => {
    this.setState({
      selectValue: value
    })
  }

  handleDispatchMode = value => {
    this.setState({
      dispatchMode: value
    })
  }

  handleOpenChange = open => this.setState({ timingVisible: open })

  handleClose = () => this.setState({ timingVisible: false })

  /**
   * 表格发生变化时触发（分页、排序、过滤条件）
   */
  handleTableChange = (page) => {
    const currentPage = page.current
    this.filter.current = currentPage
    this.getETLList(this.filter)
  }

  handleDispatchType = (value) => {
    if (value !== 1) return
    this.filter = {
      limit: PAGE_SIZE,
      current: 1
    }
    this.getETLList(this.filter)
  }

  handleFactorChange = (type, value) => {
    this.filter = {
      limit: PAGE_SIZE,
      current: 1
    }
    type === 2 ? this.filter.orgCode = value : this.filter.classId = value
    this.getETLList(this.filter)
  }

  handleToggleVisible = () => {
    this.setState(preState => {
      preState.visible = !preState.visible
      return preState
    })
  }

  /**
   * 提交表单
   */
  handleOnOk = (values) => {
    this.filter = {...values, limit: PAGE_SIZE, current: 1}
    this.getETLList(this.filter)
    this.handleToggleVisible()
  }

  /**
   * 点击多选框
   */
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  getInitValue = (type, initFlag, dispatchInfo) => {
    let returnValue = ''
    if (initFlag) {
      if (type === 2) {
        returnValue = dispatchInfo.scheduleOrgCode
      } else {
        returnValue = dispatchInfo.scheduleEtlClassId
      }
    }
    return returnValue
  }

  render () {
    const {
      data,
      loading,
      visible,
      timingVisible,
      modeList,
      typeList,
      selectedRowKeys,
      pagination,
      dispatchInfo
    } = this.state
    const {
      getFieldDecorator
    } = this.props.form

    const type = this.props.form.getFieldValue('type') || dispatchInfo.type

    const mode = this.props.form.getFieldValue('mode') || dispatchInfo.mode

    const columns = [
      {
        title: ' ETL号',
        dataIndex: 'id',
        width: 100,
        fixed: 'left',
        ellipsis: true
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 200,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.name
        })
      },
      {
        title: '类型',
        dataIndex: 'className',
        ellipsis: true,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        }
      },
      {
        title: '目标库',
        dataIndex: 'targetDatabaseName',
        width: 200,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.targetDatabaseName
        })
      },
      {
        title: '目标表',
        dataIndex: 'targetTableName',
        width: 200,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.targetTableName
        })
      },
      {
        title: '传参开始时间',
        dataIndex: 'executeStartDate',
        align: 'center',
        width: 200,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        render: (value) => value ? moment(value).format('YYYY-MM-DD') : '--'
      },
      {
        title: '传参结束时间',
        dataIndex: 'executeEndDate',
        align: 'center',
        fixed: 'right',
        width: 200,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        render: (value) => value ? moment(value).format('YYYY-MM-DD') : '--'
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

    const initFlag = Object.keys(dispatchInfo).length > 0

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
                  <Form.Item label='套件名称'>
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          // pattern: NAME_REGEX,
                          message: '套件名称不为空'
                        }
                      ],
                      initialValue: initFlag ? dispatchInfo.name : void 0
                    })(
                      <Input placeholder='套件名称' />
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label='套件分类'>
                    {getFieldDecorator('classId', {
                      rules: [
                        {
                          required: true,
                          message: '套件分类不可为空,且长度不能超过20'
                        }
                      ],
                      initialValue: initFlag ? dispatchInfo.classId : (this.props.currentClassId || void 0)
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
                  <Form.Item label='模式'>
                    {getFieldDecorator('mode', {
                      rules: [
                        {
                          required: true,
                          message: '模式不可为空'
                        }
                      ],
                      initialValue: initFlag ? dispatchInfo.mode : void 0
                    })(
                      <Select
                        style={{ width: '100%' }}
                        onChange={this.handleDispatchMode}
                        placeholder={'请选择模式'}
                      >
                        {
                          modeList.map((item, i) => item.dictNum !== 1 && <Option key={i} value={item.dictNum}>{item.dictName}</Option>)
                        }
                      </Select>
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className={style['dispatch-rule-form']}>
                {
                  (mode === 2 || mode === 4)
                    ? <div className={style['dispatch-rule-form-item']}>
                      <Form.Item label='执行时间'>
                        {getFieldDecorator('timing', {
                          rules: [{ required: true, message: '执行时间不可为空' }],
                          initialValue: initFlag ? moment(dispatchInfo.timing) : moment(Date.now())
                        })(
                          <TimePicker
                            format={'HH:mm'}
                            open={timingVisible}
                            style={{width: '100%'}}
                            onOpenChange={this.handleOpenChange}
                            placeholder={'请选择执行时间'}
                            addon={() => <Button type='primary' onClick={this.handleClose}>确定</Button>}
                          />
                        )}
                      </Form.Item>
                    </div>
                    : null
                }
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label='拼音码'>
                    {getFieldDecorator('spellCode', {
                      rules: [
                        {
                          required: true,
                          pattern: SPELLCODE_REGEX,
                          message: '拼音码不可为空,且长度不能超过20字母'
                        }
                      ],
                      initialValue: initFlag ? dispatchInfo.spellCode : void 0
                    })(
                      <Input placeholder='拼音码' />
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label='优先级'>
                    {getFieldDecorator('priorityLevel', {
                      rules: [
                        {
                          required: true,
                          pattern: PRIORITY_REGEX,
                          message: '优先级不可为空,且长度不能超过10'
                        }
                      ],
                      initialValue: initFlag ? dispatchInfo.priorityLevel : void 0
                    })(
                      <NumericInput placeholder='优先级' />
                    )}
                  </Form.Item>
                </div>
              </div>
              <div className={style['dispatch-rule-form']}>
                <div className={style['dispatch-rule-form-item']}>
                  <Form.Item label='套件类型'>
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '套件类型不可为空' }],
                      initialValue: initFlag ? dispatchInfo.type : void 0
                    })(
                      <Select style={{ width: '100%' }} placeholder={'请选择套件类型'} onChange={this.handleDispatchType}>
                        {
                          typeList.map((item, i) => <Option key={i} value={item.dictNum}>{item.dictName}</Option>)
                        }
                      </Select>
                    )}
                  </Form.Item>
                </div>
                <div className={style['dispatch-rule-form-item']}>
                  {
                    type === 2 || type === 3
                      ? <Form.Item label={type === 2 ? '选择项目' : '选择模块'}>
                        {getFieldDecorator(type === 2 ? 'scheduleOrgCode' : 'scheduleEtlClassId', {
                          initialValue: this.getInitValue(type, initFlag, dispatchInfo)
                        })(
                          type === 2
                            ? <HospitalSelect
                              autoFetch
                              placeholder={'请选择贴源医院'}
                              onChange={(value) => this.handleFactorChange(type, value)}
                            />
                            : <ClassSelect
                              classType={'etl'}
                              hideDisabledClassChildren
                              placeholder={'请选择ETL分类'}
                              onChange={(value) => this.handleFactorChange(type, value)}
                            />
                        )}
                      </Form.Item>
                      : null
                  }
                </div>
              </div>
            </Form>
          </div>
          <div className={classnames(utilities['table-wrapper'], style['dispatch-rule-table'])}>
            <div className={style['dispatch-rule-title']}>
              <span>ETL列表</span>
              { type === 4 ? <a onClick={this.handleToggleVisible}>按条件筛选</a> : null }
            </div>
            <Table
              bordered
              rowKey={'id'}
              loading={loading}
              dataSource={data}
              pagination={pagination}
              columns={columns}
              scroll={{x: 1280}}
              rowSelection={type === 4 ? rowSelection : null}
              onChange={this.handleTableChange}
            />
          </div>
        </div>
        <div className={style['dispatch-rule-footer']}>
          <OperationComponent ident={PERMS_IDENTS.SCHEDULE_UPDATE}>
            {
              ({isAuth}) => <Button
                type='primary'
                disabled={!!this.props.currentScheduleId && !isAuth}
                onClick={this.handleSave}>
                <Icon type='save' /> 确定 </Button>
            }
          </OperationComponent>
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
