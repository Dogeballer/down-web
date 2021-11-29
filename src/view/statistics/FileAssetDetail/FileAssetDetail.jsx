import React, { useCallback, useRef } from 'react'

import moment from 'moment'
import classnames from 'classnames'
import Filter from './component/Filter'
import { HeightKeepWrapper } from '@cecdataFE/bui'
import Table from '@cecdataFE/bui/dist/components/Ant4Table'
import { DATE_FORMAT, INIT_FILTER } from '../../../constant'
import { useFetch } from '../../../hooks/useFetch'
import { getFileAssetDetailPage } from '../../../api/fileAssetDetail'
import style from './style.scss'

const FileAssetDetail = () => {
  const filter = useRef({ ...INIT_FILTER })
  const {
    data,
    loading,
    pagination,
    request
  } = useFetch(getFileAssetDetailPage, { ...filter.current })

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
      title: '文件名称',
      dataIndex: 'fileName',
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.fileName
      })
    },
    {
      title: '资产IP',
      dataIndex: 'fileServerIp',
      width: 180,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.fileServerIp
      })
    },
    {
      title: '文件路径',
      dataIndex: 'targetFilePath',
      width: 300,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      onCell: record => ({
        tooltip: () => record.targetFilePath
      })
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      align: 'center',
      width: 150,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
      shouldCellUpdate: function (record, prevRecord) {
        return record[this.dataIndex] !== prevRecord[this.dataIndex]
      },
      render: (value) => (
        value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : ''
      )
    }
  ]

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

  return (
    <div className={style['file-detail-wrapper']}>
      <Filter onSubmit={handleSearch} />
      <div
        className={classnames('smp-table-wrapper', style['file-detail-table'])}
      >
        <HeightKeepWrapper minus={108}>
          {
            (scrollY) => (
              <Table
                bordered
                rowKey='fileName'
                loading={loading}
                scroll={{ y: scrollY }}
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

export default FileAssetDetail
