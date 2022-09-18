import React, {useContext, useEffect, useState} from 'react'
import {Popconfirm, Input, Select, Form, Divider, message, Tooltip} from 'antd'
import style from './style.scss'
import {Table} from '@fishballer/bui'
import {getNegativeUnique, isEmpty} from '../../../../../../../../../../lib/utils'
import utilities from '../../../../../../../../../../style/utilities.scss'
import IconFont from '../../../../../../../../../../components/Iconfont'
import store from './store'
import InterfaceAPI from '../../../../../../../../../../api/interfaces'
import UseCasesApi from '../../../../../../../../../../api/usecases'

const {Option, OptGroup} = Select

const EditableContext = React.createContext(undefined)

const EditableCell = (props) => {
  const getInput = () => {
    if (props.inputType === 'select') {
      return <Select placeholder={props.placeholder} style={{width: props.width}}>
        {(props.options || []).map(({value, text}) => <Option key={value} value={value}>{text}</Option>)}
      </Select>
    }
    return <Input placeholder={props.placeholder} style={{width: props.width}}/>
  }
  const renderCell = ({getFieldDecorator}) => {

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
          <Form.Item style={{margin: 0}}>
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

const assertType = [
  {value: 0, text: '包含'},
  {value: 1, text: '不包含'},
  {value: 2, text: '等于'},
  {value: 3, text: '不等于'},
  {value: 4, text: '大于'},
  {value: 5, text: '小于'},
  {value: 6, text: '大等于'},
  {value: 7, text: '小等于'},
]
const typeFrom = [
  {value: 0, text: '消息体校验'},
  {value: 1, text: '返回码校验'},
  {value: 2, text: '数据库校验'},
]

const CaseAssert = (props) => {
  const {stepId} = props
  const scrollObj = {x: 1050}
  const [assertList, setAssertListList] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [loading, setLoading] = useState(false)
  let columns = [
    {
      title: '断言名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      editable: true,
    },
    {
      title: '取值类型',
      key: 'type_from',
      dataIndex: 'type_from',
      align: 'center',
      width: 200,
      placeholder: '请选择取值类型',
      editable: true,
      options: typeFrom,
      inputType: 'select',
      render: (value) => {
        return <Select disabled={true} placeholder={'断言方式'} value={value}>
          {(typeFrom || []).map(({value, text}) => <Option key={value} value={value}>{text}</Option>)}
        </Select>
      }

    },
    {
      title: '取值语法',
      key: 'value_statement',
      dataIndex: 'value_statement',
      align: 'center',
      width: 200,
      editable: true,
      required: false,
      placeholder: '请输入取值语法'
    }, {
      title: '断言方式',
      key: 'assert_type',
      dataIndex: 'assert_type',
      align: 'center',
      width: 200,
      editable: true,
      placeholder: '请选择断言方式',
      inputType: 'select',
      options: assertType,
      render: (value) => {
        return <Select disabled={true} placeholder={'断言方式'} value={value}>
          {(assertType || []).map(({value, text}) => <Option key={value} value={value}>{text}</Option>)}
        </Select>
      }
    }, {
      title: '校验值',
      key: 'verify_value',
      dataIndex: 'verify_value',
      align: 'center',
      width: 200,
      editable: true,
      placeholder: '请输入校验值'
    }, {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 200,
      render: (text, record) => {
        const editable = isEditing(record)
        const index = assertList.findIndex(item => record.id === item.id)
        return editable ? (
          <span>
              <EditableContext.Consumer>
                {form => (
                  <IconFont
                    type={'icon-baocun1'}
                    onClick={() => save(form, record.id)}
                    style={{fontSize: 24}}
                    title={'保存'}
                  />
                )}
              </EditableContext.Consumer>
            <Divider type='vertical'/>
              <Popconfirm title="确定取消？" onConfirm={() => {
                if (assertList.length !== 1)
                  cancel(record.id)
              }}
              >
                <IconFont
                  type={'icon-quxiao1'}
                  style={{fontSize: 24}}
                  title={'取消'}
                />
              </Popconfirm>
            </span>
        ) : (
          <div className={utilities['opt-display-center']}>
            <IconFont
              type={editingKey !== '' ? 'icon-bianji1' : 'icon-bianji'}
              style={{fontSize: 24}}
              onClick={() => {
                if (editingKey === '') edit(record.id)
              }}
              title={'编辑'}
            />
            <Divider type='vertical'/>
            <IconFont
              type={editingKey !== '' ? 'icon-zengjia' : 'icon-zengjia1'}
              style={{fontSize: 24}}
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
                style={{fontSize: 24}}
                title={'删除'}
              />
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  useEffect(() => {
    if (!isEmpty(stepId)) {
      setEditingKey('')
      fetch(stepId)
    } else {
      const addId = getNegativeUnique()
      edit(addId)
      setAssertListList([{
        ...store.assertInfo,
        id: addId
      }])
    }
  }, [stepId])
  const fetch = (stepId) => {
    UseCasesApi.getUseCaseStepAssertList(stepId)
      .then((response) => {
        if (response.data.items.length === 0) {
          const addId = getNegativeUnique()
          edit(addId)
          setAssertListList([{
            ...store.assertInfo,
            id: addId
          }])
        } else setAssertListList(response.data.items)
      })
  }
  const isEditing = record => record.id === editingKey
  const cancel = (id) => {
    if (Math.sign(id) === -1 && assertList.length !== 1) {
      const newData = assertList.filter(item => item.id > 0)
      setAssertListList(newData)
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
        row['case_step'] = stepId
        UseCasesApi.updateUseCaseAssert(id, row)
          .then((response) => {
            if (response.code === 0) {
              setEditingKey('')
              fetch(stepId)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setLoading(true)
        row['case_step'] = stepId
        UseCasesApi.createUseCaseAssert(row)
          .then((response) => {
            if (response.code === 0) {
              fetch(stepId)
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
    const newData = assertList
    const addId = getNegativeUnique()
    newData.splice(index + 1, 0, {
      ...store.assertInfo,
      id: addId
    })
    edit(addId)
    setAssertListList([...newData])
  }
  const handleDelFieldRow = (record) => {
    setLoading(true)
    UseCasesApi.deleteUseCaseAssert(record.id)
      .then((response) => {
        if (response.code === 0) {
          fetch(stepId)
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
          dataSource={assertList}
          columns={columns}
          rowClassName="editable-row"
          scroll={scrollObj}
          pagination={false}
          style={{marginBottom: 10}}
          rowKey={'id'}
        />
      </EditableContext.Provider>
    </div>
  )
}

const UseCaseAssert = Form.create()(CaseAssert)

export default UseCaseAssert
