import React, { useCallback, useRef } from 'react'

import moment from 'moment'
import classnames from 'classnames'
import {
  getDataAssetAcctPage,
  addDataAssetAcct,
  updateDataAssetAcct,
  updateAcctShowStatus,
  deleteDataAssetAcct
} from '../../../api/dataAssetAcct'
import Filter from './component/Filter'
import AddEditModal from './component/AddEditModal'
import { Button, Divider, Popconfirm } from 'antd'
import { HeightKeepWrapper } from '@cecdataFE/bui'
import Table from '@cecdataFE/bui/dist/components/Ant4Table'
import { DATE_FORMAT, INIT_FILTER } from '../../../constant'
import { useFetch } from '../../../hooks/useFetch'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import StatusSwitch from '../../../components/StatusSwitch'
import style from './style.scss'

const DataAssetAcct = () => {
  const filter = useRef({ ...INIT_FILTER })
  const { data, loading, pagination, request, setData } = useFetch(getDataAssetAcctPage, { ...filter.current })

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      fixed: 'left',
      width: 100,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      render: (value, record, idx) => idx + 1
    },
    {
      title: '账号名称',
      dataIndex: 'userName',
      width: 200,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.userName
      })
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
      title: '资产类型',
      dataIndex: 'dataStorageName',
      width: 200,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.dataStorageName
      })
    },
    {
      title: '来源方式',
      dataIndex: 'sourceMode',
      width: 150,
      align: 'center',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      }
    },
    {
      title: '操作人',
      dataIndex: 'operationUser',
      width: 150,
      align: 'center',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      }
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
        value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : ''
      )
    },
    {
      title: '是否展示',
      dataIndex: 'showStatus',
      align: 'center',
      width: 100,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      render: (value, record) => (
        <StatusSwitch
          data={data}
          value={value}
          record={record}
          setData={setData}
          fetcher={updateAcctShowStatus}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 136,
      align: 'center',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
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
    deleteDataAssetAcct(id)
      .then(() => {
        refresh()
      })
  }

  const handleOk = (values, record) => {
    let request = () => addDataAssetAcct(values)
    if (!isEmpty(record)) {
      request = () => updateDataAssetAcct(record.id, values)
    }
    request()
      .then(() => {
        refresh()
      })
  }
  return (
    <div className={style['data-acct-wrapper']}>
      <Filter onSubmit={handleSearch}>
        <AddEditModal onOk={handleOk}>
          <Button icon='plus' type='primary'>添加账号</Button>
        </AddEditModal>
      </Filter>
      <div
        className={classnames('smp-table-wrapper', style['data-acct-table'])}
      >
        <HeightKeepWrapper minus={108}>
          {
            (scrollY) => (
              <Table
                bordered
                rowKey='id'
                loading={loading}
                virtual={false}
                scroll={{ x: 1500, y: scrollY }}
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

export default DataAssetAcct
