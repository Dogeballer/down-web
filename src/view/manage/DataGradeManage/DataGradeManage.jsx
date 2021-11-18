import React, { useRef, useState } from 'react'
import { Button, Divider } from 'antd'
import ProTable from '../../../components/ProTable/ProTable'
import FormModal from './componnets/FormModal'
import DeleteButton from '../../../components/DeleteButton'

const DataGradeManage = (props) => {
  const [formVisible, setFromVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const tableRef = useRef()
  const currentRecord = useRef(null)
  const columns = [
    {
      dataIndex: 'assetClassName',
      title: '分类名称'
    },
    {
      dataIndex: 'assetClassCode',
      title: '分类编码'
    },
    {
      dataIndex: 'dataLevel',
      title: '缺省分级'
    },
    {
      dataIndex: 'sortNo',
      title: '排序'
    },
    {
      dataIndex: 'op',
      title: '操作',
      width: 220,
      align: 'center',
      render: (value, record) => (
        <>
          <Button
            size='small'
            type='link'
          >
            编辑
          </Button>
          <Divider type='vertical' />
          <Button
            size='small'
            type='link'
          >
            添加子分类
          </Button>
          <Divider type='vertical' />
          <DeleteButton
            size='small'
            handleDelete={() => (record.id)}
            onDeleted={() => tableRef.current?.refresh()}
          />
        </>
      )
    }
  ]
  const handleShowForm = (record) => {
    currentRecord.current = record ? { ...record } : null
    setFromVisible(true)
  }
  const querier = {
    buttons: [
      <Button key='create' type='primary' onClick={handleShowForm}>新建分类</Button>,
      <DeleteButton key='delete' type='danger' content='是否确认删除选中的分类？'>删除</DeleteButton>
    ]
  }

  return (
    <>
      <ProTable
        ref={tableRef}
        className='page-wrapper'
        querier={querier}
        columns={columns}
        rowKey='id'
        dataSource={[{ assetClassName: 'wqe' }]}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
      />
      <FormModal
        visible={formVisible}
        record={currentRecord.current}
        onCancel={() => setFromVisible(false)}
        onOk={() => tableRef.current?.refresh()}
      />
    </>
  )
}

export default DataGradeManage
