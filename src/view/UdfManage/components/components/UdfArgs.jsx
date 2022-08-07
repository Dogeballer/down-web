import React, { useContext, useEffect, useState } from 'react'
import { Popconfirm, Input, Select, Form, Divider, message, Tooltip } from 'antd'
import style from './style.scss'
import { Table } from '@fishballer/bui'
import { getNegativeUnique, isEmpty } from '../../../../lib/utils'
import utilities from '../../../../style/utilities.scss'
import IconFont from '../../../../components/Iconfont'
import store from './store'
import UdfApi from '../../../../api/udf'
import UseCasesApi from '../../../../api/usecases'

const { Option, OptGroup } = Select

const EditableContext = React.createContext(undefined)

const EditableCell = (props) => {
  const getInput = () => {
    if (props.inputType === 'select') {
      return <Select placeholder={props.placeholder} style={{ width: props.width }}>
        {(props.options || []).map(({ value, text }) => <Option key={value} value={value}>{text}</Option>)}
      </Select>
    }
    return <Input placeholder={props.placeholder} style={{ width: props.width }}/>
  }
  const renderCell = ({ getFieldDecorator }) => {

    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      options,
      placeholder,
      ...restProps
    } = props
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: (isEmpty(props.required)) ? true : props.required,
                  message: `请填写${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }
  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
}

const argsType = [
  { value: 0, text: 'int' },
  { value: 1, text: 'str' },
  { value: 2, text: 'list' },
  { value: 3, text: 'dict' },
  { value: 4, text: 'boolean' },
  { value: 5, text: 'float' },
]

const UdfArgs = (props) => {
  const { udfId } = props
  const scrollObj = { x: 1050 }
  const [argsList, setArgsList] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [loading, setLoading] = useState(false)
  let columns = [
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      editable: true,
    },
    {
      title: '中文名',
      key: 'zh_name',
      dataIndex: 'zh_name',
      align: 'center',
      width: 200,
      editable: true,
    },
    {
      title: '参数类型',
      key: 'args_type',
      dataIndex: 'args_type',
      align: 'center',
      width: 200,
      placeholder: '请选择取值类型',
      editable: true,
      options: argsType,
      inputType: 'select',
      render: (value) => {
        return <Select disabled={true} placeholder={'参数类型'} value={value}>
          {(argsType || []).map(({ value, text }) => <Option key={value} value={value}>{text}</Option>)}
        </Select>
      }
    },
    {
      title: '参数描述',
      key: 'describe',
      dataIndex: 'describe',
      align: 'center',
      width: 200,
      editable: true,
      required: false,
      placeholder: '请输入参数描述'
    }, {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 200,
      render: (text, record) => {
        const editable = isEditing(record)
        const index = argsList.findIndex(item => record.id === item.id)
        return editable ? (
          <span>
              <EditableContext.Consumer>
                {form => (
                  <IconFont
                    type={'icon-baocun1'}
                    onClick={() => save(form, record.id)}
                    style={{ fontSize: 24 }}
                    title={'保存'}
                  />
                )}
              </EditableContext.Consumer>
            <Divider type="vertical"/>
              <Popconfirm title="确定取消？" onConfirm={() => {
                if (argsList.length !== 1)
                  cancel(record.id)
              }}
              >
                <IconFont
                  type={'icon-quxiao1'}
                  style={{ fontSize: 24 }}
                  title={'取消'}
                />
              </Popconfirm>
            </span>
        ) : (
          <div className={utilities['opt-display-center']}>
            <IconFont
              type={editingKey !== '' ? 'icon-bianji1' : 'icon-bianji'}
              style={{ fontSize: 24 }}
              onClick={() => {
                if (editingKey === '') edit(record.id)
              }}
              title={'编辑'}
            />
            <Divider type="vertical"/>
            <IconFont
              type={editingKey !== '' ? 'icon-zengjia' : 'icon-zengjia1'}
              style={{ fontSize: 24 }}
              onClick={() => {
                if (editingKey === '') handleAddFieldRow(index)
              }
              }
              title={'增加'}
            />
            <Divider type="vertical"/>
            <Popconfirm title="确定删除？" onConfirm={() => handleDelFieldRow(record)}>
              <IconFont
                type={'icon-shanchu1'}
                style={{ fontSize: 24 }}
                title={'删除'}
              />
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  useEffect(() => {
    if (!isEmpty(props.udfId)) {
      setEditingKey('')
      fetch(props.udfId)
    } else {
      const addId = getNegativeUnique()
      edit(addId)
      setArgsList([{
        ...store.argsInfo,
        id: addId
      }])
    }
  }, [props.udfId])
  const fetch = (id) => {
    setLoading(true)
    UdfApi.getUdfArgsList({ udf: id })
      .then((response) => {
        if (response.data.items.length === 0) {
          const addId = getNegativeUnique()
          edit(addId)
          setArgsList([{
            ...store.argsInfo,
            id: addId
          }])
          setLoading(false)
        } else {
          setArgsList(response.data.items)
          setLoading(false)
        }
      })
  }

  const isEditing = record => record.id === editingKey
  const cancel = (id) => {
    if (Math.sign(id) === -1 && argsList.length !== 1) {
      const newData = argsList.filter(item => item.id > 0)
      setArgsList(newData)
    }
    setEditingKey('')
  }
  const save = (form, id) => {
    if (isEmpty(props.udfId)) return message.warning('请先保存当前函数信息')
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      // const newData = interfaceCallBackParamsList
      // const index = newData.findIndex(item => id === item.id)
      if (Math.sign(id) !== -1) {
        setLoading(true)
        row['udf'] = udfId
        UdfApi.updateUdfArgs(id, row)
          .then((response) => {
            if (response.code === 0) {
              setEditingKey('')
              fetch(udfId)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setLoading(true)
        row['udf'] = udfId
        UdfApi.addUdfArgs(row)
          .then((response) => {
            if (response.code === 0) {
              fetch(udfId)
              setEditingKey('')
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    })
  }
  const edit = (id) => {
    setEditingKey(id)
  }
  const components = {
    body: {
      cell: EditableCell,
    },
  }

  const handleAddFieldRow = (index) => {
    const newData = argsList
    const addId = getNegativeUnique()
    newData.splice(index + 1, 0, {
      ...store.assertInfo,
      id: addId
    })
    edit(addId)
    setArgsList([...newData])
  }
  const handleDelFieldRow = (record) => {
    setLoading(true)
    UdfApi.deleteUdfArgs(record.id)
      .then((response) => {
        if (response.code === 0) {
          fetch(udfId)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  columns = columns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        placeholder: col.placeholder,
        editing: isEditing(record),
        options: col.options,
        inputType: col.inputType,
        required: col.required,
        width: col.width - 20
      }),
    }
  })
  return (
    <div className={style['es-hbase-table']}>
      <EditableContext.Provider value={props.form}>
        <Table
          loading={loading}
          components={components}
          bordered
          dataSource={argsList}
          columns={columns}
          rowClassName="editable-row"
          scroll={scrollObj}
          pagination={false}
          style={{ marginBottom: 10 }}
          rowKey={'id'}
        />
      </EditableContext.Provider>
    </div>
  )
}

const UdfArgsManage = Form.create()(UdfArgs)

export default UdfArgsManage
