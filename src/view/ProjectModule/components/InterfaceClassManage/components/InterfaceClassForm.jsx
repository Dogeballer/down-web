import React, { Component, useEffect, useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import constant, { DICT_SET, EVENT_TYPE, modalFromLayout, SERVER_CONFIG } from '../../../../../constant'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import ClassSelect from '../../../../../components/ClassSelect/ClassSelect'
// import ModuleAPI from '../../../../../api/modules'
import InterfaceAPI from '../../../../../api/interfaces'
import ProjectAPI from '../../../../../api/projects'
import utilities from '../../../../../style/utilities.scss'
import DictSelect from '../../../../../components/DictSelect/DictSelect'
import EventEmitter from '../../../../../lib/EventEmitter'

const FormItem = Form.Item
const Option = Select.Option
export const ProjectSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [projectList, setProjectList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    ProjectAPI.getProjectList()
      .then(data => {
        setProjectList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  return <Select
    loading={loading}
    {...props}
  >
    {(projectList || []).map(({ id, name }) => <Option key={id} value={id}>{name}</Option>)}
  </Select>
}

function InterfaceClassEditModal (props = {}) {
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
          InterfaceAPI.updateInterfaceClass(id, values)
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
          InterfaceAPI.createInterfaceClass(values)
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
      title={isEmpty(props.data.id) ? '????????????' : '????????????'}
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
      // const {project, ...restProps} = this.props.data
      // this.props.form.setFieldsValue({project: project.id, ...restProps})
      const { project, ...restProps } = this.props.data
      this.props.form.setFieldsValue({ project: project.id, ...restProps })
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
          label='????????????'
        >
          {getFieldDecorator('project', {
            rules: [
              { required: true, message: '????????????????????????' }
              // { min: 4, max: 30, message: '?????????????????????4-30??????' }
            ]
          })(
            <ProjectSelect placeholder={'?????????'}/>
          )}
        </FormItem>
        <FormItem
          label='????????????'
        >
          {getFieldDecorator('class_name', {
            rules: [
              { required: true, message: '????????????????????????' }
              // { min: 4, max: 30, message: '?????????????????????4-30??????' }
            ]
          })(
            <Input placeholder={'?????????????????????'}/>
          )}
        </FormItem>
        <FormItem
          label='????????????'
        >
          {getFieldDecorator('describe', {
            rules: [
              { required: true, message: '????????????????????????' }
              // { min: 4, max: 30, message: '?????????????????????4-30??????' }
            ]
          })(
            <Input placeholder={'?????????????????????'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({ name: 'ModuleForm' })(Edit)

export default InterfaceClassEditModal
