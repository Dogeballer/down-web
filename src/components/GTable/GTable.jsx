import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { Input, Select, message, Divider } from 'antd'
import {Table} from '@fishballer/bui'
import { getNegativeUnique } from '../../lib/utils'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import utilities from '../../style/utilities.scss'
import IconFont from '../Iconfont'

const Option = Select.Option
const GTable = React.forwardRef((props, ref) => {
  const {
    rowKey,
    columns,
    dataSource,
    defaultDataSource,
    operations,
    relations,
    nullOperations,
    handleChange,
    ...restProps
  } = props
  let GROUP_SEQUENCE = 0

  const _row = {
    level: 0,
    parentGroup: 0,
    columnName: void 0,
    operation: void 0,
    value: void 0,
    andOr: void 0,
    groupSequence: void 0
  }

  const [data, setData] = useState([])

  useEffect(() => {
    setData(defaultDataSource || [{ ..._row, id: getNegativeUnique() }])
  }, [])

  useEffect(() => {
    if (dataSource) setData(dataSource)
  }, [dataSource])

  let gColumns = [
    {
      title: '字段名',
      key: 'columnName',
      dataIndex: 'columnName',
      render: (value, record) => (
        record.groupSequence
          ? <span style={{
            fontWeight: 'bold',
            paddingLeft: (record.level - 1) * 16}}
          >
            {value}
          </span>
          : <Input
            value={value}
            style={{width: 180, marginLeft: (record.level || 0) * 16}}
            onChange={(e) => handleCellChange(e.target.value, 'columnName', record)}
          />
      )
    },
    {
      title: '运算符',
      key: 'operation',
      dataIndex: 'operation',
      align: 'center',
      width: 120,
      render: (value, record) => <Select
        allowClear
        value={value}
        disabled={!!record.groupSequence}
        onChange={(e) => handleCellChange(e, 'operation', record)}
      >
        {(operations || []).map(item => <Option
          key={item.dictNum}
          value={item.dictNum}
        >{item.dictName}</Option>)}
      </Select>
    },
    {
      title: '值',
      key: 'value',
      dataIndex: 'value',
      align: 'center',
      width: 200,
      render: (value, record) => <Input
        value={value}
        disabled={!!record.groupSequence || ((nullOperations || []).includes(record.operation))}
        onChange={(e) => handleCellChange(e.target.value, 'value', record)}
      />
    },
    {
      title: '关系符',
      key: 'andOr',
      dataIndex: 'andOr',
      align: 'center',
      width: 120,
      render: (value, record, index) => <Select
        allowClear
        value={value}
        disabled={(record.columnName === '(') || (data[index + 1] && data[index + 1].columnName === ')')}
        onChange={(e) => handleCellChange(e, 'andOr', record)}
      >
        {(relations || []).map(item => <Option
          key={item.dictNum}
          value={item.dictNum}
        >{item.dictName}</Option>)}
      </Select>
    },
    {
      title: '操作',
      key: 'opreate',
      dataIndex: 'opreate',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (value, record, index) => <div className={utilities['opt-dispaly-center']}>
        <IconFont
          type={'icon-zengjia1'}
          style={{fontSize: 24}}
          onClick={() => handleAddRow(index, record)}
        />
        <Divider type='vertical' />
        <IconFont
          type={'icon-xinzengkuohao'}
          style={{fontSize: 24, color: '#52c41a'}}
          onClick={() => handleAddGroup(index, record)}
        />
        <Divider type='vertical' />
        <IconFont
          type={'icon-shanchu1'}
          style={{fontSize: 24}}
          onClick={() => handleDelRow(record)}
        />
      </div>
    }
  ]

  if (!isEmpty(columns)) {
    gColumns = gColumns.map((column, index) => {
      const temp = columns[index] || {}
      if (temp.title) column.title = temp.title
      return column
    })
  }

  const handleCellChange = (value, key, record) => {
    const newData = [...data]
    newData.forEach(item => {
      if (item.id === record.id) {
        if (key === 'operation' &&
        ((nullOperations || []).includes(record.operation))) item.value = void 0
        item[key] = value
      }
    })
    setData(newData)
    typeof handleChange === 'function' && handleChange(newData)
  }

  const handleAddRow = (index, record) => {
    const newData = [...data]
    newData.splice(index + 1, 0, {
      ..._row,
      parentGroup: getParentGroup(record),
      level: isRightBracket(record)
        ? (record.level - 1) : (record.level || 0),
      id: getNegativeUnique()
    })
    setData(newData)
    typeof handleChange === 'function' && handleChange(newData)
  }

  const handleAddGroup = (index, record) => {
    ++GROUP_SEQUENCE
    const newData = [...data]
    const newLevel = isRightBracket(record) ? record.level : record.level + 1
    newData.splice(index + 1, 0, {
      ..._row,
      columnName: '(',
      groupSequence: GROUP_SEQUENCE,
      parentGroup: getParentGroup(record),
      level: newLevel,
      id: getNegativeUnique()
    }, {
      ..._row,
      columnName: ')',
      groupSequence: GROUP_SEQUENCE,
      parentGroup: getParentGroup(record),
      level: newLevel,
      id: getNegativeUnique()
    })
    setData(newData)
    typeof handleChange === 'function' && handleChange(newData)
  }

  const handleDelRow = (record) => {
    if (data.length === 1) return message.warning('保留最后一条规则')
    let newData = [...data]
    if (isEmpty(record.groupSequence)) {
      newData = newData.filter(item => item.id !== record.id)
    } else {
      let startIndex, finalIndex
      newData.forEach((item, index) => {
        if (item.groupSequence === record.groupSequence) {
          if (isEmpty(startIndex)) {
            startIndex = index
          } else if (isEmpty(finalIndex)) {
            finalIndex = index
          }
        }
      })
      if (!isEmpty(startIndex) && !isEmpty(finalIndex)) {
        const group = newData.length === finalIndex + 1
          ? newData.slice(startIndex)
          : newData.slice(startIndex, finalIndex + 1)
        newData = newData.filter(field => !group.some(item => field.id === item.id))
        --GROUP_SEQUENCE
      }
    }
    setData(newData)
  }

  const getParentGroup = ({columnName, groupSequence, parentGroup}) => {
    if (isEmpty(groupSequence)) return parentGroup
    return columnName === ')' ? groupSequence - 1 : groupSequence
  }

  const isRightBracket = (record) => !isEmpty(record.columnName) && record.columnName === ')'

  return (
    <Table
      bordered
      ref={ref}
      rowKey={rowKey}
      columns={gColumns}
      dataSource={data}
      pagination={false}
      {...restProps}
    />
  )
})

GTable.defaultProps = {
  operations: [],
  relations: [],
  nullOperations: []
}

GTable.propTypes = {
  operations: PropTypes.array.isRequired,
  relations: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  nullOperations: PropTypes.array,
  dataSource: PropTypes.array,
  defaultDataSource: PropTypes.array
}

export default GTable
