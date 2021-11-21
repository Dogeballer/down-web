import React, { useCallback, useRef, useMemo } from 'react'

import moment from 'moment'
import classnames from 'classnames'
import Filter from './component/Filter'
import { Popconfirm, Divider, Button } from 'antd'
import { useFetch } from '../../../hooks/useFetch'
import {
  addDataAssetDetail,
  deleteDataAssetDetail,
  getDataAssetDetailPage,
  updateDataAssetDetail,
  updateDetailShowStatus
} from '../../../api/dataAssetDetail'
import { HeightKeepWrapper, thousandComma } from '@cecdataFE/bui'
import Table from '@cecdataFE/bui/dist/components/Ant4Table'
import { DATE_FORMAT, INIT_FILTER } from '../../../constant'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import AddEditModal from './component/AddEditModal'
import StatusSwitch from '../../../components/StatusSwitch'
import style from './style.scss'
import tableDataModify from '../../../lib/tableDataModify'

function DataAssetDetail () {
  const filter = useRef({ ...INIT_FILTER })
  const {
    data,
    loading,
    pagination,
    request,
    setData
  } = useFetch(getDataAssetDetailPage, { ...filter.current })
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      fixed: 'left',
      width: 100,
      render: (value, record, idx) => idx + 1
    },
    {
      title: '数据资产名称',
      dataIndex: 'dataAssetName',
      fixed: 'left',
      onCell: record => ({
        tooltip: () => record.dataAssetName
      })
    },
    {
      title: '资产IP',
      dataIndex: 'dataAssetIp',
      width: 150,
      onCell: record => ({
        tooltip: () => record.dataAssetIp
      })
    },
    {
      title: '目标端口',
      dataIndex: 'dataAssetPort',
      width: 100
    },
    {
      title: '库实例名',
      dataIndex: 'dataServerName',
      width: 200,
      onCell: record => ({
        tooltip: () => record.dataServerName
      })
    },
    {
      title: '资产类型',
      dataIndex: 'dataStorageName',
      width: 150
    },
    {
      title: '资产等级',
      dataIndex: 'dataLevel',
      align: 'center',
      width: 150
    },
    {
      title: '是否ODS',
      dataIndex: 'odsStatus',
      align: 'center',
      width: 100,
      render: (value) => (
        value !== undefined ? (value === 1 ? '是' : '否') : ''
      )
    },
    {
      title: '表数量',
      dataIndex: 'tableVolume',
      width: 150,
      align: 'center',
      render: (value) => (
        !isNaN(value) ? thousandComma(Number(value)) : ''
      )
    },
    {
      title: '数据量(万)',
      dataIndex: 'dataVolume',
      width: 150,
      align: 'center',
      render: (value) => !isNaN(value) ? thousandComma(Number(value.match(/^\d+(?:\.\d{0,2})?/))) : ''
    },
    {
      title: '来源方式',
      dataIndex: 'sourceMode',
      width: 100,
      align: 'center'
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
      render: (value) => (
        value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : ''
      )
    },
    {
      title: '是否展示',
      dataIndex: 'showStatus',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (value, record) => (
        <StatusSwitch
          value={value}
          fetcher={(value) => updateDetailShowStatus(record.id, value)}
          onFinish={(value) => {
            setData(tableDataModify(data, 'id', record, { showStatus: value }))
          }}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 136,
      align: 'center',
      render: (value, record) => (
        <>
          <AddEditModal onOk={handleOk} record={record}>
            <Button size='small' type='link'>编辑</Button>
          </AddEditModal>
          <Divider type='vertical' />
          <Popconfirm
            title='确定删除数据资产?'
            onConfirm={() => {
              handleDelete(record.id)
            }}
            okText='确定'
          >
            <Button className='btn-link-danger' size='small' type='link'>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ]
  useMemo(() => {
    columns.forEach(v => {
      v.shouldCellUpdate = function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      }
    })
  }, [])

  const refresh = useCallback(() => {
    filter.current = { ...filter.current, ...INIT_FILTER }
    request(filter.current)
  }, [])

  /**
   * 表格查询
   */
  const handleSearch = (params) => {
    filter.current = { ...filter.current, ...INIT_FILTER, ...params }
    request(filter.current)
  }

  /**
   * 表格发生变化时触发（分页、排序、过滤条件）
   */
  const handleTableChange = useCallback((pagination) => {
    const { current, pageSize } = pagination
    filter.current = { ...filter.current, page: current, limit: pageSize }
    request(filter.current)
  }, [])

  const handleDelete = (id) => {
    deleteDataAssetDetail(id)
      .then(() => {
        refresh()
      })
  }

  const handleOk = (values, record) => {
    let request = () => addDataAssetDetail(values)
    if (!isEmpty(record)) {
      request = () => updateDataAssetDetail(record.id, values)
    }
    request()
      .then(() => {
        refresh()
      })
  }

  return (
    <div className={style['data-detail-wrapper']}>
      <Filter onSubmit={handleSearch}>
        <AddEditModal onOk={handleOk}>
          <Button icon='plus' type='primary'>添加资产</Button>
        </AddEditModal>
      </Filter>
      <div
        className={classnames('smp-table-wrapper', style['data-detail-table'])}
      >
        <HeightKeepWrapper minus={108}>
          {
            (scrollY) => (
              <Table
                bordered
                rowKey='id'
                loading={loading}
                virtual={false}
                scroll={{ x: 2100, y: scrollY }}
                dataSource={data}
                columns={columns}
                pagination={pagination}
                onChange={handleTableChange}
              />
            )
          }
        </HeightKeepWrapper>
      </div>
    </div>
  )
}

export default DataAssetDetail
