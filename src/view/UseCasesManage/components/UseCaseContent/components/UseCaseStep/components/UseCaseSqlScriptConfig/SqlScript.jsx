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
  const response_text = isEmpty(receiveValue) ? '' : `('CODE'???${receiveValue.response_code} && '????????????'???${receiveValue.response_time})`
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
          ?????????SQL
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 16 }}
          onClick={onTest}
        >
          ??????
        </Button>
      </div>
      <Alert message="???????????????????????????{{currentDate}}/{{currentTime}}/{{instanceTime}}/{{instanceDate}}???????????????????????????????????????"
             type="info"
             showIcon
             style={{ marginBlock: 10 }}
      />
      {type === 6 ?
        <div className={style['intf-info-section']} style={{ marginTop: 16, marginBlock: 16 }}>
          <div className={style['intf-info-title']}>
            <Popover content={'????????????????????????,???????????????????????????????????????????????????????????????'} title="??????" trigger="click">
              <h3><a>????????????????????????[StepPollInfo]</a></h3>
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
              content={'??????????????????????????????????????????????????????????????????(???????????????????????????"__list__.item"),' +
              '???????????????????????????????????????????????????????????????????????????????????????(??????"_id_"??????)'}
              title="??????"
              trigger="click">
              <h3><a>???????????????[StepCircularKey]</a></h3>
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
          <Popover content={'????????????????????????,????????????????????????,???????????????????????????????????????????????????__id?????????,???????????????,????????????????????????__ids__?????????'} title="??????"
                   trigger="click">
            <h3><a>????????????[CallBackParams]</a></h3>
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
          <p style={{ paddingLeft: 13 }}>??????SQL???</p>
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
          <p style={{ paddingLeft: 13 }}>???????????????{response_text}</p>
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
            <h3>????????????[QueryResult]</h3>
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
          <Popover content={'???????????????????????????$.data.items[*].length()????????????????????????????????????'} title="??????"
                   trigger="click">
            <h3><a>????????????[AssertInfo]</a></h3>
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
          <Popover content={'???????????????????????????????????????????????????uac??????token???????????????{{token}}???????????????' +
          '\n??????????????????UDF????????????????????????????????????????????????'} title="??????"
                   trigger="click">
            <h3><a>????????????????????????[StepForwardAfterOperation]</a></h3>
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