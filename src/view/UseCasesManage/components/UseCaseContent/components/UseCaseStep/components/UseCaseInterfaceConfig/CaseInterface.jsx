import React, {useEffect, useState} from 'react'
import style from './style.scss'
import {Select, Input, Button, message, Spin, Tooltip, Alert, Popover, Modal} from 'antd'
import EnvironmentApi from '../../../../../../../../api/environment'
import projects from '../../../../../../../../api/projects'
import InterfaceAPI from '../../../../../../../../api/interfaces'
import UsecasesAPI from '../../../../../../../../api/usecases'
import {isEmpty, isJSON} from '../../../../../../../../lib/utils'
import AceEditor from '../../../../../../../../components/AceEditor'
import InterfaceParamTest from './components/InterfaceParamTest'
import InterfaceCallBackParams from './components/InterfaceCallBackParams'
import UseCaseAssert from './components/UsecaseAssert'
import StepPoll from './components/StepPoll'
import StepCircularKey from './components/StepCircularKey'
import StepForwardAfterOperation from './components/StepForwardAfterOperation'
import jp from "jsonpath";

const InputGroup = Input.Group
const {Option} = Select

const CaseInterface = (props) => {
  const {interfaceId, body, params, stepId, type} = props
  const header_param = {
    'id': -1,
    'name': 'authorization',
    'describe': '请求头token,在UAC接口不可用时使用',
    'required': false,
    'example': 'string',
    'param_in': 'header',
    'type': 'string',
    'value': ''
  }
  const jp = require('jsonpath')
  const [loading, setLoading] = useState(false)
  const [intfvalues, setIntfValues] = useState({})
  const [interfaceParam, setinterfaceParam] = useState([])
  const [interfaceCallBackParams, setInterfaceCallBackParams] = useState([])
  const [intfHisValues, setintfHisValues] = useState({})
  const [testAddress, settestAddress] = useState('')
  const [environmentUrl, setEnvironmentUrl] = useState('')
  const [interfaceBody, setInterfaceBody] = useState('')
  const [interfaceHisParam, setinterfaceHisParam] = useState({})
  const [receiveMessage, setreceiveMessage] = useState('')
  const [receiveValue, setReceiveValue] = useState({})
  const [environmentList, setEnvironmentList] = useState([])
  const [environmentId, setEnvironmentId] = useState('')
  const [testParam, setTestParam] = useState([])
  const [selectRows, setSelectRows] = useState([])
  const [hisSelectRows, setHisSelectRows] = useState([])
  useEffect(() => {
      setLoading(true)
      Promise.all([getInterfaceInfo(interfaceId), fetchInterfaceCallBackParam(stepId)])
        .then(([data, CallBackParams]) => {
          fetchEnvironment(data.project)
            .then(envList => {
              const interface_param = data.interface_param
              interface_param.forEach((value, index) => {
                value['value'] = ''
              })
              CallBackParams.forEach((value, index) => {
                value['value'] = ''
              })
              // interface_param.unshift(header_param)
              setIntfValues(data)
              setEnvironmentList(envList)
              setEnvironmentUrl(envList.length === 0 ? '' : envList[0].url)
              setEnvironmentId(envList.length === 0 ? '' : envList[0].id)
              settestAddress(envList.length === 0 ? data.path : envList[0].url + data.path)
              setInterfaceCallBackParams(CallBackParams)
              if (!isEmpty(params)) {
                let hisSelectRows = params.map(({id}) => id)
                setHisSelectRows(hisSelectRows)
                interface_param.forEach((item) => {
                  if (hisSelectRows.findIndex(((element) => element === item.id)) !== -1) {
                    params.forEach((obj) => {
                      if (obj.id === item.id) {
                        item['value'] = obj.value
                      }
                    })
                  }
                })
              } else {
                setinterfaceHisParam([])
                setHisSelectRows([])
              }
              setInterfaceBody(body)
              setinterfaceParam(interface_param)
              setReceiveValue({})
              setreceiveMessage('')
              setLoading(false)
              // console.log(selectRows)
            })
        })
    },
    [stepId]
  )
  const getInterfaceInfo = (id) => {
    return InterfaceAPI.getInterface(id)
      .then((response) => {
        if (response.code === 0) {
          return response.data
        }
      })
  }

  const fetchEnvironment = (projectId) => {
    const params = {'project': projectId, 'status': true}
    return EnvironmentApi.getEnvironmentList(params)
      .then((response) => {
        if (response.code === 0) {
          return response.data.items
        }
      })
  }

  const fetchInterfaceCallBackParam = (id) => {
    const params = {'step': id}
    if (isEmpty(id)) {
      return []
    } else {
      return UsecasesAPI.getStepCallBackParams(params)
        .then((response) => {
          if (response.code === 0) {
            return response.data.items
          }
        })
    }
  }

  const handleChange = (value, option) => {
    setEnvironmentId(value)
    settestAddress({option}.option.props.url + intfvalues.path)
  }

  const onParamsChange = (testParam, selectRows) => {
    let newParam = testParam.filter((item) => {
      if (item.id !== -1) {
        if (item.value) {
          return true
        }
      }
    })
    const newCaseParam = []
    newParam.forEach((item) => {
      return newCaseParam.push({id: item.id, name: item.name, param_in: item.param_in, value: item.value})
    })
    props.onParamChange(newCaseParam)
    setTestParam(testParam)
    setSelectRows(selectRows)
  }

  const onCallBackParamsChange = () => {
    if (!isEmpty(stepId)) {
      fetchInterfaceCallBackParam(stepId).then((CallBackParams) => {
        CallBackParams.forEach((value, index) => {
          value['value'] = ''
        })
        setInterfaceCallBackParams(CallBackParams)
      })
    }
  }

  const onSelectRowsChange = (selectRows) => {
    setSelectRows(selectRows)
  }
  const onTest = () => {
    if (!isJSON(interfaceBody) && !isEmpty(body)) return message.info('请输入正确的JSON格式')
    let newTestParam = testParam.filter((item) => {
      if (item.value) {
        return true
      }
    })
    newTestParam = newTestParam.filter((item) => {
        if (selectRows.findIndex((element) => element === item.id) !== -1)
          return true
      }
    )

    const data = {
      'environmentId': environmentId,
      'interfaceId': interfaceId,
      'params': newTestParam,
      'body': interfaceBody
    }
    if (newTestParam.length < selectRows.length) {
      // message.warning('请填写勾选参数值')
      Modal.confirm({
        title: '提示',
        content: <span>未填写勾选参数,是否继续请求?</span>,
        okButtonProps: {
          type: 'primary'
        },
        onOk: () => {
          setLoading(true)
          InterfaceAPI.InterfaceTest(data)
            .then((response) => {
              if (response.code === 0) {
                setReceiveValue(response.data)
                setreceiveMessage(JSON.stringify(response.data['response_body'], null, '\t'))
                interfaceCallBackParams.forEach((value, index) => {
                  const values = jp.query(response.data.response_body, value.json_path)
                  if (values.toString().toLowerCase().indexOf('object') !== -1)
                    value['value'] = JSON.stringify(values)
                  else {
                    value['value'] = values.toString()
                  }
                })
                setInterfaceCallBackParams(interfaceCallBackParams)
              }
            })
            .finally(() => {
              setLoading(false)
            })
        }
        ,
        onCancel: () => {
        }
      })
    } else {
      setLoading(true)
      InterfaceAPI.InterfaceTest(data)
        .then((response) => {
          if (response.code === 0) {
            setReceiveValue(response.data)
            setreceiveMessage(JSON.stringify(response.data['response_body'], null, '\t'))
            interfaceCallBackParams.forEach((value, index) => {
              const values = jp.query(response.data.response_body, value.json_path)
              if (values.toString().toLowerCase().indexOf('object') !== -1)
                value['value'] = JSON.stringify(values)
              else {
                value['value'] = values.toString()
              }
            })
            setInterfaceCallBackParams(interfaceCallBackParams)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }
  const response_text = isEmpty(receiveValue) ? '' : `('CODE'：${receiveValue.response_code} && '响应时间'：${receiveValue.response_time})`
  return (
    <Spin spinning={loading} wrapperClassName={style['intfnet-test-wrapper']}>
      <div className={style['intfnet-test-header']}>
        <div className={style['intfnet-header-desc']}>
          <InputGroup compact style={{top: 0}}>
            <Select
              size="large"
              loading={loading}
              style={{width: '28%'}}
              value={environmentId}
              onChange={handleChange}
            >
              {(environmentList || []).map(({id, name, url}) =>
                <Option key={id} value={id} url={url}>{name}</Option>)}
            </Select>
            <Input size="large" style={{width: '12%'}} disabled={true} value={intfvalues.method || '--'}/>
            <Tooltip placement="top" title={testAddress}>
              <Input size="large" style={{width: '60%'}} disabled={true} value={testAddress || '--'}/>
            </Tooltip>
          </InputGroup>
        </div>
        <Button
          type="primary"
          style={{marginLeft: 16}}
          onClick={() => {
            if (!isJSON(interfaceBody)) return message.info('请输入正确的JSON格式')
            setInterfaceBody(JSON.stringify(JSON.parse(interfaceBody), null, '\t'))
          }}
        >
          格式化消息
        </Button>
        <Button
          type="primary"
          style={{marginLeft: 16}}
          onClick={onTest}
        >
          测试
        </Button>
      </div>
      <Alert message="在请求参数以及消息体中可使用参数{{currentDate}}/{{currentTime}}/{{instanceTime}}/{{instanceDate}}获取实例日期时间或时间戳。"
             type="info"
             showIcon
             style={{marginBlock: 10}}
      />
      {type === 2 ?
        <div className={style['intf-info-section']} style={{marginTop: 16, marginBlock: 16}}>
          <div className={style['intf-info-title']}>
            <Popover content={'设置轮询退出条件,执行中当轮询条件全部满足，则退出当前轮询。'} title="提示" trigger="click">
              <h3><a>轮询退出条件设置[StepPollInfo]</a></h3>
            </Popover>
          </div>
          <div className={style['dataset-info-content']}>
            <StepPoll
              stepId={stepId}
              // onCallBackParamsChange={onCallBackParamsChange}
            />
          </div>
        </div> : null
      }
      {type === 3 ?
        <div className={style['intf-info-section']} style={{marginTop: 16, marginBlock: 16}}>
          <div className={style['intf-info-title']}>
            <Popover
              content={'回调参数列表内容为字符串列表则无需设置循环键(替换参数为回调参数"__list__.item"),' +
              '如果回调参数列表为对象列表则需要设置对象取值键以及替换参数(参照"_id_"格式)'}
              title="提示"
              trigger="click">
              <h3><a>步骤循环键[StepCircularKey]</a></h3>
            </Popover>
          </div>
          <div className={style['dataset-info-content']}>
            <StepCircularKey
              stepId={stepId}
            />
          </div>
        </div> : null
      }
      <div className={style['intf-info-section']}>
        <div className={style['intf-info-title']}>
          <h3>请求参数[Param]</h3>
        </div>
        <div className={style['dataset-info-content']}>
          <InterfaceParamTest
            onParamsChange={onParamsChange}
            interfaceParam={interfaceParam}
            onSelectRowsChange={onSelectRowsChange}
            hisSelectRows={hisSelectRows}
            // ref={ref => interfaceParamTest = ref}
          />
        </div>
      </div>
      <div className={style['intf-info-section']} style={{marginTop: 16}}>
        <div className={style['intf-info-title']}>
          <Popover content={'设置接口回调参数,可选择回调值类型,如果类型为字符串则建议命名使用如“__id”格式,类型为数组,建议命名使用如“__ids__”格式'} title="提示"
                   trigger="click">
            <h3><a>回调参数[CallBackParams]</a></h3>
          </Popover>
        </div>
        <div className={style['dataset-info-content']}>
          <InterfaceCallBackParams
            interfaceCallBackParams={interfaceCallBackParams}
            return_interface={interfaceId}
            stepId={stepId}
            onCallBackParamsChange={onCallBackParamsChange}
          />
        </div>
      </div>
      <div className={style['intfnet-test-body']}>
        <div className={style['intfnet-test-item']}>
          <p style={{paddingLeft: 13}}>发送消息：</p>
          <div className={style['intfnet-item-editor']}>
            <AceEditor
              height="100%"
              value={interfaceBody}
              onChange={(value) => {
                props.onBodyChange(value)
                setInterfaceBody(value)
              }}
            />
          </div>
        </div>
        <div className={style['intfnet-test-item']}>
          <p style={{paddingLeft: 13}}>返回消息：{response_text}</p>
          <div className={style['intfnet-item-editor']}>
            <AceEditor
              height="100%"
              value={receiveMessage}
              onChange={(value) => setreceiveMessage(value)}
            />
          </div>
        </div>
      </div>
      <div className={style['intf-info-section']} style={{marginTop: 16}}>
        <div className={style['intf-info-title']}>
          <Popover content={'断言取值可以按照“$.data.items[*].length()”进行数组长度取值判断。'} title="提示"
                   trigger="click">
            <h3><a>断言设置[AssertInfo]</a></h3>
          </Popover>
        </div>
        <div className={style['dataset-info-content']}>
          <UseCaseAssert
            stepId={stepId}
            // onCallBackParamsChange={onCallBackParamsChange}
          />
        </div>
      </div>
      <div className={style['intf-info-section']} style={{marginTop: 16}}>
        <div className={style['intf-info-title']}>
          <Popover content={'可变更已有回调参数以及全局参数值，uac全局token现在可通过{{token}}取值变更。' +
          '\n变更值可传入UDF函数，返回值需要与原值类型相同。'} title="提示"
                   trigger="click">
            <h3><a>步骤前置后置操作[StepForwardAfterOperation]</a></h3>
          </Popover>
        </div>
        <div className={style['dataset-info-content']}>
          <StepForwardAfterOperation
            stepId={stepId}
            // onCallBackParamsChange={onCallBackParamsChange}
          />
        </div>
      </div>
    </Spin>
  )
}

export default CaseInterface