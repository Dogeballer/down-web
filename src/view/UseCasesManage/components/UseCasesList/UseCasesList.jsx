import { Modal, Table, Divider, Card, Button, Popconfirm, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import UseCasesApi from '../../../../api/usecases'
import { StatusCreator } from '@fishballer/bui'
import utilities from '../../../../style/utilities.scss'
import IconFont from '../../../../components/Iconfont'
import moment from 'moment'
import Filter from '../../../../components/Filter/Filter'
import TableContainer from '../../../../components/GetTableHeight'
import EllipsisText from '../../../../components/EllipsisText'
import { isEmpty } from '../../../../lib/utils'
import ManualExecuteForm from './components/ManualExecuteForm'
import ProjectForm from '../../../ProjectModule/components/ProjectsManage/components/ProjectForm'

const TypeStatus = StatusCreator([
  { color: '#1890FF', text: '正常', value: true },
  { color: '#F5222D', text: '禁用', value: false }
])

const FILTER_STATUS = [
  { value: true, text: '正常', color: '#1890FF' },
  { value: false, text: '禁用', color: '#F5222D' }
]

const UseCasesList = (props) => {
  const defaultPagination = {
    pageSize: 20
  }
  const pageParam = {
    page: 1,
    limit: 20,
  }
  const { searchValue } = props
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState([])
  const [filtersValue, setFiltersValue] = useState({})
  const [casesList, setCasesList] = useState([])
  let [refreshKey, setRefreshKey] = useState(0)
  const [pagination, setPagination] = useState({ ...defaultPagination })
  const [selectedRowKeys, setselectedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({})
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setselectedRowKeys(selectedRowKeys)
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }

  const caseType = [
    { value: 0, text: '正向用例' },
    { value: 1, text: '异常用例' },
    { value: 2, text: '场景用例' },
    { value: 3, text: '流程用例' },
  ]
  const Filters = [
    {
      type: 'input',
      name: 'name',
      config: {
        initialValue: ''
      },
      attr: {
        placeholder: '用例名称',
        allowClear: true
      }
    },
    {
      type: 'input',
      name: 'user',
      config: {
        initialValue: ''
      },
      attr: {
        placeholder: '维护者',
        allowClear: true
      }
    },
    {
      type: 'select',
      name: 'type',
      attr: {
        placeholder: '类型',
        allowClear: true,
        style: {
          width: 100
        },
        option: caseType.map(item => {
          return ({
            value: item.value,
            key: item.value,
            text: item.text
          })
        })
      }
    },
    {
      type: 'select',
      name: 'status',
      attr: {
        placeholder: '状态',
        allowClear: true,
        style: {
          width: 100
        },
        option: FILTER_STATUS.map(item => {
          return ({
            value: item.value,
            key: item.value,
            text: item.text
          })
        })
      }
    }
  ]
  const columns = [
    {
      title: '用例名称',
      dataIndex: 'name',
      sorter: true,
      render: (data, record) => (
        <React.Fragment>
          <a onClick={() => props.useCaseDetailInter(record.id)}>{data}</a> <span
          style={{ color: 'rgba(0,0,0,0.25)' }}>(ID:{record.id})</span>
        </React.Fragment>
      ),
      width: 300,
    },
    {
      title: '用例类型',
      dataIndex: 'type',
      width: 200,
      render: (value) => <EllipsisText value={value} width={284}/>
    },
    {
      title: '用例描述',
      dataIndex: 'describe',
      width: 250,
      render: (value) => <EllipsisText value={value} width={234}/>
    }, {
      title: '维护人员',
      dataIndex: 'user',
      width: 150,
      render: (value) => <EllipsisText value={value} width={234}/>
    },
    {
      title: '添加时间',
      dataIndex: 'create_time',
      width: 200,
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      width: 200,
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
    },
    {
      title: '用例状态',
      dataIndex: 'status',
      width: 150,
      // align: 'center',
      align: 'center',
      // fixed: 'right',
      render: (data, record) => (<TypeStatus
        value={data}
        style={{ cursor: 'pointer', color: '#6b6b6b' }}
        onClick={() => {
          const { id } = record
          UseCasesApi.updateUseCaseStatus(id)
            .then(() => {
              fetch({
                ...pagination,
                ...filtersValue,
                ...searchValue
              })
            })
        }}
      />)
    },
    {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 150,
      align: 'center',
      render: (data, record, index) => (
        <div className={utilities['opt-dispaly-center']}>
          <IconFont
            title={'编辑'}
            position={index}
            type={'icon-bianji'}
            className={utilities['opt-disabled']}
            style={{ fontSize: 24 }}
            onClick={
              () => props.useCaseDetailInter(record.id)
            }
          />
          <Divider type='vertical'/>
          <Popconfirm
            title='确定要删除吗?'
            onConfirm={() => {
              UseCasesApi.deleteUseCase(record.id)
                .then(() => {fetch({ ...pagination })})
            }}
            okText={'删除'}
            placement='topRight'
          >
            <IconFont
              title={'删除'}
              position={index}
              type={'icon-shanchu1'}
              style={{ fontSize: 24 }}
              className={utilities['opt-disabled']}
            />
          </Popconfirm>
          <Divider type='vertical'/>
          <Popconfirm
            title='确定要复制当前用例?'
            onConfirm={() => {
              UseCasesApi.copyUseCase({ 'caseId': record.id })
                .then(() => {fetch({ ...pagination })})
            }}
            okText={'确定'}
            placement='topRight'
          >
            <IconFont
              title={'复制'}
              position={index}
              type={'icon-fuzhi'}
              style={{ fontSize: 24 }}
              className={utilities['opt-disabled']}
            />
          </Popconfirm>
        </div>
      )
    }
  ]
  const createFilter = () => {
    setFilters(Filters)
  }
  useEffect(() => {
    fetch({ ...pageParam, ...searchValue })
    createFilter()
  }, [props])
  const fetch = (params = {}) => {
    // console.log('params:', params)
    setLoading(true)
    setRefreshKey(refreshKey++)
    UseCasesApi.getUseCasesList(params).then(data => {
      const newPagination = { ...defaultPagination }
      // Read total count from server
      newPagination.total = data.total
      setCasesList(data.data.items)
      setLoading(false)
      setPagination({ ...newPagination })
    })
  }

  const handleSearch = value => {
    setFiltersValue({ ...value })
    setPagination({ ...defaultPagination })
    fetch({
      ...pageParam
      , ...value
      , ...searchValue
    })
  }
  const handleTableChange = (pagination, sorter) => {
    const pager = { ...pagination }
    pager.current = pagination.current
    setPagination(pager)
    fetch({
      page: pagination.current,
      limit: 20,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filtersValue,
      ...searchValue
    })
  }
  const showModal = () => {
    setVisible(true)
  }
  const buttons = (
    <div className={utilities['table-button-group']} style={{ marginBottom: 0 }}>
      <Button
        type={'primary'}
        onClick={() => {isEmpty(selectedRowKeys) ? message.info('请选择要执行的用例') : showModal()}}>
        <IconFont type={'icon-shoudong'}/> 立即执行 </Button>
      <Button
        type={'primary'}
        onClick={props.addCase}>
        <IconFont type={'icon-addcopy'}/> 新增用例 </Button>
    </div>
  )

  return (
    <div style={{ background: '#ECECEC' }}>
      <Card title="用例列表" bordered={false} style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBlockEnd: 15 }}
          // ref={ref => { formRef = ref }}
        >
          <Filter
            fields={filters}
            onSubmit={handleSearch}
          />
          {buttons}
        </div>
        <TableContainer
          // form={formRef}
          onResize={() => {
            setRefreshKey(++refreshKey)
          }}
          refreshKey={refreshKey}
        >
          {
            height => <Table
              rowSelection={rowSelection}
              size="middle"
              bordered
              columns={columns}
              rowKey={record => record.id}
              dataSource={casesList}
              pagination={pagination}
              loading={loading}
              onChange={handleTableChange}
              scroll={{ x: 1550, y: height }}
            />
          }
        </TableContainer>
        <ManualExecuteForm
          data={formData}
          visible={visible}
          selectedRowKeys={selectedRowKeys}
          onOk={() => {
            setVisible(false)
          }}
          onCancel={() => {
            setVisible(false)
          }}
        />
      </Card>
    </div>
  )
}

export default UseCasesList