import React, { useRef, useState } from 'react'
import { Button, Divider } from 'antd'
import ProTable from '../../../components/ProTable/ProTable'
import FormModal from './componnets/FormModal'
import DeleteButton from '../../../components/DeleteButton'
import { HeightKeepWrapper } from '@cecdataFE/bui'
import { dataGradeDelete, dataGradeTree } from '../../../api/dataGrade'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'

const DataGradeManage = () => {
  const [formVisible, setFromVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const tableRef = useRef()
  const currentRecord = useRef(null)
  const columns = [
    {
      dataIndex: 'assetClassName',
      title: '分类名称',
      fixed: 'left'
    },
    {
      dataIndex: 'assetClassCode',
      title: '分类编码',
      width: 150
    },
    {
      dataIndex: 'dataLevel',
      title: '缺省分级',
      width: 150,
      align: 'center'
    },
    {
      dataIndex: 'sortNo',
      title: '排序',
      width: 100,
      align: 'right'
    },
    {
      dataIndex: 'op',
      title: '操作',
      width: 220,
      align: 'center',
      fixed: 'right',
      render: (value, record) => (
        <>
          <Button
            size='small'
            type='link'
            onClick={() => handleShowForm(record)}
          >
            编辑
          </Button>
          <Divider type='vertical' />
          <Button
            size='small'
            type='link'
            onClick={() => handleShowForm({ parentAssetClass: record.assetClassName })}
          >
            添加子分类
          </Button>
          <Divider type='vertical' />
          <DeleteButton
            size='small'
            pop
            handleDelete={() => dataGradeDelete(record.assetClassName)}
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
      <DeleteButton
        key='delete'
        type='danger'
        content='是否确认删除选中的分类？'
        disabled={isEmpty(selectedRowKeys)}
        handleDelete={() => dataGradeDelete(selectedRowKeys)}
        onDeleted={() => tableRef.current?.refresh()}
      />
    ]
  }

  return (
    <div className='page-wrapper'>
      <HeightKeepWrapper minus={108}>
        {
          (scrollY) => (
            <ProTable
              ref={tableRef}
              fetch={dataGradeTree}
              pagination={false}
              virtual={false}
              querier={querier}
              columns={columns}
              rowKey='assetClassName'
              scroll={{ x: 1200, y: scrollY }}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys
              }}
            />
          )
        }
      </HeightKeepWrapper>
      <FormModal
        visible={formVisible}
        record={currentRecord.current}
        onCancel={() => setFromVisible(false)}
        onOk={() => tableRef.current?.refresh()}
      />
    </div>
  )
}

export default DataGradeManage