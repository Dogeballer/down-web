import React, { useEffect, useState } from 'react'
import { Input, Select } from 'antd'
import style from './style.scss'
import { Table } from '@fishballer/bui'
import { isEmpty } from '../../../../../../../../../lib/utils'

const InterfaceParamTest = (props) => {
  const scrollObj = { x: 1050 }
  const { interfaceParam, hisSelectRows } = props
  const result = interfaceParam.filter((item) => {
    return !!item.required
  }).map(({ id }) => id)
  const [interfaceParamsList, setInterfaceParamsList] = useState([])
  const [selectedRowKeys, setselectedRowKeys] = useState([])
  const paramsColumns = [
    {
      title: '参数名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 180,
      render: (value) => <Input
        disabled={true}
        value={value}
      />
    },
    {
      title: '参数位置',
      key: 'param_in',
      dataIndex: 'param_in',
      align: 'center',
      width: 100,
      render: (value) => <Input
        disabled={true}
        value={value}
      />
    },
    {
      title: '参数类型',
      key: 'type',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      render: (value) => <Input
        disabled={true}
        value={value}
      />
    },
    {
      title: '是否必填',
      key: 'required',
      dataIndex: 'required',
      align: 'center',
      width: 100,
      render: (value) => <Input
        disabled={true}
        value={value ? '是' : '否'}
      />
    },
    {
      title: '参数描述',
      key: 'describe',
      dataIndex: 'describe',
      align: 'center',
      width: 250,
      render: (value) => <Input
        disabled={true}
        value={value}
      />
    },
    {
      title: '示例值',
      key: 'example',
      dataIndex: 'example',
      align: 'center',
      width: 150,
      render: (value) => <Input
        value={value}
        disabled={true}
      />
    },
    {
      title: '值',
      key: 'value',
      dataIndex: 'value',
      align: 'center',
      width: 150,
      render: (value, record) => <Input
        value={value}
        onChange={(e) => handleFieldChange(e, 'value', record)}
      />
    },
  ]
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setselectedRowKeys(selectedRowKeys)
      props.onSelectRowsChange(selectedRowKeys)
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: record => ({
      disabled: record.required === true,
    }),
  }
  useEffect(() => {
    setInterfaceParamsList(interfaceParam)
    if (interfaceParam) {
      // console.log(hisSelectRows)
      if (hisSelectRows.length === 0) {
        setselectedRowKeys(result)
        props.onSelectRowsChange(result)
      } else {
        setselectedRowKeys(hisSelectRows)
        props.onParamsChange(interfaceParam, hisSelectRows)
      }
    }
  }, [props.interfaceParam, props.hisSelectRows])
  const handleFieldChange = (e, key, record) => {
    let newSelectedRowKeys = selectedRowKeys
    let value = e
    if (e && e.target) {
      value = e.target.value
    }
    interfaceParamsList.forEach(item => {
      if (item.id === record.id) item[key] = value
    })
    if (isEmpty(e.target.value)) {
      const emptyValueIndex = newSelectedRowKeys.findIndex((element) => element === record.id
      )
      if (result.findIndex((element) => element === record.id) === -1) {
        newSelectedRowKeys.splice(emptyValueIndex, 1)
      }
      } else {
      if (newSelectedRowKeys.findIndex((element) => {
        if (element === record.id) {
          return true
        }
      }) === -1)
        newSelectedRowKeys.push(record.id)
    }
    // console.log(newSelectedRowKeys)
    setInterfaceParamsList([...interfaceParamsList])
    setselectedRowKeys(newSelectedRowKeys)
    props.onParamsChange([...interfaceParamsList], newSelectedRowKeys)
  }
  return (
    <div className={style['es-hbase-table']}>
      <Table
        rowSelection={rowSelection}
        bordered
        rowKey={'id'}
        scroll={scrollObj}
        columns={paramsColumns}
        dataSource={interfaceParamsList}
        pagination={false}
        style={{ marginBottom: 10 }}
      />
    </div>
  )
}
export default InterfaceParamTest
