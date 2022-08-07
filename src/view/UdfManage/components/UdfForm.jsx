import React, { Component, useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Popover, Select, Spin } from 'antd'
import constant, { DICT_SET, EVENT_TYPE, modalFromLayout, SERVER_CONFIG } from '../../../constant'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import UdfAPI from '../../../api/udf'
import utilities from '../../../style/utilities.scss'
import NumericInput from '../../../components/NumericInput/NumericInput'
import style from '../../UseCasesManage/components/UseCaseContent/components/UseCaseStep/components/style.scss'
import { DataSourceSelect } from '../../UseCasesManage/components/UseCaseContent/components/UseCaseInfo/UseCaseInfo'
import TextArea from 'antd/es/input/TextArea'
import AceEditor from '../../../components/AceEditor'
import UseCaseAssert
  from '../../UseCasesManage/components/UseCaseContent/components/UseCaseStep/components/UseCaseInterfaceConfig/components/UsecaseAssert'
import UdfArgs from './components/UdfArgs'
import UdfApi from '../../../api/udf'
import { getNegativeUnique } from '../../../lib/utils'

function UdfEditModal (props = {}) {
  const { onOk, setUdfId, ...modalProps } = props
  const [loading, setLoading] = useState(false)
  const [sourceCode, setSourceCode] = useState()
  // const [udfId, setUdfId] = useState()
  const [udfData, setUdfData] = useState({})
  let form = null
  const onSourceCodeChangeHandle = (value) => {
    setSourceCode(value)
  }
  // console.log(udfId)
  useEffect(() => {
    // setUdfId(props.udfId)
    if (!isEmpty(props.udfId)) {
      fetch(props.udfId)
    } else {
      setUdfData({})
      setSourceCode('')
    }
  }, [props.udfId])
  const fetch = (id) => {
    // setLoading(true)
    UdfApi.getUdf(id)
      .then((r) => {
          setUdfData(r.data)
          setSourceCode(r.data.source_code)
          // setLoading(false)
        }
      )
  }
  const onOkHandler = () => {
    form.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true)
        values['source_code'] = sourceCode
        if (props.udfId) {
          // ETLClassAPI.updateClass('etl', { ...data, ...values })
          UdfAPI.updateUdf(props.udfId, values)
            .then(() => {
              setLoading(false)
              // EventEmitter.emit(EVENT_TYPE.ETL_TREE_CHANGED)
              // typeof onOk === 'function' && onOk()
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          // ETLClassAPI.addClass('etl', values)
          UdfAPI.addUdf(values)
            .then((r) => {
              const id = r.data.id
              setUdfId(id)
              setUdfData({ id, ...values })
              setLoading(false)
              // EventEmitter.emit(EVENT_TYPE.ETL_TREE_CHANGED)
              // typeof onOk === 'function' && onOk()
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
      title={isEmpty(props.udfId) ? '新建函数' : '编辑函数'}
      width={'98%'}
      onOk={onOkHandler}
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose={true}
      {...modalProps}
    >
      <EditForm
        wrappedComponentRef={ref => { form = ref }}
        udfId={props.udfId}
        data={udfData}
        loading={loading}
        onSourceCodeChange={onSourceCodeChangeHandle}
      />
    </Modal>
  )
}

class Edit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      result: '',
      loading: props.loading,
      source_code: props.data.source_code,
    }
  }

  componentDidMount () {
    if (!isEmpty(this.props.data)) {
      const { ...restProps } = this.props.data
      this.props.form.setFieldsValue({ ...restProps })
    } else {
      this.props.form.resetFields()
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.udfId !== prevProps.udfId || this.props.data !== prevProps.data) {
      // console.log(this.props.data.source_code)
      if (isEmpty(this.props.data)) this.props.form.resetFields()
      this.props.form.setFieldsValue({ ...this.props.data })
      this.setState({ source_code: this.props.data.source_code || '' })
    }
  }

  onChange = (value) => {
    this.setState({ source_code: value })
    this.props.onSourceCodeChange(value)
  }
  onlineDebug = () => {
    this.setState({ loading: true })
    UdfAPI.onlineDebug({ SourceCode: this.state.source_code })
      .then((r) => {
        this.setState({ result: r.data })
      })
      .finally(() => {
        this.setState({ loading: false })
      })

  }

  render () {
    // console.log(this.props.udfId)
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { getFieldDecorator } = this.props.form
    return (
      <Form
        {...layout}
        className={style['step-form']}
        layout={'inline'}
      >
        <div className={style['items']}>
          <div className={style['row1']}>
            <Form.Item label={'函数'}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入函数名' }]
              })(
                <Input
                  placeholder={'请输入函数名'}
                />
              )}
            </Form.Item>
            <Form.Item label={'中文'}>
              {getFieldDecorator('zh_name', {
                rules: [{ required: true, message: '请输入函数中文名' }]
              })(
                <Input
                  placeholder={'请输入函数中文名'}
                />
              )}
            </Form.Item>
            <Form.Item label={'user'}>
              {getFieldDecorator('user', {
                rules: [{ required: true, message: '请输入' }]
              })(
                <Input
                  placeholder={'请输入创建人'}
                />
              )}
            </Form.Item>
          </div>
          <div className={style['children-wrapper']}>
            <Spin spinning={this.state.loading} wrapperClassName={style['intfnet-test-wrapper']}>
              <Button
                type="primary"
                // style={{ marginLeft: 16 }}
                onClick={this.onlineDebug}
              >
                在线运行
              </Button>
              <div className={style['intfnet-test-body']}>
                <div className={style['intfnet-test-item']}>
                  <p style={{ paddingLeft: 13 }}>编辑函数源码：</p>
                  <div className={style['intfnet-item-editor']}>
                    <AceEditor
                      placeholder="Please edit source code here！"
                      mode="python"
                      theme="monokai"
                      onChange={this.onChange}
                      fontSize={14}
                      showPrintMargin={true}
                      showGutter={true}
                      highlightActiveLine={true}
                      value={this.state.source_code}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}/>
                  </div>
                </div>
                <div className={style['intfnet-test-item']}>
                  <p style={{ paddingLeft: 13 }}>执行结果：</p>
                  <div className={style['intfnet-item-editor']}>
                    <AceEditor
                      placeholder="在线执行结果返回:"
                      mode="python"
                      theme="monokai"
                      fontSize={14}
                      showPrintMargin={true}
                      showGutter={true}
                      highlightActiveLine={true}
                      value={this.state.result}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}/>
                  </div>
                </div>
              </div>
              <div className={style['intf-info-section']} style={{ marginTop: 16 }}>
                <div className={style['intf-info-title']}>
                  <Popover content={''} title="提示"
                           trigger="click">
                    <h3><a>函数参数[UdfArgs]</a></h3>
                  </Popover>
                </div>
                <div className={style['dataset-info-content']}>
                  <UdfArgs
                    udfId={this.props.udfId}
                    // onCallBackParamsChange={onCallBackParamsChange}
                  />
                </div>
              </div>
            </Spin>
          </div>
          <div className={style['remark-wrapper']}>
            <span className={style['remark-title']}>函数备注：</span>
            <div className={style['remark-textarea']}>
              {getFieldDecorator('describe')(
                <TextArea
                  maxLength={500}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  style={{ overflowY: 'auto' }}
                />
              )}
            </div>
          </div>
        </div>
      </Form>
    )
  }
}

const EditForm = Form.create({ name: 'UdfForm' })(Edit)

export default UdfEditModal
