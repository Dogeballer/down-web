import React, { Component, useEffect, useState } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import utilities from '../../../../style/utilities.scss'
import TableModule from '../../../../components/TableModule'
import ExcuseLogFilter from './components/Filter'
import IconFont from '../../../../components/Iconfont'
import TaskLogApi from '../../../../api/tasklog'
// import DetailModal from '../../../../components/DetailModal'
import { StatusCreator } from '@fishballer/bui'
import style from './style.scss'
import { Modal, Divider, Card, Table } from 'antd'
import EllipsisText from '../../../../components/EllipsisText'
import { DATE_FORMAT, PERMS_IDENTS } from '../../../../constant'
import UseCasesApi from '../../../../api/usecases'
import Filter from '../../../../components/Filter/Filter'
import TableContainer from '../../../../components/GetTableHeight'
import ManualExecuteForm from '../../../UseCasesManage/components/UseCasesList/components/ManualExecuteForm'
import { isEmpty, timestampFormat } from '../../../../lib/utils'
import DetailLogModal from '../DetailLogModal'
import myHistory from '../../../../route/history'

export const EXECUTE_STATUS = [
  {
    value: 0,
    color: '#F5222D',
    text: '执行失败'
  },
  {
    value: 2,
    color: '#52C41A',
    text: '正在执行'
  },
  {
    value: 1,
    color: '#1890FF',
    text: '执行成功'
  },
]

const ExecuteStatus = StatusCreator(EXECUTE_STATUS)
const query = myHistory.getQuery()

const ExecuteLog = (props) => {
  const defaultPagination = {
    pageSize: 20
  }
  const pageParam = {
    page: 1,
    limit: 20,
  }
  const [searchValue, setSearchValue] = useState(props.searchValue)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState([])
  const [filtersValue, setFiltersValue] = useState({})
  const [caseLogList, setCaseLogList] = useState([])
  let [refreshKey, setRefreshKey] = useState(0)
  const [pagination, setPagination] = useState({ ...defaultPagination })
  const [formData, setFormData] = useState({})
  const [logDate, setLogDate] = useState(props.logDate)
  const [detailVisible, setDetailVisible] = useState(false)
  const [caseLogId, setCaseLogId] = useState()
  const [caseLog, setCaseLog] = useState()
  const columns = [
    {
      title: '日志ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 80,
      render: (value) => <EllipsisText value={value} width={64}/>
    }, {
      title: '用例名',
      dataIndex: 'use_case.name',
      // width: 200,
      render: (value) => <EllipsisText value={value} width={284}/>
    },
    {
      title: '任务开始时间',
      dataIndex: 'start_time',
      align: 'center',
      width: 200,
      render: (value) => value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : '--'
    },
    {
      title: '任务结束时间',
      dataIndex: 'end_time',
      align: 'center',
      width: 200,
      render: (value) => value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : '--'
    },
    {
      title: '耗时',
      dataIndex: 'spend_time',
      align: 'center',
      width: 100,
      render: (value) => <EllipsisText value={timestampFormat(value)} width={84}/>
    },
    {
      title: '成功数',
      dataIndex: 'success_count',
      width: 80,
      render: (value) => <EllipsisText value={value} width={64}/>
    },
    {
      title: '失败数',
      dataIndex: 'failed_count',
      width: 80,
      render: (value) => <EllipsisText value={value} width={64}/>
    },
    {
      title: '执行状态',
      dataIndex: 'execute_status',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (data) => (<ExecuteStatus value={data}/>)
    },
    {
      title: '详情',
      dataIndex: 'detail',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (data, record, index) => (
        record.id ? (
          <div className={utilities['opt-display-center']}>
            <IconFont
              title={'详细日志'}
              position={index}
              type={'icon-liulan1'}
              className={classnames(utilities['op-span'])}
              style={{ fontSize: 24 }}
              onClick={() => {
                setCaseLogId(record.id)
                setCaseLog(record.use_case.id)
                showLogDetail()
              }}
            />
          </div>) : null
      )
    }
  ]
  const Filters = [
    {
      type: 'date',
      name: 'execute_date',
      config: {
        initialValue: moment(logDate)
      },
      attr: {
        placeholder: '执行时间',
        allowClear: false
      }
    },
    {
      type: 'select',
      name: 'execute_status',
      attr: {
        placeholder: '执行状态',
        allowClear: true,
        style: {
          width: 150
        },
        option: EXECUTE_STATUS.map(item => {
          return ({
            value: item.value,
            key: item.value,
            text: item.text
          })
        })
      }
    },
  ]
  const createFilter = () => {
    setFilters(Filters)
  }
  useEffect(() => {
    const { task_log } = props.searchValue
    if (query.query.job_id) {
      if (task_log) {
        setSearchValue(props.searchValue)
        fetch({ ...pageParam, ...props.searchValue })
      } else {
        setSearchValue({ job_id: query.query.job_id })
        fetch({ ...pageParam, job_id: query.query.job_id })
      }
    } else {
      setSearchValue(props.searchValue)
      fetch({ ...pageParam, ...props.searchValue })
    }
    createFilter()
  }, [props.searchValue])
  const fetch = (params = {}) => {
    // console.log('params:', params)
    setLoading(true)
    setRefreshKey(refreshKey++)
    TaskLogApi.caseLogPageList(params).then(data => {
      const newPagination = { ...defaultPagination }
      // Read total count from server
      newPagination.total = data.total
      setCaseLogList(data.data.items)
      setLoading(false)
      setPagination({ ...newPagination })
    })
  }
  const handleSearch = value => {
    value.execute_date = !isEmpty(value.execute_date) && value.execute_date.valueOf()
    const { execute_date } = value
    console.log(value)
    setFiltersValue({ ...value })
    setPagination({ ...defaultPagination })
    fetch({
      ...pageParam
      , ...searchValue
      , ...value
    })
    setLogDate(execute_date)
    props.onLogDateChange(execute_date)
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
      ...searchValue,
      ...filtersValue,
    })
  }
  const showLogDetail = () => {
    setDetailVisible(true)
  }
  return (
    <div style={{ padding: 9 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBlockEnd: 15 }}
        // ref={ref => { formRef = ref }}
      >
        <Filter
          fields={filters}
          onSubmit={handleSearch}
        />
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
            size="middle"
            bordered
            columns={columns}
            rowKey={record => record.id}
            dataSource={caseLogList}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 1140, y: height }}
          />
        }
      </TableContainer>
      <DetailLogModal
        caseLogId={caseLogId}
        caseId={caseLog}
        visible={detailVisible}
        onOk={() => { setDetailVisible(false) }}
        onCancel={() => { setDetailVisible(false) }}
      />
    </div>
  )
}

export default ExecuteLog
