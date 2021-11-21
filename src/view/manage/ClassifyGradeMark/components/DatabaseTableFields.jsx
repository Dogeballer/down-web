import React, { useRef, useState } from 'react'
import { Button, Input } from 'antd'
import StatusSwitch from '../../../../components/StatusSwitch'
import DataClassSelect from '../../../../components/DataClassSelect/DataClassSelect'
import AssetGradeSelect from '../../../../components/AssetGradeSelect'
import ClassifySetModal from './ClassifySetModal'
import GradeSetModal from './GradeSetModal'
import { HeightKeepWrapper } from '@cecdataFE/bui'
import ProTable from '../../../../components/ProTable/ProTable'

function DatabaseTableFields (props) {
  const { record } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const tableRef = useRef()
  const currentRecord = useRef(null)
  const columns = [
    {
      dataIndex: 'no',
      title: '序号',
      render (v, r, i) {
        return i + 1
      }
    },
    {
      dataIndex: 'colName',
      title: '字段'
    },
    {
      dataIndex: 'colNameNotes',
      title: '中文名'
    },
    {
      dataIndex: 'colClass',
      title: '数据分类'
    },
    {
      dataIndex: 'colGrade',
      title: '数据分级'
    },
    {
      dataIndex: 'colOperationUser',
      title: '操作人'
    },
    {
      dataIndex: 'colOperationTime',
      title: '操作时间'
    },
    {
      dataIndex: 'colShowStatus',
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
            修改
          </Button>
        </>
      )
    }
  ]

  const refresh = () => tableRef.current?.refresh()
  const querier = {
    buttons: [
      <ClassifySetModal key='class' onOk={refresh}>
        设置分级
      </ClassifySetModal>,
      <GradeSetModal key='grade' onOk={refresh}>
        设置分级
      </GradeSetModal>
    ]
  }

  return (
    <HeightKeepWrapper style={{ height: 'calc(100% - 56px)' }} minus={148}>
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
  )
}

export default DatabaseTableFields
