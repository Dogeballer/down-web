import React, { Component } from 'react'
import { Form, Input, Modal, Select, Tabs, Button } from 'antd'
import moment from 'moment'
import classnames from 'classnames'
import NumericInput from '../NumericInput/NumericInput'
import { ETLLogStepDetail, ETLLogStepList } from '../../api/log'
import { isEmpty, getUnique } from '@fishballer/bui/dist/lib/utils'
import { getEvenRowClass } from '../../lib/utils'
import { StatusCreator, history, Table } from '@fishballer/bui'
import { STEP_EXECUTE_STATUS } from '../../constant'
import utilities from '../../style/utilities.scss'
import style from './style.scss'

const TabPane = Tabs.TabPane
const TextArea = Input.TextArea
const Option = Select.Option
const StepExecuteStatus = StatusCreator(STEP_EXECUTE_STATUS)

function DetailModal (props) {
  const {etlId, etlLogId, onCancel, ...modalProps} = props
  const handleOk = () => {
    history.push('/dm/etl/manage?etlId=' + etlId)
    onCancel()
  }
  return (
    <Modal
      visible
      centered
      className={style['log-detail-modal']}
      bodyStyle={{padding: 0, height: 'calc(90vh - 100px)', maxHeight: 860}}
      maskClosable={false}
      width={'90vw'}
      style={{maxWidth: 1400}}
      okText={'关闭'}
      footer={[
        <Button key='submit' type='primary' onClick={handleOk}>
          跳转ETL
        </Button>,
        <Button key='back' onClick={onCancel}>
          关闭
        </Button>
      ]}
      onCancel={onCancel}
      cancelButtonProps={{style: {display: 'none'}}}
      {...modalProps}>
      <EtlLogDetail etlLogId={etlLogId} />
    </Modal>
  )
}

class EtlLogDetail extends Component {
  state = {
    tableSource: [],
    formValues: {},
    selectedRowKey: null
  }
  columns = [
    {
      dataIndex: 'sequence',
      title: '序号'
    },
    {
      dataIndex: 'stepName',
      title: '步骤'
    },
    {
      dataIndex: 'targetDatabaseName',
      title: '目标库'
    },
    {
      dataIndex: 'targetTableName',
      title: '目标表'
    },
    {
      dataIndex: 'executeCount',
      title: '执行行数'
    },
    {
      dataIndex: 'taskStartTime',
      title: '任务开始时间',
      align: 'center',
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
    },
    {
      dataIndex: 'taskEndTime',
      title: '任务结束时间',
      align: 'center',
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
    },
    {
      dataIndex: 'executeStatus',
      title: '执行状态',
      align: 'center',
      render: (data) => (<StepExecuteStatus value={data} />)
    }
  ]
  formFields = [
    {
      dataIndex: 'scheduleId',
      title: '调度号'
    },
    {
      dataIndex: 'etlLogId',
      title: '日志号'
    },
    {
      dataIndex: 'etlId',
      title: 'ETL号'
    },
    {
      dataIndex: 'stepName',
      title: '步骤名称'
    },
    {
      dataIndex: 'targetDatabaseName',
      title: '目标库'
    },
    {
      dataIndex: 'targetTableName',
      title: '目标表'
    },
    {
      dataIndex: 'executeCount',
      title: '执行行数'
    },
    {
      dataIndex: 'executeStatusName',
      title: '执行状态'
    },
    {
      dataIndex: 'taskStartTime',
      title: '开始时间',
      type: 'time'
    },
    {
      dataIndex: 'taskEndTime',
      title: '结束时间',
      type: 'time'
    },
    {
      dataIndex: 'executeMessage',
      title: '执行信息',
      type: 'textarea'
    }
  ]
  componentDidMount () {
    this.tableFetch()
  }

  tableFetch () {
    ETLLogStepList(this.props.etlLogId)
      .then((response) => {
        const source = response.data.items || []
        source.forEach(record => {
          record.key = isEmpty(record.id) ? getUnique('etl-step') : record.id
        })
        this.setState({
          tableSource: source
        })
        if (!isEmpty(source)) {
          let firstRow = source[0]
          this.rowSelect(firstRow.key, firstRow)
        }
      })
  }

  detailFetch (id, sequence) {
    ETLLogStepDetail(id, this.props.etlLogId, sequence)
      .then((response) => {
        this.setState({
          formValues: response.data
        })
      })
  }

  rowSelect (key, record) {
    this.setState({selectedRowKey: key})
    this.detailFetch(record.id, record.sequence)
  }

  setRowClassName = (record, index) => {
    if (this.state.selectedRowKey === record.key) {
      return 'ant-table-row-selected'
    } else {
      return getEvenRowClass(index)
    }
  }

  render () {
    return (
      <Tabs
        size={'large'}
        className={classnames(utilities['page-tab'], style['log-detail'])}
        defaultActiveKey={'log'}
      >
        <TabPane key={'log'} tab={'详情日志'}>
          <div className={style['log-detail-section']} style={{paddingBottom: 12}}>
            <h3>执行步骤</h3>
            <Table
              bordered
              rowKey={'key'}
              scroll={{x: 1100}}
              columns={this.columns}
              pagination={false}
              dataSource={this.state.tableSource}
              rowClassName={(record, index) => this.setRowClassName(record, index)}
              onRow={record => {
                return { onClick: e => { this.rowSelect(record.key, record) } }
              }}
            />
          </div>
          <div className={style['log-detail-section'] + ' ' + style['detail']}>
            <Form
              layout={'inline'}
              className={style['detail-form']}
            >
              {this.formFields.map(({ dataIndex, title, type }) => {
                let value = this.state.formValues[dataIndex]
                value = (type === 'time' && value) ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value
                return (
                  <Form.Item
                    className={type === 'textarea' ? style['textarea-wrapper'] : null}
                    key={dataIndex}
                    label={title}
                  >
                    {type === 'textarea' ? (
                      <TextArea readOnly value={value} autoSize={false} />
                    ) : (
                      <Input readOnly style={{ width: '200px' }} value={value} />
                    )}
                  </Form.Item>
                )
              })}
            </Form>
          </div>
        </TabPane>
        <TabPane forceRender key={'info'} tab={'步骤信息'} style={{padding: 16}}>
          <Form layout={'inline'} className={style['step-info']}>
            <div>
              <Form.Item label={'名称'}>
                <Input
                  style={{width: '300px'}}
                  readOnly
                  value={this.state.formValues.stepName}
                  placeholder={'SQL脚本演示'}
                />
              </Form.Item>
              <Form.Item label='类型'>
                <Select
                  style={{width: '140px'}}
                  value={this.state.formValues.stepType}
                  disabled
                >
                  <Option value={3} key={3}>脚本</Option>
                  <Option value={4} key={4}>转换</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Select
                  style={{width: '140px'}}
                  value={this.state.formValues.stepSonType}
                  disabled
                >
                  <Option value={1} key={1}>SQL</Option>
                  <Option value={2} key={2}>电子病历解密</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={'顺序'}
                style={{ marginRight: 0 }}
              >
                <NumericInput
                  readOnly
                  value={this.state.formValues.sequence}
                  style={{ width: '100px' }}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label={'数据源'}
                style={{ marginRight: 0 }}
              >
                <Input
                  disabled
                  value={this.state.formValues.targetDatabaseName}
                  style={{ width: '300px', marginRight: '16px' }}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  disabled
                  value={this.state.formValues.targetTableName}
                  style={{ width: '300px' }}
                />
              </Form.Item>
            </div>
            <Form.Item
              className={style['textarea-wrapper']}
            >
              <TextArea
                readOnly
                value={this.state.formValues.etlScript}
              />
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    )
  }
}

export default DetailModal
