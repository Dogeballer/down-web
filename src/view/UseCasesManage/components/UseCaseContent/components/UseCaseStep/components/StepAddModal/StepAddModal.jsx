import React, { Component, useEffect, useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import utilities from '../../../../../../../../style/utilities.scss'
import { modalFromLayout } from '../../../../../../../../constant'
import ModuleApi from '../../../../../../../../api/modules'
import InterfaceAPI from '../../../../../../../../api/interfaces'
import UseCasesApi from '../../../../../../../../api/usecases'
import NumericInput from '../../../../../../../../components/NumericInput/NumericInput'
import ProjectAPI from '../../../../../../../../api/projects'

const { Option, OptGroup } = Select

const CasePollParamSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [casePollParamList, setCasePollParamList] = useState([])
  useEffect(() => fetch(), [])
  const { currentNode } = props
  const fetch = () => {
    setLoading(true)
    UseCasesApi.getCasePollParam(currentNode)
      .then(data => {
        setCasePollParamList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  return <Select
    loading={loading}
    {...props}
  >
    {(casePollParamList || []).map(({ id, name, param_name }) => <Option key={id}
                                                                         value={param_name}>{param_name}({name})</Option>)}
  </Select>
}

function StepAddModal (props = {}) {
  const { onOk, currentNode, ...modalProps } = props
  let form = null
  const onOkHandler = () => {
    form.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        typeof onOk === 'function' && onOk(values)
      }
    })
  }

  return (
    <Modal
      centered
      destroyOnClose
      title={'新增步骤'}
      width={'670px'}
      onOk={onOkHandler}
      maskClosable={false}
      {...modalProps}
    >
      <StepAddForm
        currentNode={currentNode}
        wrappedComponentRef={ref => { form = ref }}
      />
    </Modal>
  )
}

const InterfaceSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [InterfaceList, setInterfaceList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    UseCasesApi.getUseCase(props.currentNode)
      .then((response) => {
        const module_id = response.data.modules
        ModuleApi.getModule(module_id).then((data) => {
          const project_id = data.data.project
          const params = { project: project_id }
          InterfaceAPI.getInterfaceSelector({ params })
            .then((data) => {
              setInterfaceList(data.data.items)
            })
        })
      }).finally(() => setLoading(false))
  }
  const { ...restProps } = props
  return <Select
    allowClear
    showSearch
    loading={loading}
    placeholder={'请选择接口'}
    filterOption={(input, option) => {
      return typeof option.props.children === 'string' &&
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }}
    {...restProps}
  >
    {
      (InterfaceList || []).map(interface_class =>
        <OptGroup key={interface_class.class_name} label={<span style={{
          fontSize: 16,
          fontWeight: 600
        }}
        >
              {interface_class.class_name}
            </span>}>
          {
            (interface_class.children || []).map(interfaceInfo =>
              <Option
                key={`${interfaceInfo.name}.${interfaceInfo.name}`}
                value={interfaceInfo.id}
              >
                {interfaceInfo.name + '-(' + interfaceInfo.path + ')'}
              </Option>
            )
          }
        </OptGroup>
      )
    }
  </Select>
}

class StepAdd extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: 0,
    }
  }

  stepTypes = [
    { value: 0, text: '执行接口' },
    { value: 1, text: '等待时间' },
    { value: 2, text: '轮询接口' },
    { value: 3, text: '回调列表循环' },
    { value: 4, text: 'SQL查询' },
    { value: 5, text: 'SQL执行' },
    { value: 6, text: 'SQL轮询查询' },
    { value: 8, text: 'SQL查询列表循环' },
    { value: 9, text: 'SQL执行列表循环' },
  ]

  clear () {
    this.props.form.resetFields()
  }

  values () {
    return { ...this.props.form.getFieldsValue() }
  }

  render () {
    const { setFieldsValue, getFieldDecorator } = this.props.form
    return (
      <Form className={utilities['modal-form']} {...modalFromLayout.item}>
        <Form.Item
          label="步骤类型"
        >
          {getFieldDecorator('type', {
            initialValue: 0,
            rules: [{ required: true, message: '请选择步骤类型' }]
          })(
            <Select
              allowClear
              placeholder={'请选择步骤类型'}
              style={{ width: '100%' }}
              onChange={(value) => {
                this.setState({
                  type: value
                })
                if (value === 2) setFieldsValue({ name: '[轮询]' })
                if (value === 3) setFieldsValue({ name: '[循环]' })
                if (value === 6) setFieldsValue({ name: '[S轮询]' })
                if (value === 8) setFieldsValue({ name: '[S循环]' })
                if (value === 9) setFieldsValue({ name: '[S循环]' })
              }}
            >
              {this.stepTypes.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                  title={option.text}
                >
                  {option.text}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {[0, 2, 3].includes(this.state.type) ? <Form.Item
          label={'选择接口'}
        >
          {
            getFieldDecorator('case_interface', {
              rules: [{ required: true, message: '请选择执行接口' }]
            })(
              <InterfaceSelect currentNode={this.props.currentNode}/>
            )}
        </Form.Item> : null}
        {this.state.type === 1 ? <Form.Item label={'等待时间'}>
          {getFieldDecorator('time', {
            initialValue: 1,
            rules: [{ required: true, message: '请填写休眠时间' }]
          })(
            <NumericInput placeholder={'请填写休眠时间'}
                          style={{ width: '100%' }}
                          onChange={(value) => {
                            setFieldsValue({
                              name: `停止${value}s`,
                            })
                          }}/>
          )}
        </Form.Item> : null

        }
        <Form.Item
          label="步骤名称"
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入步骤名称' }]
          })(
            this.state.type !== 1 ?
              <Input placeholder={'请输入步骤名称'}/> :
              <Input disabled={true}
                     placeholder={'请输入步骤名称'}
              />
          )}
        </Form.Item>
        <Form.Item
          label="排序"
        >
          {getFieldDecorator('sort', {
            rules: [{ required: true, message: '请填写步骤排序' }]
          })(
            <NumericInput placeholder={'请填写步骤排序'} style={{ width: '100%' }}/>
          )}
        </Form.Item>
        {
          [2, 6].includes(this.state.type) ? (<Form.Item
            label="轮询次数"
          >
            {getFieldDecorator('wrap_count', {
              rules: [{ required: true, message: '请填写轮询次数' }]
            })(
              <NumericInput placeholder={'请填写轮询次数'} style={{ width: '100%' }}/>
            )}
          </Form.Item>) : null
        }
        {
          [2, 6].includes(this.state.type) ? (<Form.Item
            label="轮询间隔"
          >
            {getFieldDecorator('polling_interval', {
              rules: [{ required: true, message: '请填写轮询间隔' }]
            })(
              <NumericInput placeholder={'请填写轮询间隔'} style={{ width: '100%' }}/>
            )}
          </Form.Item>) : null
        }
        {
          [3, 8, 9].includes(this.state.type) ? (<Form.Item
            label="循环参数"
          >
            {getFieldDecorator('loop_parameter', {
              rules: [{ required: true, message: '请选择回调循环参数' }]
            })(
              <CasePollParamSelect placeholder={'请选择回调循环参数'} style={{ width: '100%' }}
                                   currentNode={this.props.currentNode}/>
            )}
          </Form.Item>) : null
        }
      </Form>
    )
  }

}

const StepAddForm = Form.create({ name: 'StepAddForm' }
)(StepAdd)

export default StepAddModal
