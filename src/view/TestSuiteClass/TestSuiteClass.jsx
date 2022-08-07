import React, { Component, Fragment } from 'react'
import { Button, Divider, Modal, Popconfirm, Table } from 'antd'

import classnames from 'classnames'
import testSuiteAPI from '../../api/testsuite'
import IconFont from '../../components/Iconfont'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import { treeForeach as treeEach } from '@fishballer/bui/dist/lib/tree'
import { removeEmptyChildren } from '../../lib/utils'
import { StatusCreator } from '@fishballer/bui'
import constant from '../../constant'
import TestSuiteClassForm from './components/TestSuiteClassForm'
import utilities from '../../style/utilities.scss'
import PageHeader from '../../components/PageHeader'
import FixHeaderWrapper from '../../components/FixHeaderWrapper'
// import Table from '../../components/Table'

const DispatchStatus = StatusCreator(constant.COMMON_STATUS)

class TestSuiteClass extends Component {
  constructor () {
    super()
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        width: 340,
        render: (value, record) => <Fragment>
          <span>{`${record.name} `}</span>
          <span style={{ color: 'rgba(0,0,0,0.25)' }}>(ID: {record.id})</span>
        </Fragment>
      },
      {
        title: '分类编码',
        dataIndex: 'code',
        width: 300,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        render: (text, record) => text || '--'
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 300,
        shouldCellUpdate: function (record, prevRecord) {
          return record[this.dataIndex] !== prevRecord[this.dataIndex]
        },
        render: (text, record) => text || '--'
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: (data, record) => (
          <DispatchStatus
            value={data}
            style={{ cursor: 'pointer', color: '#6b6b6b', opacity: 0.65 }}
            onClick={() => {
              this.statusSaveHandler(!data, record)
            }}
          />
        )
      },
      {
        title: '操作',
        dataIndex: 'op',
        fixed: 'right',
        width: 200,
        align: 'center',
        onCell: record => ({
          className: utilities['opt-display-center']
        }),
        render: (data, record, index) => (
          <React.Fragment>
            <IconFont
              title={'编辑'}
              position={index}
              type={'icon-bianji'}
              style={{ fontSize: 24 }}
              onClick={() => {
                this.setState({
                  visible: true,
                  dispatchEditPropsData: { ...record }
                })
              }}
            />
            <Divider type='vertical'/>
            <IconFont
              title={'增加子分类'}
              position={index}
              type={record.status === false ? 'icon-zengjia' : 'icon-zengjia1'}
              className={record.status === false ? utilities['opt-disabled'] : ''}
              style={{ fontSize: 24 }}
              onClick={() => {
                if (record.status !== false) {
                  this.setState({
                    visible: true,
                    dispatchEditPropsData: { parent: record.id }
                  })
                }
              }}
            />
            <Divider type='vertical'/>
            {
              <Popconfirm
                title='确定要删除吗?'
                onConfirm={() => {
                  this.onDeleteHandler(record)
                }}
                okText={'删除'}
                placement='topRight'
              >
                <IconFont
                  title={'删除'}
                  position={index}
                  type={'icon-shanchu1'}
                  style={{ fontSize: 24 }}
                  className={''}
                />
              </Popconfirm>
            }
          </React.Fragment>
        )
      }
    ]
  }

  selectedRows = []
  state = {
    selectedRowKeys: [],
    loading: false,
    tableSource: [],
    visible: false,
    dispatchEditPropsData: {}
  }

  componentDidMount () {
    this.getData()
  }

  getData = () => {
    testSuiteAPI.getTestSuiteClassList().then(response => {
      removeEmptyChildren(response.data.items)
      this.setState({ tableSource: response.data.items })
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.selectedRows = selectedRows
    this.setState({ selectedRowKeys })
  }

  statusSaveHandler = (status, row) => {
    testSuiteAPI.updateTestSuiteClassStatus(row.id)
      .then((response) => {
        if (response.code === 0) {
          const newData = [...this.state.tableSource]
          treeEach(newData, (data) => {
            if (data.id === row.id) {
              data.status = status
            }
          })
          this.setState({ tableSource: newData })
        }
      })
  }

  onDeleteHandler = (record) => {
    if (isEmpty(record.children)) {
      testSuiteAPI.deleteTestSuiteClass(record.id)
        .then((response) => {
          if (response.code === 0) {
            this.getData()
          }
        })
    } else {
      Modal.warning({
        centered: true,
        title: '提示',
        content: '当前分类存在分类，请先将其删除或转移至其他分类下'
      })
    }
  }

  render () {
    return (
      <div style={{ height: '100%' }}>
        <PageHeader title={'测试套件分类'}/>
        <div className={classnames(utilities['table-wrapper'], utilities['page-content'])}>
          <div className={utilities['table-button-group']}>
            <Button
              type='primary'
              onClick={() => {
                this.setState({
                  dispatchEditPropsData: {},
                  visible: true
                })
              }}>
              <IconFont type={'icon-addcopy'}/>
              新建分类
            </Button>
          </div>
          <FixHeaderWrapper minusHeight={48} tableFooterHeight={0}>
            {
              (scrollY) => <Table
                virtual={false}
                bordered
                ref={ref => { this.table = ref }}
                indentSize={24}
                loading={this.state.loading}
                dataSource={this.state.tableSource}
                columns={this.columns}
                rowKey={'id'}
                scroll={{ y: scrollY }}
                pagination={false}
              />
            }
          </FixHeaderWrapper>
          {
            this.state.visible ? (
              <TestSuiteClassForm
                data={this.state.dispatchEditPropsData}
                visible={this.state.visible}
                getData={this.getData}
                onOk={() => { this.setState({ visible: false }) }}
                onCancel={() => { this.setState({ visible: false }) }}
              />
            ) : null
          }
        </div>
      </div>
    )
  }
}

export default TestSuiteClass
