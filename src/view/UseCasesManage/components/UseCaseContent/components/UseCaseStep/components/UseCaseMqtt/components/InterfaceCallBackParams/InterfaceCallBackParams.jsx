import React, { useContext, useEffect, useState } from 'react'
import { Popconfirm, Input, Select, Form, Divider, message, Tooltip, Table } from 'antd'
import style from './style.scss'
// import { Table } from '@fishballer/bui'
import { getNegativeUnique, isEmpty } from '../../../../../../../../../../lib/utils'
import utilities from '../../../../../../../../../../style/utilities.scss'
import IconFont from '../../../../../../../../../../components/Iconfont'
import store
  from '../../../../../../../../../InterfaceManage/components/InterfaceContent/components/InterfaceInfoConfig/InterfaceParam/store'
import InterfaceAPI from '../../../../../../../../../../api/interfaces'
import UsecaseAPI from '../../../../../../../../../../api/usecases'

const EditableContext = React.createContext(undefined)

const type = [
  { value: 0, text: '字符串' },
  { value: 1, text: '数组' },
]
const { Option, OptGroup } = Select

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

const InterfaceCallBackParamsTable = (props) => {
  const scrollObj = { x: 1300 }
  const { interfaceCallBackParams } = props
  const [interfaceCallBackParamsList, setInterfaceCallBackParamsList] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [loading, setLoading] = useState(false)
  let columns = [
    {
      title: '回调参数名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      editable: true,
    },
    {
      title: '参数调用名',
      key: 'param_name',
      dataIndex: 'param_name',
      align: 'center',
      width: 200,
      placeholder: '按“__recordId”格式',
      editable: true,
    },
    {
      title: 'json路径(按照jsonPath填写)',
      key: 'json_path',
      dataIndex: 'json_path',
      align: 'center',
      width: 200,
      editable: true,
      placeholder: '如：$.data.items[0]'
    }, {
      title: '值类型',
      key: 'type',
      dataIndex: 'type',
      align: 'center',
      width: 200,
      editable: true,
      placeholder: '请选择值类型',
      inputType: 'select',
      options: type,
      render: (value) => {
        return <Select disabled={true} placeholder={'值类型'} value={value}>
          {(type || []).map(({ value, text }) => <Option key={value} value={value}>{text}</Option>)}
        </Select>
      }
    }, {
      title: '值(点击测试-回传参数值)',
      key: 'value',
      dataIndex: 'value',
      align: 'center',
      width: 150,
      editable: false,
      render: (value, record) =>
        <Tooltip placement='top' title={value}>
          <Input value={value}/>
        </Tooltip>

    }, {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 150,
      render: (text, record) => {
        const editable = isEditing(record)
        const index = interfaceCallBackParamsList.findIndex(item => record.id === item.id)
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
            <Divider type='vertical'/>
              <Popconfirm title="确定取消？" onConfirm={() => {
                if (interfaceCallBackParamsList.length !== 1)
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
              }
              }
              title={'编辑'}
            />
            <Divider type='vertical'/>
            <IconFont
              type={editingKey !== '' ? 'icon-zengjia' : 'icon-zengjia1'}
              style={{ fontSize: 24 }}
              onClick={() => {
                if (editingKey === '') handleAddFieldRow(index)
              }
              }
              title={'增加'}
            />
            <Divider type='vertical'/>
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
    if (!isEmpty(interfaceCallBackParams)) {
      setEditingKey('')
      setInterfaceCallBackParamsList(interfaceCallBackParams)
    } else {
      const addId = getNegativeUnique()
      edit(addId)
      setInterfaceCallBackParamsList([{
        ...store.paramInfo,
        id: addId
      }])
    }
  }, [props.interfaceCallBackParams])
  const isEditing = record => record.id === editingKey
  const cancel = (id) => {
    if (Math.sign(id) === -1 && interfaceCallBackParamsList.length !== 1) {
      const newData = interfaceCallBackParamsList.filter(item => item.id > 0)
      setInterfaceCallBackParamsList(newData)
    }
    setEditingKey('')
  }
  const save = (form, id) => {
    if (isEmpty(props.stepId)) return message.warning('请先保存当前步骤信息')
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      // const newData = interfaceCallBackParamsList
      // const index = newData.findIndex(item => id === item.id)
      if (Math.sign(id) !== -1) {
        setLoading(true)
        // row['return_interface'] = props.return_interface
        row['step'] = props.stepId
        UsecaseAPI.updateStepCallBackParams(id, row)
          .then((response) => {
            if (response.code === 0) {
              props.onCallBackParamsChange()
              setEditingKey('')
              // const item = newData[index]
              // newData.splice(index, 1, {
              //   ...item,
              //   ...row,
              // })
              // // console.log(newData)
              // setInterfaceCallBackParamsList(newData)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setLoading(true)
        // row['return_interface'] = props.return_interface
        row['step'] = props.stepId
        UsecaseAPI.createStepCallBackParams(row)
          .then((response) => {
            if (response.code === 0) {
              props.onCallBackParamsChange()
              setEditingKey('')
              // const item = newData[index]
              // newData.splice(index, 1, {
              //   ...item,
              //   ...row,
              // })
              // setInterfaceCallBackParamsList(newData)
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
    const newData = interfaceCallBackParamsList
    const addId = getNegativeUnique()
    newData.splice(index + 1, 0, {
      ...store.paramInfo,
      id: addId
    })
    edit(addId)
    setInterfaceCallBackParamsList([...newData])
  }
  const handleDelFieldRow = (record) => {
    setLoading(true)
    UsecaseAPI.deleteStepCallBackParams(record.id)
      .then((response) => {
        if (response.code === 0) {
          props.onCallBackParamsChange()
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
          size={'middle'}
          components={components}
          bordered
          dataSource={interfaceCallBackParamsList}
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

const InterfaceCallBackParams = Form.create()(InterfaceCallBackParamsTable)

export default InterfaceCallBackParams
