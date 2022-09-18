import React, {Component, useEffect, useState} from 'react'
import {Form, Input, Modal, Select} from 'antd'
import constant, {DICT_SET, EVENT_TYPE, modalFromLayout, SERVER_CONFIG} from '../../../constant'
import {isEmpty} from '@fishballer/bui/dist/lib/utils'
import MqttAPI from '../../../api/mqtt'
import utilities from '../../../style/utilities.scss'
import NumericInput from '../../../components/NumericInput/NumericInput'

const FormItem = Form.Item
const Option = Select.Option

function MqttEditModal(props = {}) {
  const {onOk, ...modalProps} = props
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
          MqttAPI.updateMqttClient(id, values)
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
          MqttAPI.addMqttClient(values)
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
      title={isEmpty(props.data.id) ? '新建链接' : '编辑链接'}
      width={'480px'}
      onOk={onOkHandler}
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose={true}
      {...modalProps}
    >
      <EditForm wrappedComponentRef={ref => {
        form = ref
      }} data={props.data}/>
    </Modal>
  )
}

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 0,
    }
  }

  componentDidMount() {
    if (!isEmpty(this.props.data)) {
      const {...restProps} = this.props.data
      this.props.form.setFieldsValue({...restProps})
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form
        className={utilities['modal-form']}
        {...modalFromLayout.item}
      >
        <FormItem
          label="链接名称"
        >
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '链接名称不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入链接名称'}/>
          )}
        </FormItem>
        <FormItem
          label="broker"
        >
          {getFieldDecorator('broker', {
            rules: [
              {required: true, message: 'broker不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入broker'}/>
          )}
        </FormItem>
        <FormItem
          label="port"
        >
          {getFieldDecorator('port', {
            rules: [
              {required: true, message: 'port不能为空'}
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
              {required: true, message: 'username不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入username'}/>
          )}
        </FormItem>
        <FormItem
          label="password"
        >
          {getFieldDecorator('password')(
            <Input placeholder={'请输入password'}/>
          )}
        </FormItem>
        <FormItem
          label="描述"
        >
          {getFieldDecorator('describe', {
            rules: [
              {required: true, message: '链接描述不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入链接描述'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({name: 'MqttForm'})(Edit)

export default MqttEditModal
