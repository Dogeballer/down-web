import React, { Component } from 'react'
import { Button, Form, Input, Modal, Select } from 'antd'
import { modalFromLayout } from '../../constant'
import ETLStatusSelect from '../ETLStatusSelect/ETLStatusSelect'
// import HospitalSelect from '../HospitalSelect/HospitalSelect'
// import { getDbTableList } from '../../api/ETLConfig'
// import ClassSelect from '../ClassSelect/ClassSelect'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import utilities from '../../style/utilities.scss'
import DbTableSelect from '../DbTableSelect'
import { ProjectSelect } from '../../view/EnvironmentManage/components/EnvironmentForm'
import { ModulesSelect } from '../../view/UseCasesManage/components/UseCaseContent/components/UseCaseInfo/UseCaseInfo'

const FormItem = Form.Item
const { Option, OptGroup } = Select
const caseType = [
  { value: 0, text: '正向用例' },
  { value: 1, text: '异常用例' },
  { value: 2, text: '场景用例' },
  { value: 3, text: '流程用例' },
]

function FilterModal (props = {}) {
  const { onOk, onCancel, ...modalProps } = props
  let filter = null
  const onOkHandler = (values) => {
    Object.keys(values).forEach(key => {
      if (isEmpty(values[key])) {
        delete values[key]
      }
    })
    // if (Object.values(values).every(value => isEmpty(value))) {
    //   message.warning('至少填写一项进行搜索')
    // } else {
    typeof onOk === 'function' && onOk(values)
    // }
  }
  const modalFooter = [
    <Button
      key={'btn-0'}
      style={{ marginRight: '4px' }}
      onClick={() => {
        typeof onCancel === 'function' && onCancel()
      }}
    >
      取消
    </Button>,
    <Button
      key={'btn-1'}
      style={{ marginRight: '4px' }}
      onClick={() => {
        filter.clear()
      }}
    >
      清空
    </Button>,
    <Button
      key={'ok'}
      type='primary'
      onClick={() => {
        onOkHandler(filter.values())
      }}
    >
      确定
    </Button>
  ]

  return (
    <Modal
      centered
      title={'筛选'}
      width={'430px'}
      footer={modalFooter}
      onCancel={onCancel}
      maskClosable={false}
      {...modalProps}
    >
      <FilterForm wrappedComponentRef={ref => { filter = ref }}/>
    </Modal>
  )
}

class Filter extends Component {
  clear () {
    this.props.form.resetFields()
  }

  values () {
    return this.props.form.getFieldsValue()
  }

  render () {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form
    getFieldDecorator('targetDatabaseName')
    getFieldDecorator('targetTableName')
    return (
      <Form className={utilities['modal-form']} {...modalFromLayout.item}>
        <FormItem
          label='关键字'
        >
          {getFieldDecorator('name')(
            <Input placeholder={'请输入关键字'}/>
          )}
        </FormItem>
        <FormItem
          label='项目'
        >
          {getFieldDecorator('project')(
            <ProjectSelect
              placeholder={'请选择项目'}
            />
          )}
        </FormItem>
        <FormItem
          label='模块'
        >
          {getFieldDecorator('modules')(
            <ModulesSelect
              placeholder={'请选择模块'}
            />
          )}
        </FormItem>
        <FormItem
          label='维护者'
        >
          {getFieldDecorator('user')(
            <Input placeholder={'请输入维护者'}/>
          )}
        </FormItem>
        <FormItem
          label='类型'
        >
          {getFieldDecorator('type')(
            <Select
              placeholder={'请选择用例类型'}
            >
              {(caseType || []).map(({ value, text }) => <Option key={value} value={value}>{text}</Option>)}
            </Select>
          )}
        </FormItem>
      </Form>
    )
  }
}

const FilterForm = Form.create({ name: 'hospitalEdit' })(Filter)

export default FilterModal
