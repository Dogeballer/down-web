import React, { useCallback, useRef } from 'react'

import moment from 'moment'
import classnames from 'classnames'
import Filter from './component/Filter'
import AddEditModal from './component/AddEditModal'
import { Button } from 'antd'
import { HeightKeepWrapper } from '@cecdataFE/bui'
import Table from '@cecdataFE/bui/dist/components/Ant4Table'
import { DATE_FORMAT, INIT_FILTER } from '../../../constant'
import { useFetch } from '../../../hooks/useFetch'
import {
  addAppAssetAcct,
  getAppAssetAcctPage,
  updateAppAssetAcct,
  updateAcctShowStatus
} from '../../../api/appAssetAcct'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import StatusSwitch from '../../../components/StatusSwitch'
import style from './style.scss'
import tableDataModify from '../../../lib/tableDataModify'

const AppAssetAcct = () => {
  const filter = useRef({ ...INIT_FILTER })
  const { data, loading, pagination, request, setData } = useFetch(getAppAssetAcctPage, { ...filter.current })

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      fixed: 'left',
      width: 100,
      render: (value, record, idx) => idx + 1
    },
    {
      title: '账号名称',
      dataIndex: 'appAssetUser',
      width: 200,
      onCell: record => ({
        tooltip: () => record.appAssetUser
      })
    },
    {
      title: '应用资产名称',
      dataIndex: 'appAssetName',
      onCell: record => ({
        tooltip: () => record.appAssetName
      })
    },
    {
      title: '来源方式',
      dataIndex: 'sourceMode',
      width: 150,
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
      width: 150,
      render: (value, record) => (
        <StatusSwitch
          value={value}
          fetcher={(v) => updateAcctShowStatus(record.id, v)}
          onFinish={(v) => {
            setData(tableDataModify(data, 'id', record, { showStatus: v }))
          }}
        />
      )
    },
    {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (value, record) => (
        <AddEditModal onOk={handleOk} record={record}>
          <Button size='small' type='link'>编辑</Button>
        </AddEditModal>
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

  const handleOk = (values, record) => {
    let request = () => addAppAssetAcct(values)
    if (!isEmpty(record)) {
      request = () => updateAppAssetAcct(record.id, values)
    }
    request()
      .then(() => {
        refresh()
      })
  }
  return (
    <div className={style['app-acct-wrapper']}>
      <Filter onSubmit={handleSearch}>
        <AddEditModal onOk={handleOk}>
          <Button icon='plus' type='primary'>添加账号</Button>
        </AddEditModal>
      </Filter>
      <div
        className={classnames('smp-table-wrapper', style['app-acct-table'])}
      >
        <HeightKeepWrapper minus={108}>
          {
            (scrollY) => (
              <Table
                bordered
                rowKey='id'
                loading={loading}
                virtual={false}
                scroll={{ x: 1300, y: scrollY }}
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

export default AppAssetAcct
