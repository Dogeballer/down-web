import React, { useState, useEffect } from 'react'

import style from './style.scss'
import { Button } from 'antd'
import ProTable from '../../../components/ProTable/ProTable'

const DataGradeManage = (props) => {
  useEffect(() => {

  }, [])
  const columns = [
    {
      dataIndex: '',
      title: '分类名称'
    },
    {
      dataIndex: '',
      title: '分类编码'
    },
    {
      dataIndex: '',
      title: '缺省分级'
    },
    {
      dataIndex: '',
      title: '排序'
    },
    {
      dataIndex: '',
      title: '操作'
    }
  ]
  const querier = {
    buttons: [
      <Button key='create' type='primary'>新建分类</Button>,
      <Button key='delete' type='danger'>删除</Button>
    ]
  }
  return (
    <ProTable
      querier={querier}
      columns={columns}
    />
  )
}

export default DataGradeManage
