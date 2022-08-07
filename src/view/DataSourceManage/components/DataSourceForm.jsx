import React, { Component, useEffect, useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import constant, { DICT_SET, EVENT_TYPE, modalFromLayout, SERVER_CONFIG } from '../../../constant'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import DataSourceAPI from '../../../api/datasourse'
import utilities from '../../../style/utilities.scss'
import NumericInput from '../../../components/NumericInput/NumericInput'

const FormItem = Form.Item
const Option = Select.Option
const dataSourceTypeChoice = [
  { name: 'PG', value: 0 },
  { name: 'SqlSever', value: 1 },
  { name: 'Oracle', value: 2 },
  { name: 'Mysql', value: 3 },
]

function DataSourceEditModal (props = {}) {
  const { onOk, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  let form = null
  const onOkHandler = () => {
    form.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true)
        let data = props.data || {}
        const id = data.id
        if (id) {
          // ETLClassAPI.updateClass('etl', { ...data, ...values })
          DataSourceAPI.updateDataSource(id, values)
            .then(() => {
              setLoading(false)
              // EventEmitter.emit(EVENT_TYPE.ETL_TREE_CHANGED)
              typeof onOk === 'function' && onOk()
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          // ETLClassAPI.addClass('etl', values)
          DataSourceAPI.addDataSource(values)
            .then(() => {
              setLoading(false)
              // EventEmitter.emit(EVENT_TYPE.ETL_TREE_CHANGED)
              typeof onOk === 'function' && onOk()
            })
            .finally(() => {
              setLoading(false)
            })
        }
      }
    })
  }

  return (
    <Modal
      centered
      title={isEmpty(props.data.id) ? '新建元数据' : '编辑元数据'}
      width={'430px'}
      onOk={onOkHandler}
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose={true}
      {...modalProps}
    >
      <EditForm wrappedComponentRef={ref => { form = ref }} data={props.data}/>
    </Modal>
  )
}

class Edit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: 0,
    }
  }

  componentDidMount () {
    if (!isEmpty(this.props.data)) {
      const { ...restProps } = this.props.data
      this.props.form.setFieldsValue({ ...restProps })
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form
        className={utilities['modal-form']}
        {...modalFromLayout.item}
      >
        <FormItem
          label="元数据名称"
        >
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '元数据名称不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入元数据名称'}/>
          )}
        </FormItem>
        <FormItem
          label="数据库类型"
        >
          {getFieldDecorator('database_type', {
            rules: [
              { required: true, message: '数据库类型不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Select
              style={{ width: '100%' }}
              placeholder={'请选择数据库类型'}
              onChange={(value) => {
                this.setState({
                  type: value
                })
              }}
            >
              {
                dataSourceTypeChoice.map((item) =>
                  <Option key={item.value} value={item.value}>{item.name}</Option>)
              }
            </Select>)}
        </FormItem>
        <FormItem
          label="host"
        >
          {getFieldDecorator('host', {
            rules: [
              { required: true, message: 'host不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入host'}/>
          )}
        </FormItem>
        <FormItem
          label="port"
        >
          {getFieldDecorator('port', {
            rules: [
              { required: true, message: 'port不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <NumericInput placeholder={'请输入port'}/>
          )}
        </FormItem>
        <FormItem
          label="username"
        >
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: 'username不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入username'}/>
          )}
        </FormItem>
        <FormItem
          label="password"
        >
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'password不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入password'}/>
          )}
        </FormItem>
        <FormItem
          label="database"
        >
          {getFieldDecorator('database', {
            rules: [
              { required: true, message: 'database不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入database'}/>
          )}
        </FormItem>
        {
          this.state.type === 2 ? (<Form.Item
            label="sid"
          >
            {getFieldDecorator('sid', {
              rules: [{ required: true, message: '请填写sid' }]
            })(
              <NumericInput placeholder={'请填写sid'} style={{ width: '100%' }}/>
            )}
          </Form.Item>) : null
        }
        <FormItem
          label="描述"
        >
          {getFieldDecorator('describe', {
            rules: [
              { required: true, message: '元数据描述不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入元数据描述'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({ name: 'DataSourceForm' })(Edit)

export default DataSourceEditModal
