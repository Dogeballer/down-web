import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Divider, Input } from 'antd'
import StatusSwitch from '../../../../components/StatusSwitch'
import DataClassSelect from '../../../../components/DataClassSelect/DataClassSelect'
import AssetGradeSelect from '../../../../components/AssetGradeSelect'
import ClassifySetModal from './ClassifySetModal'
import GradeSetModal from './GradeSetModal'
import { HeightKeepWrapper } from '@cecdataFE/bui'
import ProTable from '../../../../components/ProTable/ProTable'
import DatabaseTableFields from './DatabaseTableFields'
import ClassifyContext from '../context'
import { dataClassList, dataClassSet } from '../../../../api/dataClassify'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import tableDataModify from '../../../../lib/tableDataModify'

function DatabaseTable (props) {
  const { editable } = props
  const [fieldVisible, setFieldVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const selectedRows = useRef([])
  const [editableKeys, setEditableKeys] = useState([])
  const tableRef = useRef()
  const currentRecord = useRef(null)
  const { state, dispatch } = useContext(ClassifyContext)
  const { selected, lastSelected } = state

  const handleBack = () => {
    dispatch('setSelected', lastSelected)
  }
  const handleTableSelect = ({ dataAssetIp, dbServerName, tableName }) => {
    dispatch('setSelected', { dataAssetIp, dbServerName, tableName, key: `${dataAssetIp}_${dbServerName}_${tableName}` })
  }

  const handleEditToggle = (record) => {
    const index = editableKeys.indexOf(record.tableName)
    if (~index) {
      editableKeys.splice(index, 1)
    } else {
      editableKeys.push(record.tableName)
    }
    setEditableKeys([...editableKeys])
  }

  const dataFetch = (params) => {
    const { dataAssetIp, dbServerName } = selected ?? {}
    return dataClassList({ ...params, dataAssetIp, dbServerName })
  }

  const refresh = () => tableRef.current?.refresh()

  const tableDataUpdate = (records, newData) => {
    const tables = records.map(({ dataAssetIp, dbServerName, tableName }) => (
      { dataAssetIp, dbServerName, tableName }
    ))
    return dataClassSet(tables, newData)
      .then(() => {
        tableRef.current.tableSource = tableDataModify(tableRef.current.tableSource, 'id', records, newData)
        setSelectedRowKeys([])
        selectedRows.current = []
      })
  }
  useEffect(() => {
    if (!fieldVisible) {
      refresh()
    }
  }, [selected?.dataAssetIp, selected?.dbServerName, fieldVisible])

  useEffect(() => {
    setFieldVisible(!!selected?.tableName)
  }, [selected?.tableName])

  const columns = [
    {
      dataIndex: 'tableName',
      title: '表名',
      fixed: 'left',
      render: (value, record) => (
        <Button type='link' size='small' onClick={() => handleTableSelect(record)}>{value}</Button>
      )
    },
    {
      dataIndex: 'tableNameNotes',
      title: '表中文名'
    },
    {
      dataIndex: 'tableClass',
      title: '分类',
      render (value, record) {
        if (editableKeys.includes(record.tableName)) {
          return (
            <DataClassSelect
              value={value}
              onChange={tableClass => tableDataUpdate([record], { tableClass })}
            />
          )
        } else {
          return value
        }
      }
    },
    {
      dataIndex: 'tableGrade',
      title: '分级',
      render (value, record) {
        if (editableKeys.includes(record.tableName)) {
          return (
            <AssetGradeSelect
              value={value}
              onChange={tableGrade => tableDataUpdate([record], { tableGrade })}
            />
          )
        } else {
          return value
        }
      }
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
      render: (value, record) => (
        <StatusSwitch
          value={value}
          fetcher={tableShowStatus => tableDataUpdate([record], { tableShowStatus })}
        />
      )
    },
    {
      dataIndex: 'op',
      title: '操作',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (value, record) => (
        <>
          {
            editable
              ? (
                <>
                  <Button size='small' type='link' onClick={() => handleEditToggle(record)}>
                    {editableKeys.includes(record.tableName) ? '取消' : '编辑'}
                  </Button>
                  <Divider type='vertical' />
                </>
                )
              : null
          }
          <Button
            size='small'
            type='link'
            onClick={() => handleTableSelect(record)}
          >
            查看结构
          </Button>
        </>
      )
    }
  ]

  const querier = {
    forms: [
      <Input key='keyword' name='keyword' placeholder='表名/表中文名' />,
      <DataClassSelect key='tableClass' name='tableClass' placeholder='分类搜索' />,
      <AssetGradeSelect key='tableGrade' name='tableGrade' placeholder='分级搜索' />
    ]
  }
  if (editable) {
    querier.buttons = [
      <ClassifySetModal
        key='class'
        disabled={isEmpty(selectedRowKeys)}
        onOk={tableClass => tableDataUpdate(selectedRows.current, { tableClass })}
      >
        设置分类
      </ClassifySetModal>,
      <GradeSetModal
        key='grade'
        disabled={isEmpty(selectedRowKeys)}
        onOk={tableGrade => tableDataUpdate(selectedRows.current, { tableGrade })}
      >
        设置分级
      </GradeSetModal>
    ]
  }

  const title = useMemo(() => {
    const { dataAssetIp, dbServerName, tableName } = selected ?? {}
    if (tableName) {
      return `[${dataAssetIp}/${dbServerName}]${tableName}`
    }
    if (dbServerName) {
      return `[${dataAssetIp}/${dbServerName}]`
    }
    if (dataAssetIp) {
      return `[${dataAssetIp}]`
    }
    return '[所有]数据表'
  }, [selected?.key])
  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        {title}
        {
          fieldVisible ? <Button type='primary' onClick={handleBack}>返回上一页</Button> : null
        }
      </div>
      <HeightKeepWrapper style={{ height: 'calc(100% - 56px)', display: fieldVisible ? 'none' : 'block' }} minus={148}>
        {
          (scrollY) => (
            <ProTable
              ref={tableRef}
              fetch={dataFetch}
              autoFetch={false}
              querier={querier}
              columns={columns}
              rowKey='id'
              scroll={{ x: 1600, y: scrollY }}
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
      {
        fieldVisible ? <DatabaseTableFields editable={editable} record={currentRecord.current} /> : null
      }
    </div>
  )
}

export default DatabaseTable
