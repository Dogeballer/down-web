import React, {useEffect, useState} from 'react'
import style from './style.scss'
import {Select, Input, Button, message, Spin, Tooltip, Modal} from 'antd'
import EnvironmentApi from '../../../../../../../api/environment'
import projects from '../../../../../../../api/projects'
import InterfaceAPI from '../../../../../../../api/interfaces'
import {isEmpty, isJSON} from '../../../../../../../lib/utils'
import AceEditor from '../../../../../../../components/AceEditor'
import InterfaceParamTest from './components/InterfaceParamTest'
import {element} from 'prop-types'
import InterfaceCallBackParams from './components/InterfaceCallBackParams'
import SwaggerForm from '../../../../InterfaceList/components/SwaggerForm'
import InterfaceToCaseForm from './components/InterfaceToCaseForm/InterfaceToCaseForm'
import jp from "jsonpath";

const InputGroup = Input.Group
const {Option} = Select

const InterfaceTest = (props) => {
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
  const [visible, setVisible] = useState(false)
  useEffect(() => {
      setLoading(true)
      Promise.all([getInterfaceInfo(props.currentNode), fetchInterfaceHistory(props.currentNode), fetchInterfaceCallBackParam(props.currentNode)])
        .then(([data, intfHis, CallBackParams]) => {
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
              if (intfHis.length !== 0) {
                setintfHisValues(intfHis[0])
                setInterfaceBody(isEmpty(intfHis[0].interface_body) ? '' : JSON.stringify(intfHis[0].interface_body, null, '\t'))
                // setinterfaceHisParam(intfHis[0].interface_param)
                let hisTestParam = intfHis[0].interface_param
                let hisSelectRows = intfHis[0].interface_param.map(({id}) => id)
                setHisSelectRows(hisSelectRows)
                interface_param.forEach((item) => {
                  if (hisSelectRows.findIndex(((element) => element === item.id)) !== -1) {
                    hisTestParam.forEach((obj) => {
                      if (obj.id === item.id) {
                        item['value'] = obj.value
                      }
                    })
                  }
                })
              } else {
                setintfHisValues([])
                setInterfaceBody('')
                setinterfaceHisParam([])
              }
              setinterfaceParam(interface_param)
              setReceiveValue({})
              setreceiveMessage('')
              setLoading(false)
            })
        })
    },
    [props.currentNode]
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
    const params = {
      'project': projectId,
      'status': true
    }
    return EnvironmentApi.getEnvironmentList(params)
      .then((response) => {
        if (response.code === 0) {
          return response.data.items
        }
      })
  }

  const fetchInterfaceHistory = (id) => {
    const params = {'test_interface': id}
    return InterfaceAPI.getInterfaceHistory(params)
      .then((response) => {
        if (response.code === 0) {
          return response.data.items
        }
      })
  }
  const fetchInterfaceCallBackParam = (id) => {
    const params = {'return_interface': id}
    return InterfaceAPI.getInterfaceCallBackParams(params)
      .then((response) => {
        if (response.code === 0) {
          return response.data.items
        }
      })
  }

  const handleChange = (value, option) => {
    setEnvironmentId(value)
    settestAddress({option}.option.props.url + intfvalues.path)
  }
  const onParamsChange = (testParam, selectRows) => {
    setTestParam(testParam)
    setSelectRows(selectRows)
  }

  const onCallBackParamsChange = () => {
    fetchInterfaceCallBackParam(props.currentNode).then((CallBackParams) => {
      CallBackParams.forEach((value, index) => {
        value['value'] = ''
      })
      setInterfaceCallBackParams(CallBackParams)
    })
  }

  const onSelectRowsChange = (selectRows) => {
    setSelectRows(selectRows)
  }
  const onTest = () => {
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
    const newInterfaceBody = () => {
      if (interfaceBody.length !== 0)
        return JSON.parse(interfaceBody)
      else {
        return {}
      }
    }

    const data = {
      'environmentId': environmentId,
      'interfaceId': props.currentNode,
      'params': newTestParam,
      'body': newInterfaceBody()
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
          <InputGroup compact>
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
            <Tooltip placement='top' title={testAddress}>
              <Input size="large" style={{width: '60%'}} disabled={true} value={testAddress || '--'}/>
            </Tooltip>
          </InputGroup>
        </div>
        <Button
          type='primary'
          style={{marginLeft: 16}}
          onClick={() => {
            if (!isJSON(interfaceBody)) return message.info('请输入正确的JSON格式')
            setInterfaceBody(JSON.stringify(JSON.parse(interfaceBody), null, '\t'))
          }}
        >
          格式化消息
        </Button>
        <Button
          type='primary'
          style={{marginLeft: 16}}
          onClick={onTest}
        >
          测试
        </Button>
        <Button
          type='primary'
          style={{marginLeft: 16}}
          onClick={() => {
            setVisible(true)
          }}
        >
          保存为用例
        </Button>
      </div>
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
          <h3>回调参数[CallBackParams]</h3>
        </div>
        <div className={style['dataset-info-content']}>
          <InterfaceCallBackParams
            interfaceCallBackParams={interfaceCallBackParams}
            return_interface={props.currentNode}
            onCallBackParamsChange={onCallBackParamsChange}
          />
        </div>
      </div>
      <div className={style['intfnet-test-body']}>
        <div className={style['intfnet-test-item']}>
          <p style={{paddingLeft: 13}}>发送消息：</p>
          <div className={style['intfnet-item-editor']}>
            <AceEditor
              height='100%'
              value={interfaceBody}
              onChange={(value) => setInterfaceBody(value)}
            />
          </div>
        </div>
        <div className={style['intfnet-test-item']}>
          <p style={{paddingLeft: 13}}>返回消息：{response_text}</p>
          <div className={style['intfnet-item-editor']}>
            <AceEditor
              height='100%'
              value={receiveMessage}
              onChange={(value) => setreceiveMessage(value)}
            />
          </div>
        </div>
      </div>
      <InterfaceToCaseForm
        param={testParam}
        selectRows={selectRows}
        body={interfaceBody}
        interface={props.currentNode}
        visible={visible}
        onOk={() => {
          setVisible(false)
        }}
        onCancel={() => {
          setVisible(false)
        }}
      />
    </Spin>
  )
}

export default InterfaceTest