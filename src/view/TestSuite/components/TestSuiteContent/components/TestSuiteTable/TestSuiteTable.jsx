import React, { Component } from 'react'

import {
  Divider,
  Popconfirm,
  Button,
  Modal,
  message,
  Table
} from 'antd'
import moment from 'moment'
import classnames from 'classnames'
import IconFont from '../../../../../../components/Iconfont'
import NumericInput from '../../../../../../components/NumericInput/NumericInput'
// import { treeForeach as treeEach } from '@fishballer/bui/dist/lib/tree'
import constant, { PERMS_IDENTS, INIT_PAGINATION } from '../../../../../../constant'
import testSuiteAPI from '../../../../../../api/testsuite'
import utilities from '../../../../../../style/utilities.scss'
import { StatusCreator } from '@fishballer/bui'
import FixHeaderWrapper from '../../../../../../components/FixHeaderWrapper'
import { treeForeach as treeEach } from '@fishballer/bui/dist/lib/tree'
// import Table from '../../../../../../components/Table'

const {
  PAGE_SIZE,
  COMMON_STATUS
} = constant

const { confirm } = Modal

const RuleStatus = StatusCreator(COMMON_STATUS)

class TestSuiteTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      loading: false,
      selectedRowKeys: [],
      pagination: { ...INIT_PAGINATION }
    }
    this.filter = {
      limit: PAGE_SIZE,
      current: 1
    }

    this.columns = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.id
        })
      },
      {
        title: '套件名称',
        key: 'name',
        dataIndex: 'name',
        width: 250,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          onClick: () => this.handleItemEdit(record),
          className: utilities['op-span'],
          tooltip: () => record.name
        })
      },
      {
        title: '模式',
        key: 'mode',
        dataIndex: 'mode',
        width: 150,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.mode
        })
      },
      {
        title: '执行环境',
        key: 'environment',
        dataIndex: 'environment',
        width: 200,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.environment
        })
      },
      // {
      //   title: '类型',
      //   key: 'type',
      //   dataIndex: 'type',
      //   width: 150,
      //   shouldCellUpdate: function (record, prevRecord) {
      //     return record[this.dataIndex] !== prevRecord[this.dataIndex]
      //   },
      //   onCell: record => ({
      //     tooltip: () => record.type
      //   })
      // },
      {
        title: '执行时间',
        key: 'timing',
        dataIndex: 'timing',
        align: 'center',
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        // render: (value) => value ? moment(value).format('HH:mm') : '--'
        render: (value) => value ? value : '--'
      }, {
        title: '线程数',
        key: 'thread_count',
        dataIndex: 'thread_count',
        align: 'center',
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        onCell: record => ({
          tooltip: () => record.thread_count
        })
      },
      {
        title: '状态',
        key: 'status',
        align: 'center',
        fixed: 'right',
        width: 100,
        dataIndex: 'status',
        shouldCellUpdate: function (record, prevRecord) {
          return record !== prevRecord
        },
        render: (data, record) =>
          <RuleStatus
            value={data}
            style={{ cursor: 'pointer', color: '#6b6b6b', opacity: 0.65 }}
            onClick={() => {
              this.statusSaveHandler(!data, record)
            }}
          />
      },
      {
        title: '操作',
        dataIndex: 'operate',
        fixed: 'right',
        width: 120,
        align: 'center',
        render: (value, record, index) => this.actionButtons(record, index)
      }
    ]
  }

  componentDidMount () {
    const { currentPage, currentClassId } = this.props
    this.filter.suite_class = currentClassId
    this.filter.current = currentPage
    this.getData(this.filter)
  }

  componentDidUpdate = prevProps => {
    if (prevProps.currentClassId === this.props.currentClassId) return
    this.filter.current = 1
    this.filter.suite_class = this.props.currentClassId
    this.getData(this.filter)
  }

  componentWillUnmount = () => {
  }

  getData = (params = this.filter) => {
    this.setState({ loading: true })
    testSuiteAPI.getTestSuiteList(params)
      .then(({ data }) => {
        this.setState({
          loading: false,
          data: data.items,
          pagination: {
            ...this.state.pagination,
            total: data.total,
            current: this.filter.current
          }
        })
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  }

  /**
   * 点击多选框
   */
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  /**
   * 表格发生变化时触发（分页、排序、过滤条件）
   */
  handleTableChange = (page) => {
    const currentPage = page.current
    // 设置当前页
    this.filter.current = currentPage
    this.props.setCurrentPage(currentPage)
    this.getData(this.filter)
  }

  statusSaveHandler = (status, row) => {
    testSuiteAPI.updateTestSuiteStatus(row.id)
      .then((response) => {
        if (response.code === 0) {
          const newData = [...this.state.data]
          const index = newData.findIndex(data => data.id === row.id)
          if (~index) {
            newData[index] = { ...newData[index], status }
          }
          this.setState({ data: newData })
        }
      })
  }

  handleItemEdit = record => {
    this.props.setCurrentNode({ type: 3, suiteId: record.id })
  }

  handleItemDelete = record => {
    testSuiteAPI.deleteTestSuite([record.id])
      .then((response) => {
        if (response.code === 0) {
          this.getData(this.filter)
        }
      })
  }

  /**
   * 表格的操作按钮
   */
  actionButtons = (record, index) => (
    <React.Fragment>
      <IconFont
        title={'编辑'}
        position={index}
        type={'icon-bianji'}
        style={{ fontSize: 24 }}
        onClick={() => this.handleItemEdit(record)}
      />
      <Divider type='vertical'/>
      <Popconfirm
        title={`确定要删除吗?`}
        onConfirm={() => {
          this.handleItemDelete(record)
        }}
        okText='删除'
      >
        <IconFont
          title={'删除'}
          position={index}
          type={'icon-shanchu1'}
          style={{ fontSize: 24 }}
        />
      </Popconfirm>
    </React.Fragment>
  )

  /**
   * 批量删除
   */
  handleBatchDel = () => {
    const {
      selectedRowKeys
    } = this.state
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选中一个测试套件')
      return
    }
    confirm({
      title: '提示',
      content: '确认批量删除选择的测试套件？',
      okText: '确认',
      okButtonProps: {
        type: 'primary'
      },
      cancelText: '取消',
      onOk: () => {
        // console.log({ selectedRowKeys })
        testSuiteAPI.batchDeleteTestSuite(selectedRowKeys)
          .then((response) => {
            if (response.code === 0) {
              this.getData(this.filter)
              this.setState({ selectedRowKeys: [] })
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
      pagination,
      selectedRowKeys
    } = this.state
    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true
    }
    return (
      <div className={classnames(utilities['table-wrapper'], utilities['page-content'])}>
        <div className={utilities['table-button-group']}>
          <Button
            icon='plus'
            type='primary'
            onClick={() => this.props.setCurrentNode({ type: 2, suiteId: '' })}
          >
            新增套件
          </Button>
          <Button
            onClick={this.handleBatchDel}
          >
            批量删除
          </Button>
        </div>
        <FixHeaderWrapper minusHeight={48} tableFooterHeight={32}>
          {
            (scrollY) => <Table
              size={'middle'}
              bordered
              rowKey={'id'}
              loading={loading}
              scroll={{ x: 1400, y: scrollY }}
              dataSource={data}
              pagination={pagination}
              columns={this.columns}
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          }
        </FixHeaderWrapper>
      </div>
    )
  }
}

export default TestSuiteTable
