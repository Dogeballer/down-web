import React, { Component, useEffect, useState } from 'react'
import ProjectsApi from '../../../../../../../../../api/projects'
import { Form, Input, Modal, Select } from 'antd'
import UseCasesApi from '../../../../../../../../../api/usecases'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import utilities from '../../../../../../../../../style/utilities.scss'
import { modalFromLayout } from '../../../../../../../../../constant'
import FormItem from 'antd/es/form/FormItem'
import TextArea from 'antd/es/input/TextArea'

const { Option, OptGroup } = Select

const caseType = [
  { value: 0, text: '正向用例' },
  { value: 1, text: '异常用例' },
  { value: 2, text: '场景用例' },
  { value: 3, text: '流程用例' },
]

const ModulesSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [ModulesList, setModulesList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    ProjectsApi.getProjectModulesSelector()
      .then(data => {
        setModulesList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  const { ...restProps } = props
  return <Select
    allowClear
    showSearch
    loading={loading}
    filterOption={(input, option) => {
      return typeof option.props.children === 'string' &&
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }}
    {...restProps}
  >
    {
      (ModulesList || []).map(project =>
        <OptGroup key={project.name} label={<span style={{
          fontSize: 16,
          fontWeight: 600
        }}>
              {project.name}
            </span>}>
          {
            (project.modules || []).map(module =>
              <Option
                key={`${project.name}.${module.name}`}
                value={module.id}
              >
                {module.name}
              </Option>
            )
          }
        </OptGroup>
      )
    }
  </Select>
}

const InterfaceToCaseModal = (props) => {
  const { onOk, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  let form = null
  const onOkHandler = () => {
    form.props.form.validateFieldsAndScroll((err, values) => {
      let param = props.param || {}
      let body = props.body
      let selectRows = props.selectRows
      let newParam = param.filter((item) => {
        if (item.value) {
          return true
        }
      })
      newParam = newParam.filter((item) => {
          if (selectRows.findIndex((element) => element === item.id) !== -1)
            return true
        }
      )
      console.log(newParam)
      const newBody = () => {
        if (body.length !== 0)
          return JSON.parse(body)
        else {
          return {}
        }
      }
      console.log(newBody())
      const data = {
        'case_interface': props.interface,
        'param': newParam,
        'body': newBody(),
        ...values
      }
      console.log(data)
      if (!err) {
        setLoading(true)
        UseCasesApi.interfaceToCaseCreate(data)
          .then(() => {
            setLoading(false)
            typeof onOk === 'function' && onOk()
          })
          .finally(() => {
            setLoading(false)
          })
      }
    })
  }

  return (
    <Modal
      centered
      title={'保存为用例'}
      width={'500px'}
      onOk={onOkHandler}
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose={true}
      {...modalProps}
    >
      <EditForm wrappedComponentRef={ref => { form = ref }}/>
    </Modal>
  )
}

class Edit extends Component {
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form
        className={utilities['modal-form']}
        {...modalFromLayout.item}
      >
        <FormItem
          label='用例名称'
        >
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '用例名称不能为空' },
              { min: 4, max: 30, message: '用例名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入用例名称'}/>
          )}
        </FormItem>
        <FormItem
          label='类型'
        >
          {getFieldDecorator('type', {
            rules: [{
              required: true,
              message: '请选择用例类型'
            }]
          })(
            <Select
              placeholder={'请选择用例类型'}
            >
              {(caseType || []).map(({ value, text }) => <Option key={value} value={value}>{text}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem
          label='所属模块'
        >
          {getFieldDecorator('modules', {
            rules: [
              { required: true, message: '所属模块不能为空' }
            ]
          })(
            <ModulesSelect placeholder={'请选择'}/>
          )}
        </FormItem>
        <FormItem
          label='维护者'
        >
          {getFieldDecorator('user', {
            rules: [
              { required: true, message: '维护者不能为空' }
            ]
          })(
            <Input placeholder={'请输入维护者'}/>
          )}
        </FormItem>
        <FormItem
          label='备注地址'
        >
          {getFieldDecorator('describe', {
            rules: [
              { required: true, message: '备注不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <TextArea rows={3} placeholder={'请输入备注信息'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({ name: 'InterfaceToCaseForm' })(Edit)
export default InterfaceToCaseModal
