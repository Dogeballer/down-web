import React, { useRef, useState } from 'react'
import { Button, Divider, Input } from 'antd'
import StatusSwitch from '../../../../components/StatusSwitch'
import DataClassSelect from '../../../../components/DataClassSelect/DataClassSelect'
import AssetGradeSelect from '../../../../components/AssetGradeSelect'
import ClassfiySetModal from './ClassfiySetModal'
import GradeSetModal from './GradeSetModal'
import { HeightKeepWrapper } from '@cecdataFE/bui'
import ProTable from '../../../../components/ProTable/ProTable'
import DatabaseTableFields from './DatabaseTableFields'

function DatabaseTable () {
  const [fieldVisible, setFieldVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const tableRef = useRef()
  const currentRecord = useRef(null)
  const columns = [
    {
      dataIndex: 'tableName',
      title: '表名',
      fixed: 'left',
      render: (value, record) => (
        <Button type='link' size='small' onClick={() => fieldShow(record)}>{value}</Button>
      )
    },
    {
      dataIndex: 'tableNameNotes',
      title: '表中文名'
    },
    {
      dataIndex: 'tableClass',
      title: '分类'
    },
    {
      dataIndex: 'tableGrade',
      title: '分级'
    },
    {
      dataIndex: 'dataAssetIp',
      title: '资产ip'
    },
    {
      dataIndex: 'dbServerName',
      title: '数据库实例名'
    },
    {
      dataIndex: 'assetType',
      title: '资产类型'
    },
    {
      dataIndex: 'tableOperationUser',
      title: '操作人'
    },
    {
      dataIndex: 'tableOperationTime',
      title: '操作时间'
    },
    {
      dataIndex: 'tableShowStatus',
      title: '是否展示',
      align: 'center',
      fixed: 'right',
      width: 80,
      render (value) {
        return <StatusSwitch value={value} />
      }
    },
    {
      dataIndex: 'op',
      title: '操作',
      width: 150,
      align: 'center',
      fixed: 'right',
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
            onClick={() => fieldShow(record)}
          >
            查看结构
          </Button>
        </>
      )
    }
  ]
  const fieldShow = (record) => {
    currentRecord.current = record ? { ...record } : null
    setFieldVisible(true)
  }
  const fieldHide = () => {
    currentRecord.current = null
    setFieldVisible(false)
  }
  const refresh = () => tableRef.current?.refresh()
  const querier = {
    forms: [
      <Input key='ss' placeholder='表名/表中文名' />,
      <DataClassSelect key='tableClass' placeholder='分类搜索' />,
      <AssetGradeSelect key='tableGrade' placeholder='分级搜索' />
    ],
    buttons: [
      <ClassfiySetModal key='class' onOk={refresh}>
        设置分级
      </ClassfiySetModal>,
      <GradeSetModal key='grade' onOk={refresh}>
        设置分级
      </GradeSetModal>
    ]
  }

  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        xxx
        {
          fieldVisible ? <Button type='primary' onClick={fieldHide}>返回上一页</Button> : null
        }
      </div>
      <HeightKeepWrapper style={{ height: 'calc(100% - 56px)', display: fieldVisible ? 'none' : 'block' }} minus={148}>
        {
          (scrollY) => (
            <ProTable
              ref={tableRef}
              // fetch={dataClassList}
              virtual={false}
              querier={querier}
              columns={columns}
              dataSource={[
                {tableName: 'dfdsf'}
              ]}
              rowKey='id'
              scroll={{ x: 1600, y: scrollY }}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys
              }}
            />
          )
        }
      </HeightKeepWrapper>
      {
        fieldVisible ? <DatabaseTableFields record={currentRecord.current} /> : null
      }
    </div>
  )
}

export default DatabaseTable
