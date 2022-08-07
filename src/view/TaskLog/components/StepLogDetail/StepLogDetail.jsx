import React, {Component, Fragment, useEffect, useState} from 'react'
import style from './style.scss'
import {Form, Input, Button, Tooltip, Empty, Table, Select} from 'antd'
import {StatusCreator} from '@fishballer/bui'
import AceEditor from '../../../../components/AceEditor'
import {isEmpty} from '../../../../lib/utils'
import QueryResult
  from '../../../UseCasesManage/components/UseCaseContent/components/UseCaseStep/components/UseCaseSqlScriptConfig/components/QueryResult/QueryResuLt'
import EllipsisText from "../../../../components/EllipsisText";

const TextArea = Input.TextArea
const InputGroup = Input.Group
const stepType = [
  {value: 0, text: '接口执行'},
  {value: 1, text: '暂停时间'},
  {value: 2, text: '轮询接口'},
  {value: 3, text: '回调列表循环'},
  {value: 4, text: 'SQL查询'},
  {value: 5, text: 'SQL执行'},
  {value: 6, text: 'SQL轮询查询'},
  {value: 8, text: 'SQL查询列表循环'},
  {value: 9, text: 'SQL执行列表循环'},
]
const StepType = (data) => {
  const value = stepType.filter((value1, index) => value1.value === data)
  const text = value.length ? value[0].text : ''
  return <Input readOnly style={{width: '200px'}} value={text}/>
}
const StepLogDetail = (props) => {
  const {data} = props
  const {
    case_step = {},
    method,
    request_url,
    body,
    param = [],
    step_body = {},
    assert_result = [],
    poll_assert_result = [],
    sql_script = '',
    query_field = []
  } = data
  const [interfaceBody, setInterfaceBody] = useState('')
  const [receiveMessage, setreceiveMessage] = useState('')
  const [resultData, setResultData] = useState('')
  useEffect(() => {
    if (!isEmpty(body)) {
      setInterfaceBody(isEmpty(body) ? '' : JSON.stringify(body, null, '\t'))
    } else {
      setInterfaceBody('')
    }
    if ([4, 6, 8].includes(case_step['type'])) {
      if (step_body['code'] === 0) {
        setResultData(step_body['data'])
      }
    }
    if (!isEmpty(step_body)) {
      setreceiveMessage(isEmpty(step_body) ? '' : JSON.stringify(step_body, null, '\t'))
    } else {
      setreceiveMessage('')
    }
  }, [props.data])

  const formFields = [
    {
      dataIndex: 'id',
      title: '步骤号'
    },
    {
      dataIndex: 'name',
      title: '步骤名称'
    },
    {
      dataIndex: 'sort',
      title: '步骤排序'
    },
    {
      dataIndex: 'type',
      title: '步骤类型',
      type: 'select'
    }
  ]
  const columns = [
    {
      dataIndex: 'type_from',
      title: '取值类型'
    }, {
      dataIndex: 'value_statement',
      title: '语法'
    }, {
      dataIndex: 'verify_value',
      title: '期望值'
    }, {
      dataIndex: 'value',
      title: '值',
      width: 200,
      render: (value) => <EllipsisText value={value} width={184}/>
    }, {
      dataIndex: 'assert_type',
      title: '断言方式'
    }, {
      dataIndex: 'result',
      title: '断言结果',
      render: (value) => {
        if (value) {
          return (<span>成功</span>)
        }
        return (<span style={{color: '#f5222d'}}>失败</span>)
      }
    }, {
      dataIndex: 'msg',
      title: '备注'
    },
  ]
  const param_columns = [
    {
      dataIndex: 'id',
      title: 'Id'
    }, {
      dataIndex: 'name',
      title: '参数名'
    }, {
      dataIndex: 'param_in',
      title: '参数位置'
    }, {
      dataIndex: 'value',
      title: '值',
      width: 200,
      render: (value) => <EllipsisText value={value} width={184}/>
    }
  ]
  return (
    <div className={style['log-detail-section'] + ' ' + style['detail']}>
      <Form
        layout={'inline'}
        className={style['detail-form']}
      >
        {formFields.map(({dataIndex, title, type}) => {
          if (case_step) {
            let value = case_step[dataIndex]
            value = (type === 'time' && value) ? moment(value).format('YYYY-MM-DD HH:mm:ss') : value
            return (
              <Form.Item
                className={type === 'textarea' ? style['textarea-wrapper'] : null}
                key={dataIndex}
                label={title}
              >
                {type === 'textarea' ? (
                  <TextArea readOnly value={value} autoSize={false}/>
                ) : (
                  type === 'select' ? StepType(value) : <Input readOnly style={{width: '200px'}}
                                                               value={value}/>
                )}
              </Form.Item>
            )
          }
        })}
      </Form>
      {case_step['type'] !== 1 ? (
          <div style={{width: '95%'}}>
            <InputGroup compact style={{top: 0}}>
              <Input size="large" style={{width: '10%'}} disabled={true} value={method || '--'}/>
              <Tooltip placement="top" title={request_url}>
                <Input size="large" style={{width: '90%'}} disabled={true} value={request_url || '--'}/>
              </Tooltip>
            </InputGroup>
            {[0, 2, 3].includes(case_step['type']) ? (
              <div className={style['intf-info-section']} style={{marginTop: 16}}>
                <div className={style['intf-info-title']}>
                  <h3>请求参数[ParamsInfo]</h3>
                </div>
                <div className={style['dataset-info-content']}>
                  <Table
                    dataSource={param}
                    columns={param_columns}
                    bordered
                    pagination={false}
                    style={{paddingBlock: 10}}
                    size={'small'}
                  />
                </div>
              </div>) : null}
            {[2, 6].includes(case_step['type']) ? (
              <div className={style['intf-info-section']} style={{marginTop: 16}}>
                <div className={style['intf-info-title']}>
                  <h3>轮询退出判断结果[PollAssertInfo]</h3>
                </div>
                <div className={style['dataset-info-content']}>
                  <Table
                    dataSource={poll_assert_result}
                    columns={columns}
                    bordered
                    pagination={false}
                    style={{paddingBlock: 10}}
                    size={'small'}
                  />
                </div>
              </div>) : null
            }

            <div className={style['intfnet-test-body']}>
              {[0, 2, 3].includes(case_step['type']) ? (<div className={style['intfnet-test-item']}>
                <p style={{paddingLeft: 13}}>发送消息：</p>
                <div className={style['intfnet-item-editor']}>
                  <AceEditor
                    height="100%"
                    value={interfaceBody}
                  />
                </div>
              </div>) : (<div className={style['intfnet-test-item']}>
                <p style={{paddingLeft: 13}}>执行SQL：</p>
                <div className={style['intfnet-item-editor']}>
                  <AceEditor
                    height="100%"
                    mode="sql"
                    theme="xcode"
                    value={sql_script}
                    showPrintMargin={false}
                    style={{border: '1px solid #e8e8e8', ...style}}

                  />
                </div>
              </div>)}
              <div className={style['intfnet-test-item']}>
                <p style={{paddingLeft: 13}}>返回消息：</p>
                <div className={style['intfnet-item-editor']}>
                  <AceEditor
                    height="100%"
                    value={receiveMessage}
                  />
                </div>
              </div>
            </div>
            {[4, 6, 8].includes(case_step['type']) ? (
              <div className={style['intf-info-section']} style={{marginTop: 16}}>
                <div className={style['intf-info-title']}>
                  <h3>查询结果</h3>
                </div>
                <div className={style['dataset-info-content']}>
                  <QueryResult
                    loading={false}
                    columnsData={query_field}
                    queryData={resultData}
                  />
                </div>
              </div>) : null}
            <div className={style['intf-info-section']} style={{marginTop: 16}}>
              <div className={style['intf-info-title']}>
                <h3>断言结果[AssertInfo]</h3>
              </div>
              <div className={style['dataset-info-content']}>
                <Table
                  dataSource={assert_result}
                  columns={columns}
                  bordered
                  pagination={false}
                  style={{paddingBlock: 10}}
                  size={'small'}
                />
              </div>
            </div>
          </div>
        )
        : <Empty/>
      }
    </div>
  )
}

export default StepLogDetail