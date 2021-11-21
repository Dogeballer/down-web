import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import StatusSwitch from '../../../../components/StatusSwitch'
import DataClassSelect from '../../../../components/DataClassSelect/DataClassSelect'
import AssetGradeSelect from '../../../../components/AssetGradeSelect'
import ClassifySetModal from './ClassifySetModal'
import GradeSetModal from './GradeSetModal'
import { HeightKeepWrapper } from '@cecdataFE/bui'
import ProTable from '../../../../components/ProTable/ProTable'
import { tableFieldList, tableFieldSet } from '../../../../api/dataClassify'
import ClassifyContext from '../context'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import moment from 'moment'
import tableDataModify from '../../../../lib/tableDataModify'

function DatabaseTableFields (props) {
  const { editable } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const selectedRows = useRef([])
  const [editableKeys, setEditableKeys] = useState([])
  const tableRef = useRef()
  const { state } = useContext(ClassifyContext)
  const { selected } = state

  const dataFetch = (params) => {
    const { dataAssetIp, dbServerName, tableName } = selected ?? {}
    return tableFieldList({ ...params, dataAssetIp, dbServerName, tableName, colShowStatus: editable ? null : 1 })
  }

  const tableDataUpdate = (records, newData) => {
    const colNames = records.map(({ colName }) => colName)
    const { dataAssetIp, dbServerName, tableName } = selected
    return tableFieldSet(colNames, { ...newData, table: { dataAssetIp, dbServerName, tableName } })
      .then(() => {
        tableRef.current.tableSource = tableDataModify(tableRef.current.tableSource, 'id', records, newData)
        setSelectedRowKeys([])
        selectedRows.current = []
      })
  }

  const handleEditToggle = (record) => {
    const index = editableKeys.indexOf(record.id)
    if (~index) {
      editableKeys.splice(index, 1)
    } else {
      editableKeys.push(record.id)
    }
    setEditableKeys([...editableKeys])
  }

  useEffect(() => {
    if (selected?.tableName) {
      refresh()
    }
  }, [selected?.tableName])

  const columns = [
    {
      dataIndex: 'no',
      title: '序号',
      width: 50,
      fixed: 'left',
      render (v, r, i) {
        return i + 1
      }
    },
    {
      dataIndex: 'colName',
      title: '字段',
      fixed: 'left',
      width: 260
    },
    {
      dataIndex: 'colNameNotes',
      title: '中文名'
    },
    {
      dataIndex: 'colClass',
      title: '数据分类',
      width: 200,
      render (value, record) {
        if (editableKeys.includes(record.id)) {
          return (
            <DataClassSelect
              value={value}
              style={{ width: '100%' }}
              onChange={colClass => tableDataUpdate([record], { colClass })}
            />
          )
        } else {
          return value
        }
      }
    },
    {
      dataIndex: 'colGrade',
      title: '数据分级',
      align: 'center',
      width: 100,
      render (value, record) {
        if (editableKeys.includes(record.id)) {
          return (
            <AssetGradeSelect
              value={value}
              style={{ width: '100%' }}
              onChange={colGrade => tableDataUpdate([record], { colGrade })}
            />
          )
        } else {
          return value
        }
      }
    },
    {
      dataIndex: 'colOperationUser',
      title: '操作人',
      width: 120
    },
    {
      dataIndex: 'colOperationTime',
      title: '操作时间',
      align: 'center',
      width: 180,
      render: value => moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    editable
      ? {
          dataIndex: 'colShowStatus',
          title: '是否展示',
          align: 'center',
          fixed: 'right',
          width: 80,
          render: (value, record) => (
            <StatusSwitch
              value={value}
              fetcher={colShowStatus => tableDataUpdate([record], { colShowStatus })}
            />
          )
        }
      : null,
    editable
      ? {
          dataIndex: 'op',
          title: '操作',
          width: 80,
          align: 'center',
          fixed: 'right',
          render: (value, record) => (
            <>
              <Button size='small' type='link' onClick={() => handleEditToggle(record)}>
                {editableKeys.includes(record.id) ? '取消' : '编辑'}
              </Button>
            </>
          )
        }
      : null
  ]

  const refresh = () => tableRef.current?.refresh()
  const querier = {
    buttons: [
      <ClassifySetModal
        key='class'
        disabled={isEmpty(selectedRowKeys)}
        onOk={colClass => tableDataUpdate(selectedRows.current, { colClass })}
      >
        设置分类
      </ClassifySetModal>,
      <GradeSetModal
        key='grade'
        disabled={isEmpty(selectedRowKeys)}
        onOk={colGrade => tableDataUpdate(selectedRows.current, { colGrade })}
      >
        设置分级
      </GradeSetModal>
    ]
  }

  return (
    <HeightKeepWrapper style={{ height: 'calc(100% - 56px)' }} minus={118}>
      {
        (scrollY) => (
          <ProTable
            ref={tableRef}
            fetch={dataFetch}
            autoFetch={false}
            querier={querier}
            columns={columns.filter(c => c)}
            rowKey='id'
            scroll={{ x: 1400, y: scrollY }}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys, rows) => {
                setSelectedRowKeys(keys)
                selectedRows.current = rows
              }
            }}
          />
        )
      }
    </HeightKeepWrapper>
  )
}

export default DatabaseTableFields
