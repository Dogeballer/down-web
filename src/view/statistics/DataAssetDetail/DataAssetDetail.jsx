import React, { useState, useCallback} from 'react'

import moment from 'moment'
import classnames from 'classnames'
import Filter from './component/Filter'
import { Switch, Popconfirm, Icon } from 'antd'
import { useFetch } from '../../../hooks/useFetch'
import { Table, FixHeaderWrapper, StatusCreator } from '@cecdataFE/bui'
import { COMMON_STATUS, DATE_FORMAT, INIT_FILTER } from '../../../constant'
import style from './style.scss'

const Status = StatusCreator(COMMON_STATUS)
function DataAssetDetail () {
  const [filter, setFilter] = useState({ ...INIT_FILTER })
  const { data, loading, pagination, setData } = useFetch(null, { ...filter });

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      fixed: 'left',
      width: 100
    },
    {
      title: '数据资产名称',
      dataIndex: 'dataAssetName',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.dataAssetName
      })
    },
    {
      title: '资产IP',
      dataIndex: 'dataAssetIp',
      width: 150,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.dataAssetIp
      })
    },
    {
      title: '目标端口',
      dataIndex: 'dataAssetHost',
      width: 100,
      align: 'center',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.dataAssetHost
      })
    },
    {
      title: '库实例名',
      dataIndex: 'dataServerName',
      width: 200,
      align: 'center',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.dataServerName
      })
    },
    {
      title: '资产类型',
      dataIndex: 'dataStorageName',
      width: 100,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.dataStorageName
      })
    },
    {
      title: '资产等级',
      dataIndex: 'dataLevel',
      align: 'center',
      width: 100,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      }
    },
    {
      title: '来源方式',
      dataIndex: 'sourceMode',
      width: 100,
      align: 'center',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      align: 'center',
      fixed: 'right',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      render: (value, record) => (
        <Status
          value={value}
          style={{ cursor: 'pointer', color: '#6b6b6b' }}
          onClick={() => {
            handleStatusChange(value ? 0 : 1, record)
          }}
        />
      )
    },
    {
      title: '操作人',
      dataIndex: 'operationUser',
      width: 150,
      align: 'center'
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      align: 'center',
      width: 184,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      render: (value) => (
        value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : '--'
      )
    },
    {
      title: '是否展示',
      dataIndex: 'showStatus',
      align: 'center',
      width: 100,
      render: (value, record) => (
        <Switch
          checked={!!value}
          checkedChildren='开'
          unCheckedChildren='关'
          onChange={() => {
            handleShowStatusChange(value ? 0 : 1, record)
          }}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (value, record, index) => (
        <div className='flex-center-vh'>
          <Popconfirm
            title='确定删除数据资产?'
            onConfirm={() => {
              handleDelete(record.id)
            }}
            okText='确定'
          >
            <Icon
              title='删除'
              position={index}
              type='icon-shanchu1'
              style={{ fontSize: 24 }}
            />
          </Popconfirm>
        </div>
      )
    }
  ]

  const handleDelete = (id) => {

  }

  const handleShowStatusChange = (showStatus, record) => {
    // updateDataStatus(record.id, { showStatus })
    //   .then(() => {
    //   })
  }

  const handleStatusChange = (status, record) => {
    // updateDataStatus(record.id, { status })
    //   .then(() => {
    //   })
  }

  /**
   * 表格刷新
   */
  const refresh = useCallback(() => {
    setFilter((prev) => ({ ...prev, ...INIT_FILTER }));
  }, [])

  /**
   * 表格发生变化时触发（分页、排序、过滤条件）
   */
  const handleTableChange = useCallback((pagination) => {
    const { current, pageSize } = pagination
    setFilter((prev) => ({ ...prev, page: current, limit: pageSize }))
  }, [])

  /**
   * 表格查询
   */
  const handleSearch = (params) => {
    setFilter((prev) => ({ ...prev, ...INIT_FILTER, ...params }));
  }

  return (
    <div className={style['data-detail-wrapper']}>
      <Filter onSubmit={handleSearch} />
      <div
        className={classnames('smp-table-wrapper', style['data-detail-table'])}
      >
        <FixHeaderWrapper siblingsHeight={0} footerHeight={32}>
          {
            (scrollY) => <Table
              bordered
              rowKey='id'
              loading={loading}
              scroll={{x: 1680, y: scrollY}}
              dataSource={data}
              pagination={pagination}
              columns={columns}
              onChange={handleTableChange}
            />
          }
        </FixHeaderWrapper>
      </div>
    </div>
  )
}

export default DataAssetDetail
