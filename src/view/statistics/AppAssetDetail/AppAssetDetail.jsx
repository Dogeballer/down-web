import React, { useCallback, useMemo, useRef } from 'react'

import moment from 'moment'
import classnames from 'classnames'
import Filter from './component/Filter'
import AddEditModal from './component/AddEditModal'
import { Button, Divider, Popconfirm } from 'antd'
import { HeightKeepWrapper, Icon } from '@cecdataFE/bui'
import Table from '@cecdataFE/bui/dist/components/Ant4Table'
import { DATE_FORMAT, INIT_FILTER } from '../../../constant'
import { useFetch } from '../../../hooks/useFetch'
import {
  addAppAssetDetail,
  deleteAppAssetDetail,
  getAppAssetDetailPage,
  updateAppAssetDetail,
  updateDetailShowStatus
} from '../../../api/appAssetDetail'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import StatusSwitch from '../../../components/StatusSwitch'
import style from './style.scss'

const AppAssetDetail = () => {
  const filter = useRef({ ...INIT_FILTER })
  const { data, loading, pagination, request, setData } = useFetch(getAppAssetDetailPage, { ...filter.current })

  const columns = useMemo(() => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
        render: (value, record, idx) => idx + 1
      },
      {
        title: '应用资产名称',
        dataIndex: 'appAssetName',
        onCell: record => ({
          tooltip: () => record.appAssetName
        })
      },
      {
        title: '资产IP',
        dataIndex: 'appAssetIp',
        width: 150,
        onCell: record => ({
          tooltip: () => record.appAssetIp
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
        width: 100,
        render: (value, record) => (
          <StatusSwitch
            data={data}
            value={value}
            record={record}
            setData={setData}
            fetcher={updateDetailShowStatus}
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
          <div className='flex-center-vh'>
            <AddEditModal onOk={handleOk} record={record}>
              <Icon type='icon-bianji' style={{ fontSize: 24 }} />
            </AddEditModal>
            <Divider type='vertical' />
            <Popconfirm
              title='确定删除数据资产?'
              onConfirm={() => {
                handleDelete(record.id)
              }}
              okText='确定'
            >
              <Icon title='删除' type='icon-shanchu1' style={{ fontSize: 24 }} />
            </Popconfirm>
          </div>
        )
      }
    ]
    columns.forEach(v => {
      v.shouldCellUpdate = function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      }
    })
    return columns
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
    deleteAppAssetDetail(id)
      .then(() => {
        refresh()
      })
  }

  const handleOk = (values, record) => {
    let request = () => addAppAssetDetail(values)
    if (!isEmpty(record)) {
      request = () => updateAppAssetDetail(record.id, values)
    }
    request()
      .then(() => {
        refresh()
      })
  }
  return (
    <div className={style['app-detail-wrapper']}>
      <Filter onSubmit={handleSearch}>
        <AddEditModal onOk={handleOk}>
          <Button icon='plus' type='primary'>添加资产</Button>
        </AddEditModal>
      </Filter>
      <div
        className={classnames('smp-table-wrapper', style['app-detail-table'])}
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

export default AppAssetDetail
