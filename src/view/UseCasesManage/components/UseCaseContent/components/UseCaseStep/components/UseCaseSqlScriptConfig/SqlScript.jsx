import React, { useEffect, useState } from 'react'
import style from './style.scss'
import { Select, Input, Button, message, Spin, Tooltip, Alert, Popover } from 'antd'
// import sqlFormatter from 'sql-formatter/src/sqlFormatter'
import { format } from 'sql-formatter'
import EnvironmentApi from '../../../../../../../../api/environment'
import DataSourseApi from '../../../../../../../../api/datasourse'
import projects from '../../../../../../../../api/projects'
import InterfaceAPI from '../../../../../../../../api/interfaces'
import UsecasesAPI from '../../../../../../../../api/usecases'
import { isEmpty, isJSON } from '../../../../../../../../lib/utils'
import AceEditor from '../../../../../../../../components/AceEditor'
import InterfaceParamTest from './components/InterfaceParamTest'
import InterfaceCallBackParams from './components/InterfaceCallBackParams'
import UseCaseAssert from './components/UsecaseAssert'
import StepPoll from './components/StepPoll'
import StepCircularKey from './components/StepCircularKey'
import SQLInput from '../../../../../../../../components/SQLInput/SQLInput'
import QueryResult from './components/QueryResult/QueryResuLt'
import StepForwardAfterOperation from '../UseCaseInterfaceConfig/components/StepForwardAfterOperation'

const InputGroup = Input.Group
const { Option } = Select

const SqlScript = (props) => {
  const { sql_script, stepId, type, data_source, caseId } = props
  const jp = require('jsonpath')
  const [loading, setLoading] = useState(false)
  const [interfaceCallBackParams, setInterfaceCallBackParams] = useState([])
  const [testAddress, setTestAddress] = useState('')
  const [sqlScript, setSqlScript] = useState(sql_script)
  const [receiveMessage, setreceiveMessage] = useState('')
  const [receiveValue, setReceiveValue] = useState({})
  const [dataSourceList, setDataSourceList] = useState([])
  const [dataSourceId, setDataSourceId] = useState()
  const [queryField, setQueryField] = useState([])
  const [queryResult, setQueryResult] = useState([])
  useEffect(() => {
      setLoading(true)
      Promise.all([fetchDataSource(), fetchCallBackParam(stepId)])
        .then(([data, CallBackParams]) => {
          CallBackParams.forEach((value, index) => {
            value['value'] = ''
          })
          setInterfaceCallBackParams(CallBackParams)
          setDataSourceList(data)
          setReceiveValue({})
          setreceiveMessage('')
          setLoading(false)
          if (!isEmpty(data_source)) {
            setDataSourceId(data_source)
            let dataSourceInfo = {}
            data.forEach((item) => {
              if (item.id === data_source) {
                dataSourceInfo = item
              }
            })
            setTestAddress(dataSourceInfo.host + ':' + dataSourceInfo.port + '--' + dataSourceInfo.database)
          }
        })
    },
    [stepId, data_source]
  )

  const fetchCallBackParam = (id) => {
    const params = { 'step': id }
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

  const fetchDataSource = () => {
    const params = { 'status': true }
    return DataSourseApi.getDataSourceList(params)
      .then((response) => {
        if (response.code === 0) {
          return response.data.items
        }
      })
  }

  const onCallBackParamsChange = () => {
    if (!isEmpty(stepId)) {
      fetchCallBackParam(stepId).then((CallBackParams) => {
        CallBackParams.forEach((value, index) => {
          value['value'] = ''
        })
        setInterfaceCallBackParams(CallBackParams)
      })
    }
  }
  const handleChange = (value, option) => {
    setDataSourceId(value)
    setTestAddress({ option }.option.props.host + ':' + { option }.option.props.port + '--' + { option }.option.props.database)
  }

  const onTest = () => {
    const data = {
      'data_source_id': dataSourceId,
      'use_case_id': caseId,
      'step_type': type,
      'sql_script': sqlScript
    }
    setLoading(true)
    UsecasesAPI.sqlScriptExecute(data)
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
          setQueryField(response.data['query_field'])
          setQueryResult(response.data['query_result'])
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
          <InputGroup compact style={{ top: 0 }}>
            <Select
              size="large"
              loading={loading}
              style={{ width: '30%' }}
              value={dataSourceId}
              onChange={handleChange}
            >
              {(dataSourceList || []).map(({ id, name, host, port, database }) =>
                <Option key={id} value={id} host={host} port={port} database={database}>{name}</Option>)}
            </Select>
            <Tooltip placement="top" title={testAddress}>
              <Input size="large" style={{ width: '70%' }} disabled={true} value={testAddress || '--'}/>
            </Tooltip>
          </InputGroup>
        </div>
        <Button
          type="primary"
          style={{ marginLeft: 16 }}
          onClick={() => {
            setSqlScript(format(sqlScript))
            props.onSqlChange(format(sqlScript))
          }}
        >
          格式化SQL
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 16 }}
          onClick={onTest}
        >
          执行
        </Button>
      </div>
      <Alert message="在脚本中可使用参数{{currentDate}}/{{currentTime}}/{{instanceTime}}/{{instanceDate}}获取实例日期时间或时间戳。"
             type="info"
             showIcon
             style={{ marginBlock: 10 }}
      />
      {type === 6 ?
        <div className={style['intf-info-section']} style={{ marginTop: 16, marginBlock: 16 }}>
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
      {[8, 9].includes(type) ?
        <div className={style['intf-info-section']} style={{ marginTop: 16, marginBlock: 16 }}>
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
      <div className={style['intf-info-section']} style={{ marginTop: 16 }}>
        <div className={style['intf-info-title']}>
          <Popover content={'设置接口回调参数,可选择回调值类型,如果类型为字符串则建议命名使用如“__id”格式,类型为数组,建议命名使用如“__ids__”格式'} title="提示"
                   trigger="click">
            <h3><a>回调参数[CallBackParams]</a></h3>
          </Popover>
        </div>
        <div className={style['dataset-info-content']}>
          <InterfaceCallBackParams
            interfaceCallBackParams={interfaceCallBackParams}
            stepId={stepId}
            onCallBackParamsChange={onCallBackParamsChange}
          />
        </div>
      </div>
      <div className={style['intfnet-test-body']}>
        <div className={style['intfnet-test-item']}>
          <p style={{ paddingLeft: 13 }}>执行SQL：</p>
          <div className={style['intfnet-item-editor']}>
            <AceEditor
              height="100%"
              mode="sql"
              theme="xcode"
              value={sqlScript}
              showPrintMargin={false}
              style={{ border: '1px solid #e8e8e8', ...style }}
              onChange={(value) => {
                props.onSqlChange(value)
                setSqlScript(value)
              }}
            />
          </div>
        </div>
        <div className={style['intfnet-test-item']}>
          <p style={{ paddingLeft: 13 }}>返回结果：{response_text}</p>
          <div className={style['intfnet-item-editor']}>
            <AceEditor
              height="100%"
              value={receiveMessage}
              onChange={(value) => setreceiveMessage(value)}
            />
          </div>
        </div>
      </div>
      {[4, 6, 8].includes(type) ?
        <div className={style['intf-info-section']} style={{ marginTop: 16 }}>
          <div className={style['intf-info-title']}>
            <h3>查询结果[QueryResult]</h3>
          </div>
          <div className={style['dataset-info-content']}>
            <QueryResult
              loading={loading}
              columnsData={queryField}
              queryData={queryResult}
            />
          </div>
        </div> : null
      }
      <div className={style['intf-info-section']} style={{ marginTop: 16 }}>
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
      <div className={style['intf-info-section']} style={{ marginTop: 16 }}>
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

export default SqlScript