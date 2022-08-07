import React, {Component, useEffect, useState} from 'react'
import {Form, Input, Modal, Select} from 'antd'
import constant, {DICT_SET, EVENT_TYPE, modalFromLayout, SERVER_CONFIG} from '../../../../../constant'
import {isEmpty} from '@fishballer/bui/dist/lib/utils'
import ClassSelect from '../../../../../components/ClassSelect/ClassSelect'
import ProjectAPI from '../../../../../api/projects'
import AuthEnvironmentAPI from '../../../../../api/authEnvironment'
import utilities from '../../../../../style/utilities.scss'
import DictSelect from '../../../../../components/DictSelect/DictSelect'
import EventEmitter from '../../../../../lib/EventEmitter'
import TextArea from "antd/es/input/TextArea";
import {NumericalInput} from "@fishballer/bui";

const FormItem = Form.Item
const Option = Select.Option


function AuthEnvironmentEditModal(props = {}) {
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
          AuthEnvironmentAPI.updateAuthEnvironment(id, values)
            .then(() => {
              setLoading(false)
              typeof onOk === 'function' && onOk()
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          AuthEnvironmentAPI.addAuthEnvironment(values)
            .then(() => {
              setLoading(false)
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
      title={isEmpty(props.data.id) ? '新建鉴权环境' : '编辑鉴权环境'}
      width={'580px'}
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
  componentDidMount() {
    if (!isEmpty(this.props.data)) {
      const {project, authentication_environment, ...restProps} = this.props.data
      this.props.form.setFieldsValue({
        ...restProps
      })
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
          label="环境名称"
        >
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '环境名称不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入环境名称'}/>
          )}
        </FormItem>
        <FormItem
          label="标识码"
        >
          {getFieldDecorator('code', {
            rules: [
              {required: true, message: '标识码不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入标识码'}/>
          )}
        </FormItem>
        <FormItem
          label="函数调用"
        >
          {getFieldDecorator('is_func_call', {
            rules: [
              {required: true, message: '函数调用不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Select
              allowClear
              placeholder={'请选择是否函数调用'}
            >
              <Option value={true}>true</Option>
              <Option value={false}>false</Option>
            </Select>)}
        </FormItem>
        <FormItem
          label="函数表达式"
        >
          {getFieldDecorator('func_call', {
            rules: [
              {required: false, message: '函数表达式不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入函数表达式'}/>
          )}
        </FormItem>
        <FormItem
          label="缓存redis"
        >
          {getFieldDecorator('is_redis', {
            rules: [
              {required: true, message: '缓存redis不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Select
              allowClear
              placeholder={'请选择是否缓存redis'}
            >
              <Option value={true}>true</Option>
              <Option value={false}>false</Option>
            </Select>)}
        </FormItem>
        <FormItem
          label="超时(min)"
        >
          {getFieldDecorator('timeout', {
            rules: [
              {required: true, message: '鉴权超时时间不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <NumericalInput placeholder={'请输入鉴权超时时间'}/>)}
        </FormItem>
        <FormItem
          label="请求头存储"
        >
          {getFieldDecorator('header_value', {
            rules: [
              {required: false, message: '模块描述不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <TextArea/>
          )}
        </FormItem>
        <FormItem
          label="异常日志"
        >
          {getFieldDecorator('error_log', {
            rules: [
              {required: false, message: '模块描述不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <TextArea/>
          )}
        </FormItem>
        <FormItem
          label="备注"
        >
          {getFieldDecorator('remark', {
            rules: [
              {required: false, message: '模块描述不能为空'}
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <TextArea/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({name: 'authEnvironmentForm'})(Edit)

export default AuthEnvironmentEditModal
