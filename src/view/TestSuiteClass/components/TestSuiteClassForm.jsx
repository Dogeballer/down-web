import React, { Component, useState } from 'react'
import { Form, Input, Modal } from 'antd'
import modalFromLayout from '../../../constant'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import ClassSelect from '../../../components/ClassSelect/ClassSelect'
import testSuiteAPI from '../../../api/testsuite'
import TestSuiteClass from '../TestSuiteClass'

const FormItem = Form.Item

function TestSuiteClassEditModal (props = {}) {
  const { onOk, onCancel, getData, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  let form = null
  const onOkHandler = () => {
    form.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true)
        const data = props.data || {}
        let requestMethod
        if (Object.keys(data).length > 1) {
          values.id = data.id
          testSuiteAPI.updateTestSuiteClass(values.id, values).then(
            (response) => {
              onOk()
              getData()
              setLoading(false)
            }
          ).catch(() => {
            setLoading(false)
          })
        } else {
          testSuiteAPI.createTestSuiteClass(values).then(
            (response) => {
              onOk()
              getData()
              setLoading(false)
            }
          ).catch(() => {
            setLoading(false)
          })
        }
      }
    })
  }

  return (
    <Modal
      centered
      title={isEmpty(props.data.id) ? '新建测试套件分类' : '编辑测试套件分类'}
      width={'430px'}
      onOk={onOkHandler}
      confirmLoading={loading}
      onCancel={onCancel}
      maskClosable={false}
      {...modalProps}
    >
      <EditForm
        data={props.data}
        classData={props.classData}
        wrappedComponentRef={ref => { form = ref }}
      />
    </Modal>
  )
}

class Edit extends Component {
  componentDidMount () {
    if (!isEmpty(this.props.data)) {
      const {
        code,
        name,
        parent,
        describe
      } = this.props.data
      this.props.form.setFieldsValue({ code, name, parent, describe })
    }
  }

  render () {
    const classForm = this.props.form
    const { getFieldDecorator } = classForm
    const nodeId = this.props.data && this.props.data.id
    return (
      <Form
        {...modalFromLayout.item}
      >
        <FormItem
          label='所属分类'
        >
          {getFieldDecorator('parent', {
            initialValue: 0,
            rules: [{
              required: true, message: '请选择所属分类'
            }]
          })(
            <ClassSelect
              showTopOption
              hideDisabledClassChildren
              placeholder='请选择所属分类'
              filter={node => node.id === nodeId}
            />
          )}
        </FormItem>
        <FormItem
          label='分类名称'
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              message: '分类名称不为空'
            }]
          })(
            <Input placeholder={'请输入分类名称'}/>
          )}
        </FormItem>
        <FormItem
          label='分类编码'
        >
          {getFieldDecorator('code', {
            rules: [{
              required: true,
              message: '分类编码不能为空，且长度不能超过20字符'
            }]
          })(
            <Input placeholder={'请输入分类编码'}/>
          )}
        </FormItem>
        <FormItem
          label='描述'
        >
          {getFieldDecorator('describe', {
            rules: [{
              required: true,
              message: '描述不能为空'
            }]
          })(
            <Input placeholder={'请输入描述'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({ name: 'TestSuiteClassForm' })(Edit)

export default TestSuiteClassEditModal
