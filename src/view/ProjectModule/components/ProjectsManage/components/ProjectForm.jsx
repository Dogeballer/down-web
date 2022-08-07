import React, { Component, useState } from 'react'
import { Form, Input, Modal } from 'antd'
import constant, { DICT_SET, EVENT_TYPE, modalFromLayout, SERVER_CONFIG } from '../../../../../constant'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import ClassSelect from '../../../../../components/ClassSelect/ClassSelect'
import ProjectAPI from '../../../../../api/projects'
import utilities from '../../../../../style/utilities.scss'
import DictSelect from '../../../../../components/DictSelect/DictSelect'
import EventEmitter from '../../../../../lib/EventEmitter'

const FormItem = Form.Item

function ProjectEditModal (props = {}) {
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
          ProjectAPI.updateProject(id, values)
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
          ProjectAPI.addProject(values)
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
      title={isEmpty(props.data.id) ? '新建项目' : '编辑项目'}
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
  componentDidMount () {
    if (!isEmpty(this.props.data)) {
      this.props.form.setFieldsValue(this.props.data)
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
          label='项目名称'
        >
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '项目名称不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入项目名称'}/>
          )}
        </FormItem>
        <FormItem
          label='项目描述'
        >
          {getFieldDecorator('describe', {
            rules: [
              { required: true, message: '项目描述不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入项目描述'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({ name: 'ProjectForm' })(Edit)

export default ProjectEditModal
