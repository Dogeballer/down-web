import React, { Component, useEffect, useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import constant, { DICT_SET, EVENT_TYPE, modalFromLayout, SERVER_CONFIG } from '../../../../../constant'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import UsecasesAPI from '../../../../../api/usecases'
import utilities from '../../../../../style/utilities.scss'
import EnvironmentApi from '../../../../../api/environment'

const FormItem = Form.Item
const Option = Select.Option

const UseCaseManualExecuteModal = (props) => {
  const { onOk, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  let form = props.form
  const onOkHandler = () => {
    form.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true)
        values = {
          'useCaseList': props.selectedRowKeys,
          'type': 0,
          'mode': 0,
          ...values
        }
        typeof onOk === 'function' && onOk()
        UsecasesAPI.UseCaseAsyncExecute(values)
          .then(() => {
            setLoading(false)
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
      title={'用例执行'}
      width={'500px'}
      onOk={onOkHandler}
      maskClosable={true}
      confirmLoading={loading}
      destroyOnClose={true}
      {...modalProps}
    >
      <EditForm wrappedComponentRef={ref => { form = ref }} data={props.data}/>
    </Modal>
  )
}

class Edit extends Component {
  state = {
    loading: false,
    environmentList: [],
  }

  componentDidMount () {
    this.setState({ loading: true })
    this.fetchEnvironment()
  }

  fetchEnvironment = () => {
    EnvironmentApi.getEnvironmentList({})
      .then((response) => {
        if (response.code === 0) {
          this.setState({ environmentList: response.data.items, loading: false })
        }
      })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form
        className={utilities['modal-form']}
        {...modalFromLayout.item}
      >
        <FormItem
          label="选择环境"
        >
          {getFieldDecorator('environment_id', {
            rules: [
              { required: true, message: '环境不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Select
              showSearch={true}
              optionFilterProp={'children'}
              loading={this.state.loading}
              placeholder={'请选择执行环境'}
            >
              {(this.state.environmentList || []).map(({ id, name }) =>
                <Option key={id} value={id}>{name}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="执行者"
        >
          {getFieldDecorator('executor', {
            rules: [
              { required: true, message: '执行者不能为空' }
              // { min: 4, max: 30, message: '分类名称长度在4-30之间' }
            ]
          })(
            <Input placeholder={'请输入执行者'}/>
          )}
        </FormItem>
      </Form>
    )
  }
}

const EditForm = Form.create({ name: 'ManualExecuteForm' })(Edit)

export default UseCaseManualExecuteModal
