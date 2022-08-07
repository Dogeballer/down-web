import React, {Component, useEffect, useState} from 'react'

import {Input, Button, Icon, Form, Row, Col, Modal, Spin, message, Select} from 'antd'
// import utilities from '../../../../../../style/utilities.scss'
import {isEmpty} from '@fishballer/bui/dist/lib/utils'
// import InterfaceParamTest from './InterfaceParamTest/InterfaceParamTest'
import style from './style.scss'
import AjaxSelect from '../../../../../../components/AjaxSelect/AjaxSelect'
import ProjectAPI from '../../../../../../api/projects'
import InterfaceAPI from '../../../../../../api/interfaces'
import InterfaceParam from './InterfaceParam'
import ModuleAPI from '../../../../../../api/modules'
import {object} from 'prop-types'

const {Option, OptGroup} = Select
const {TextArea} = Input
const METHOD_TYPE = [
  {value: 'GET', title: 'GET'},
  {value: 'POST', title: 'POST'},
  {value: 'PUT', title: 'PUT'},
  {value: 'DELETE', title: 'DELETE'},
  {value: 'PATCH', title: 'PATCH'},
  {value: 'OPTION', title: 'OPTION'},
]
const INTER_STATUS = [
  {value: true, title: '正常'},
  {value: false, title: '禁用'}
]

export const InterfaceClassSelect = (props) => {
  const [loading, setLoading] = useState(false)
  const [InterfaceClassList, setInterfaceClassList] = useState([])
  useEffect(() => fetch(), [])
  const fetch = () => {
    setLoading(true)
    InterfaceAPI.getInterfaceClassSelector()
      .then(data => {
        setInterfaceClassList(data.data.items)
      })
      .finally(() => setLoading(false))
  }
  const {...restProps} = props
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
      (InterfaceClassList || []).map(project =>
        <OptGroup key={project.name} label={<span style={{
          fontSize: 16,
          fontWeight: 600
        }}>
              {project.name}
            </span>}>
          {
            (project.interface_class || []).map(interface_class =>
              <Option
                key={`${project.name}.${interface_class.class_name}`}
                value={interface_class.id}
              >
                {interface_class.class_name}
              </Option>
            )
          }
        </OptGroup>
      )
    }
  </Select>
}

class interfaceInfoConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      values: {}
    }
  }

  // ------ 生命周期区 ----- //
  componentDidMount = () => {
    if (this.props.currentNode) {
      this.getData(this.props.currentNode)
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.currentNode === this.props.currentNode) return
    this.getData(this.props.currentNode)
  }

  getData = (id) => {
    if (!id) return
    this.setState({loading: true})
    InterfaceAPI.getInterface(id)
      .then((response) => {
        if (response.code === 0) {
          const {
            ...Value
          } = response.data
          this.props.form.setFieldsValue({
            ...Value
          })
          this.setState({values: Value})
        }
      })
      .finally(() => {
        this.setState({loading: false})
      })
  }

  // ------ 事件绑定区 ----- //

  handleSave = e => {
    e.preventDefault()
    let interface_param = this.interfaceParam.values
    interface_param = interface_param.filter(v => {
      let i = 0
      Object.keys(v).forEach(key => {
        if (!v[key]) {
          i++
        }
      })
      if (i === 6) {
        return undefined
      } else {
        return v
      }
    })
    const errIndex = this.checkParamData(interface_param)
    if (!interface_param.length) {
      this.showConfirmModal(interface_param)
    } else {
      if (!errIndex.length) {
        this.showConfirmModal(interface_param)
      } else {
        {
        }
      }
    }
  }

  showConfirmModal = (interface_param) => {
    Modal.confirm({
      title: '提示',
      content: <span>是否保存所有修改内容?</span>,
      okButtonProps: {
        type: 'primary'
      },
      onOk: () => {
        this.props.form.validateFields((err, values) => {
          if (err) return
          const {currentNode} = this.props
          let interface_body = []
          let postData = {interface_param, interface_body, ...values}
          if (currentNode) {
            InterfaceAPI.updateInterface(currentNode, postData)
              .then(() => {
                this.setState({loading: true})
              })
              .finally(() => {
                this.setState({loading: false})
              })
          } else {
            InterfaceAPI.addInterface(postData)
              .then((response) => {
                this.setState({loading: true})
                this.props.addedId(response.data.id)
              })
              .finally(() => {
                this.setState({loading: false})
              })
          }
        })
      },
      onCancel: () => {
      }
    })
  }

  checkParamData = (data) => {
    let errIndex = []
    if (data.length) {
      const obj = {}
      //判断是否参数名是否重复
      data.forEach((item) => {
        const key = item.name
        if (key in obj) {
          obj[key] = obj[key] + 1
        } else {
          obj[key] = 1
        }
      })
      data.map((item, index) => {
        if (isEmpty(item.name)) {
          if (errIndex.indexOf(index) === -1) errIndex.push(index)
          message.warning('名称为必填值')
        } else if (isEmpty(item.param_in)) {
          if (errIndex.indexOf(index) === -1) errIndex.push(index)
          message.warning(`参数位置为必填值`)
        } else if (isEmpty(item.type)) {
          if (errIndex.indexOf(index) === -1) errIndex.push(index)
          message.warning('参数类型为必填值')
        } else if (isEmpty(item.required)) {
          if (errIndex.indexOf(index) === -1) errIndex.push(index)
          message.warning('是否必填为必填值')
        }
          // else if (isEmpty(item.describe)) {
          //   if (errIndex.indexOf(index) === -1) errIndex.push(index)
          //   message.warning('参数描述为必填值')
        // }
        // else if (isEmpty(item.example)) {
        //   if (errIndex.indexOf(index) === -1) errIndex.push(index)
        //   message.warning('参数示例值为必填值')
        // }
        else if (Object.values(obj).some(v => v > 1)) {
          if (errIndex.indexOf(index) === -1) errIndex.push(index)
          message.warning('参数名不能重复')
        }
        // console.log(errIndex)
      })
      return errIndex
    } else {
      return [1]
    }
  }

  cancelSave = () => {
    Modal.confirm({
      title: '提示',
      content: '是否取消所有修改',
      okButtonProps: {
        type: 'primary'
      },
      onOk: () => {
        // this.props.returnBack()
      },
      onCancel: () => {
      }
    })
  }

  // ------ 公共方法区 ----- //

  render() {
    const {
      form,
      currentNode
    } = this.props

    const {loading, values} = this.state
    const {getFieldValue, getFieldDecorator} = form
    return (
      <Form className={style['intf-info-wrapper']} onSubmit={this.handleSave}>
        <Spin spinning={loading} wrapperClassName={style['intf-info-spin']}>
          <div className={style['intf-info-section']}>
            <Row gutter={24}>
              <Col span={24} key={'id'}>
                <div className={style['intf-info-title']}>
                  <h3>基本信息配置</h3>
                  <label>( 接口编号</label>
                  <span>{currentNode || '--'}</span> )
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} key={'name'}>
                <Form.Item label={'接口名称'}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入接口名称'
                      },
                      {
                        max: 50,
                        message: '接口名称长度需小于50'
                      }
                    ]
                  })(
                    <Input placeholder='请输入接口名称' style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} key={'interface_class'}>
                <Form.Item label={'所属分类'}>
                  {getFieldDecorator('interface_class', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属分类'
                      }
                    ]
                  })(
                    <InterfaceClassSelect placeholder={'请选择'} style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} key={'status'}>
                <Form.Item label={'接口状态'}>
                  {getFieldDecorator('status', {
                    rules: [
                      {
                        required: true,
                        message: '请选择接口状态'
                      }
                    ]
                  })(
                    <Select
                      allowClear
                      placeholder={'请选择'}
                      style={{width: '100%'}}
                    >
                      {INTER_STATUS.map((option) => (
                        <Option
                          key={option.value}
                          value={option.value}
                          title={option.title}
                        >
                          {option.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} key={'method'}>
                <Form.Item label={'请求方式'}>
                  {getFieldDecorator('method', {
                    rules: [
                      {
                        required: true,
                        message: '请选择请求方式'
                      }
                    ]
                  })(
                    <Select
                      allowClear
                      placeholder={'请选择'}
                      loading={this.state.loading}
                      style={{width: '100%'}}
                    >
                      {METHOD_TYPE.map((option) => (
                        <Option
                          key={option.value}
                          value={option.value}
                          title={option.title}
                        >
                          {option.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} key={'path'}>
                <Form.Item label={'请求路径'}>
                  {getFieldDecorator('path', {
                    rules: [
                      {
                        required: true,
                        message: '请输入请求路径'
                      },
                      {
                        max: 100,
                        message: '请求路径长度需小于100'
                      }
                    ]
                  })(
                    <Input placeholder='请输入请求路径' style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={8} key={'version'}>
                <Form.Item label={'版本号'}>
                  {getFieldDecorator('version', {
                    rules: [
                      {
                        required: false,
                        message: '请填写版本号'
                      }
                    ]
                  })(
                    <Input placeholder='请输入版本号' style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24} key={'tags'}>
                <Form.Item label={'接口标签'}>
                  {getFieldDecorator('tags', {
                    rules: [
                      {
                        required: false,
                        message: '请输入接口标签'
                      }
                    ]
                  })(
                    <Input placeholder='请输入接口标签' style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24} key={'describe'}>
                <Form.Item label={'接口描述'}>
                  {getFieldDecorator('describe', {
                    rules: [
                      {
                        required: false,
                        message: '请填写描述'
                      }
                    ]
                  })(
                    <TextArea placeholder='请输入接口描述' rows={4} style={{width: '100%'}}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={style['intf-info-section']}>
            <div className={style['intf-info-title']}>
              <h3>请求参数[Param]</h3>
            </div>
            <div className={style['dataset-info-content']}>
              <InterfaceParam ref={ref => this.interfaceParam = ref} values={values}/>
            </div>
          </div>
        </Spin>
        <div className={style['dataset-info-buttons']}>
          <Button
            onClick={this.cancelSave}>
            取消
          </Button>
          <Button
            type='primary'
            htmlType={'submit'}
            style={{marginLeft: 16}}
          >
            <Icon type='save'/> 保存
          </Button>
        </div>
      </Form>
    )
  }
}

export default Form.create({name: 'interfaceInfoConfig'})(interfaceInfoConfig)
