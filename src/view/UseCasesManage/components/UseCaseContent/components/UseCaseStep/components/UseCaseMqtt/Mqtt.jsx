import React, {useEffect, useState} from 'react'
import style from './style.scss'
import {Select, Input, Button, message, Spin, Tooltip, Alert, Popover, InputNumber} from 'antd'
// import sqlFormatter from 'sql-formatter/src/sqlFormatter'
import {format} from 'sql-formatter'
import MqttApi from '../../../../../../../../api/mqtt'
import UsecasesAPI from '../../../../../../../../api/usecases'
import {isEmpty, isJSON} from '../../../../../../../../lib/utils'
import AceEditor from '../../../../../../../../components/AceEditor'
import UseCaseAssert from './components/UsecaseAssert'
import StepForwardAfterOperation from '../UseCaseInterfaceConfig/components/StepForwardAfterOperation'
import StepCircularKey from "../UseCaseSqlScriptConfig/components/StepCircularKey";

const InputGroup = Input.Group
const {Option} = Select

const Mqtt = (props) => {
  const {body, stepId, type, mqtt, caseId, topic, qos} = props
  const [loading, setLoading] = useState(false)
  const [interfaceCallBackParams, setInterfaceCallBackParams] = useState([])
  const [mqttPayload, setMqttPayload] = useState(body)
  const [mqttTopic, setMqttTopic] = useState(topic)
  const [mqttQos, setMqttQos] = useState(qos)
  const [receiveMessage, setreceiveMessage] = useState('')
  const [receiveValue, setReceiveValue] = useState({})
  const [mqttList, setMqttList] = useState([])
  const [mqttId, setMqttId] = useState(mqtt)
  useEffect(() => {
      setLoading(true)
      Promise.all([fetchMqttList(), fetchCallBackParam(stepId)])
        .then(([data, CallBackParams]) => {
          CallBackParams.forEach((value, index) => {
            value['value'] = ''
          })
          setInterfaceCallBackParams(CallBackParams)
          setMqttList(data)
          setReceiveValue({})
          setreceiveMessage('')
          setLoading(false)
          setMqttTopic(topic)
          if (!isEmpty(mqtt)) {
            setMqttId(mqtt)
            let mqttInfo = {}
            data.forEach((item) => {
              if (item.id === mqtt) {
                mqttInfo = item
              }
            })
          }
        })
    },
    [stepId]
  )

  const fetchCallBackParam = (id) => {
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

  const fetchMqttList = () => {
    const params = {'status': true}
    return MqttApi.getMqttClientList(params)
      .then((response) => {
        if (response.code === 0) {
          return response.data.items
        }
      })
  }


  const onTest = () => {
    const data = {
      "mqtt_id": mqttId,
      "topic": mqttTopic,
      "qos": mqttQos,
      "payload": mqttPayload
    }
    setLoading(true)
    UsecasesAPI.mqttPublish(data)
      .then((response) => {
        if (response.code === 0) {
          setReceiveValue(response.data)
          setreceiveMessage(JSON.stringify(response.data['response_body'], null, '\t'))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const onSub = () => {
    const data = {
      "mqtt_id": mqttId,
      "topic": mqttTopic,
      "qos": mqttQos,
    }
    setLoading(true)
    UsecasesAPI.mqttSub(data)
      .then((response) => {
        if (response.code === 0) {
          setReceiveValue(response.data)
          setreceiveMessage(JSON.stringify(response.data['response_body'], null, '\t'))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const response_text = isEmpty(receiveValue) ? '' : `('CODE'：${receiveValue.response_code} && '响应时间'：${receiveValue.response_time})`
  return (
    <Spin spinning={loading} wrapperClassName={style['intfnet-test-wrapper']}>
      <div className={style['intfnet-test-header']}>
        <div className={style['intfnet-header-desc']}>
          <InputGroup compact style={{top: 0}}>
            <Select
              style={{width: '20%'}}
              value={mqttId}
              size="large"
              placeholder={'请选择MQTT客户端'}
              showSearch={true}
              optionFilterProp={'children'}
              allowClear={true}
              loading={loading}
              onChange={(value) => {
                setMqttId(value)
                props.onMqttChange(value)
              }
              }
              {...props}
            >
              {(mqttList || []).map(({id, name}) => <Option key={id} value={id}>{name}</Option>)}
            </Select>
            <Input size="large" style={{width: '10%'}} disabled={true} value={type === 10 ? '推送' : '订阅'}/>
            <Tooltip placement="top" title={mqttTopic}>
              <Input size="large" style={{width: '50%'}} value={mqttTopic}
                     placeholder={'请填写topic'}
                     onChange={
                       (e) => {
                         setMqttTopic(e.target.value)
                         props.onTopicChange(e.target.value)
                       }
                     }
              />
            </Tooltip>
            <InputNumber size="large" style={{width: '15%'}}
                         value={mqttQos}
                         placeholder={'请填写qos'}
                         onChange={
                           (value) => {
                             setMqttQos(value)
                             props.onQosChange(value)
                           }
                         }
            />
          </InputGroup>
        </div>
        {[10, 12].includes(type) ? <Button
          type="primary"
          style={{marginLeft: 16}}
          onClick={() => {
            if (!isJSON(mqttPayload)) return message.info('请输入JSON格式')
            setMqttPayload(JSON.stringify(JSON.parse(mqttPayload), null, '\t'))
          }}
        >
          Json格式化
        </Button> : null}
        {[10, 12].includes(type) ? <Button
          type="primary"
          style={{marginLeft: 16}}
          onClick={onTest}
        >
          推送
        </Button> : <Button
          type="primary"
          style={{marginLeft: 16}}
          onClick={onSub}
        >
          订阅(timeout=10s)
        </Button>}
      </div>
      <Alert message="在脚本中可使用参数{{currentDate}}/{{currentTime}}/{{instanceTime}}/{{instanceDate}}获取实例日期时间或时间戳。"
             type="info"
             showIcon
             style={{marginBlock: 10}}
      />
      {type === 12 ?
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

      {[10, 12].includes(type) ? <div className={style['intfnet-test-body']}>
        <div className={style['intfnet-test-item']}>
          <p style={{paddingLeft: 13}}>发送消息：</p>
          <div className={style['intfnet-item-editor']}>
            <AceEditor
              height="100%"
              value={mqttPayload}
              onChange={(value) => {
                props.onBodyChange(value)
                setMqttPayload(value)
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
      </div> : null}
      {type === 11 ? <div className={style['intfnet-test-body']}>
        <div className={style['mqtt-sub-item']}>
          <p style={{paddingLeft: 13}}>订阅接收消息（测试订阅消息接收1条有效消息）：{response_text}</p>
          <div className={style['intfnet-item-editor']}>
            <AceEditor
              height="100%"
              value={receiveMessage}
              onChange={(value) => setreceiveMessage(value)}
            />
          </div>
        </div>
      </div> : null}
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

export default Mqtt