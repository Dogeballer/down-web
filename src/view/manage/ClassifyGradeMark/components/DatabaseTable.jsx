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
import moment from 'moment'
import { formatDataVolume } from '../../../../lib/utils'

function DatabaseTable (props) {
  const { editable } = props
  const [fieldVisible, setFieldVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const selectedRows = useRef([])
  const [editableKeys, setEditableKeys] = useState([])
  const tableRef = useRef()
  const lastSelected = useRef({})
  const { state, dispatch } = useContext(ClassifyContext)
  const { selected } = state

  const handleBack = () => {
    const { last } = lastSelected.current
    if (last?.dbServerName) {
      handleTableSelect({
        dataAssetIp: selected.dataAssetIp,
        dbServerName: selected.dbServerName
      })
    } else if (last?.dataAssetIp) {
      handleTableSelect({
        dataAssetIp: selected.dataAssetIp
      })
    } else {
      dispatch('setSelected', {})
    }
  }
  const handleTableSelect = (record) => {
    dispatch('setSelected', record)
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

  const dataFetch = (params) => {
    const { dataAssetIp, dbServerName } = selected ?? {}
    return dataClassList({ ...params, dataAssetIp, dbServerName, tableShowStatus: editable ? null : 1 })
  }

  const refresh = () => tableRef.current?.refresh()

  const tableDataUpdate = (records, newData) => {
    const tables = records.map(({ dataAssetIp, dbServerName, tableName }) => (
      { dataAssetIp, dbServerName, tableName }
    ))
    return dataClassSet(tables, newData)
      .then(() => {
        tableRef.current.tableSource = tableDataModify(tableRef.current.tableSource, 'id', records, newData,
          ['tableOperationTime', 'tableOperationUser'])
        setSelectedRowKeys([])
        selectedRows.current = []
      })
  }
  useEffect(() => {
    const { last, prev } = lastSelected.current
    const visible = !!selected?.tableName
    let shouldRefresh = isEmpty(prev) && isEmpty(last)
    if (prev?.tableName && !selected?.tableName) {
      shouldRefresh = shouldRefresh ||
        selected?.dataAssetIp !== last?.dataAssetIp ||
        selected?.dbServerName !== last?.dbServerName
    } else {
      shouldRefresh = shouldRefresh || true
    }
    // const shouldRefresh = (isEmpty(prev) && isEmpty(last)) ||
    //   selected?.dataAssetIp !== last?.dataAssetIp ||
    //   selected?.dbServerName !== last?.dbServerName
    if (!visible && shouldRefresh) {
      refresh()
    }
    lastSelected.current = {
      prev: { ...selected },
      last: lastSelected.current.prev
    }
    setFieldVisible(visible)
  }, [selected?.key])

  // useEffect(() => {
  //   debugger
  //   if (!fieldVisible) {
  //     refresh()
  //   }
  // }, [selected?.dataAssetIp, selected?.dbServerName, fieldVisible])
  //
  // useEffect(() => {
  //   setFieldVisible(!!selected?.tableName)
  // }, [selected?.tableName])

  const columns = [
    {
      dataIndex: 'tableName',
      title: '表名',
      fixed: 'left',
      width: 260,
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
      width: 200,
      render (value, record) {
        if (editableKeys.includes(record.id)) {
          return (
            <DataClassSelect
              value={value}
              style={{ width: '100%' }}
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
      align: 'center',
      width: 100,
      render (value, record) {
        if (editableKeys.includes(record.id)) {
          return (
            <AssetGradeSelect
              value={value}
              style={{ width: '100%' }}
              onChange={tableGrade => tableDataUpdate([record], { tableGrade })}
            />
          )
        } else {
          return value
        }
      }
    },
    editable
      ? null
      : {
          dataIndex: 'dataVolume',
          title: '数据量',
          align: 'right',
          width: 120,
          render: (value) => formatDataVolume(value)
        },
    {
      dataIndex: 'dataAssetIp',
      title: '资产IP',
      align: 'center',
      width: 150
    },
    {
      dataIndex: 'dbServerName',
      title: '数据库实例名'
    },
    {
      dataIndex: 'assetType',
      title: '资产类型',
      width: 100
    },
    {
      dataIndex: 'tableOperationUser',
      title: '操作人',
      width: 120
    },
    {
      dataIndex: 'tableOperationTime',
      title: '操作时间',
      align: 'center',
      width: 180,
      render: value => moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    editable
      ? {
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
        }
      : null,
    {
      dataIndex: 'op',
      title: '操作',
      width: editable ? 150 : 100,
      align: 'center',
      fixed: 'right',
      render: (value, record) => (
        <>
          {
            editable
              ? (
                <>
                  <Button size='small' type='link' onClick={() => handleEditToggle(record)}>
                    {editableKeys.includes(record.id) ? '取消' : '编辑'}
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
    const { dataAssetIp, dbServerName, tableName, tableNameNotes } = selected ?? {}
    if (tableName) {
      return `[ ${dataAssetIp} / ${dbServerName} ] ${tableNameNotes || tableName}`
    }
    if (dbServerName) {
      return `[ ${dataAssetIp} / ${dbServerName} ]`
    }
    if (dataAssetIp) {
      return `[ ${dataAssetIp} ]`
    }
    return '[ 所有 ] 数据表'
  }, [selected?.key])
  const rowSelection = editable
    ? {
        selectedRowKeys,
        onChange: (keys, rows) => {
          setSelectedRowKeys(keys)
          selectedRows.current = rows
        }
      }
    : false
  return (
    <div className='page-wrapper'>
      <div className='page-header'>
        {title}
        {
          fieldVisible ? <Button type='primary' onClick={handleBack}>返回上一页</Button> : null
        }
      </div>
      <HeightKeepWrapper style={{ height: 'calc(100% - 56px)', display: fieldVisible ? 'none' : 'block' }} minus={160}>
        {
          (scrollY) => (
            <ProTable
              ref={tableRef}
              fetch={dataFetch}
              autoFetch={false}
              querier={querier}
              columns={columns.filter(c => c)}
              rowKey='id'
              // virtual={false}
              scroll={{ x: 1800, y: scrollY }}
              rowSelection={rowSelection}
            />
          )
        }
      </HeightKeepWrapper>
      {
        fieldVisible ? <DatabaseTableFields editable={editable} /> : null
      }
    </div>
  )
}

export default DatabaseTable
