import React, { Component, Fragment, useEffect, useState } from 'react'
import { Tree, Input, Modal, Empty, Button, message, Tabs, Table } from 'antd'

import moment from 'moment'
import IconFont from '../../../../components/Iconfont'
import { isJSON, timestampFormat } from '../../../../lib/utils'
import TaskLogApi from '../../../../api/tasklog'
import utilities from '../../../../style/utilities.scss'
import style from './style.scss'
import StepLogDetail from '../StepLogDetail'
import { history } from '@fishballer/bui'
import EllipsisText from '../../../../components/EllipsisText'
import { DATE_FORMAT } from '../../../../constant'

const {
  TreeNode,
  DirectoryTree
} = Tree
const TabPane = Tabs.TabPane

const DetailLogModal = (props) => {
  const { caseId, caseLogId, onCancel, ...modalProps } = props
  const handleOk = () => {
    history.push('/at/UseCasesManage?caseId=' + caseId)
    onCancel()
  }
  return (
    <Modal
      // title="详细日志"
      visible
      centered
      className={style['log-detail-modal']}
      bodyStyle={{ padding: 0, height: 'calc(90vh - 100px)' }}
      maskClosable={false}
      width={1400}
      okText={'关闭'}
      footer={[
        <Button key="submit" type="primary" onClick={handleOk}>
          跳转用例
        </Button>,
        <Button key="back" onClick={onCancel}>
          关闭
        </Button>
      ]}
      onCancel={onCancel}
      cancelButtonProps={{ style: { display: 'none' } }}
      {...modalProps}>
      <CaseLogDetail caseLogId={caseLogId}/>
    </Modal>
  )
}
const CaseLogDetail = (props) => {
  const { caseLogId } = props
  const [stepLogList, setStepLogList] = useState([])
  const [udfLogList, setUdfLogList] = useState([])
  const [selectNodeData, setSelectNodeData] = useState({})
  const [selectStepLogId, setSelectStepLogId] = useState()
  const [treeNodes, setTreeNodes] = useState([])
  useEffect(() => {
    fetch(caseLogId)
    fetchUdfLog(caseLogId)
  }, [props.caseLogId])
  const fetch = (caseLogId) => {
    TaskLogApi.stepLogList(caseLogId).then(
      (response) => {
        setSelectNodeData(response.data.items[0] || {})
        setTreeNodes(response.data.items)
        setStepLogList(response.data.items)
      }
    )
  }
  const fetchUdfLog = (caseLogId) => {
    TaskLogApi.udfLogList({ case_log: caseLogId }).then(
      (response) => {
        setUdfLogList(response.data.items)
      }
    )
  }
  const renderTreeNodes = treeNodes =>
    treeNodes.map((item, index) => <TreeNode
        data={item}
        key={index}
        title={<span style={{
          color: (item.execute_status !== 1) ? (item.execute_status === 2) ? 'rgba(178,177,193,0.63)' : '#f5222d' : 'rgba(0, 0, 0, 0.65)'
        }}>{`${'id:' + item.id + '-' + item.case_step.name + '(' + timestampFormat(item.spend_time) + ')' || '--'}`}</span>}
      >
      </TreeNode>
    )
  const handleSelect = (keys, event) => {
    const { data } = event.node.props
    setSelectStepLogId(data.id)
    setSelectNodeData(data)
  }
  const udfTableColumns = [
    {
      dataIndex: 'id',
      title: 'Id',
      width: 70,
    }, {
      dataIndex: 'original_function_str',
      title: '表达式',
      render: (value) => <EllipsisText value={value}/>
    }, {
      dataIndex: 'udf_name',
      width: 150,
      title: '参数',
      render: (value) => <EllipsisText value={value} width={134}/>

    }, {
      dataIndex: 'udf_zh_name',
      width: 150,
      title: '中文名',
      render: (value) => <EllipsisText value={value} width={134}/>

    }, {
      dataIndex: 'args',
      width: 120,
      title: '参数',
      render: (value) => <EllipsisText value={value} width={104}/>
    },
    {
      dataIndex: 'remark',
      title: '备注',
      width: 150,
      render: (value) => <EllipsisText value={value} width={134}/>
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center',
      width: 170,
      render: (value) => value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : '--'
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center',
      width: 170,
      render: (value) => value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : '--'
    },
    {
      dataIndex: 'execution_status',
      title: '状态',
      width: 70,
      fixed: 'right',
      render: (value) => {
        if (value) {
          return (<span>成功</span>)
        }
        return (<span style={{ color: '#f5222d' }}>失败</span>)
      }
    }
  ]
  return (
    <Tabs
      size={'large'}
      defaultActiveKey={'log'}
    >
      <TabPane key={'log'} tab={'详情日志'}  >
        <div className={style['service-modal-body']}>
          <div className={style['service-modal-list'] + ' ' + utilities['tree-wrapper']}>
            <DirectoryTree
              expandAction={false}
              onSelect={handleSelect}
              defaultSelectedKeys={['0']}
            >
              {renderTreeNodes(treeNodes)}
            </DirectoryTree>
          </div>
          <div className={style['service-modal-content']}>
            <StepLogDetail
              key={selectStepLogId}
              data={selectNodeData}/>
          </div>
        </div>
      </TabPane>
      <TabPane forceRender key={'info'} tab={'UDF日志'} style={{ padding: 16 }}>
        <div>
          <Table
            size="middle"
            bordered
            columns={udfTableColumns}
            rowKey={record => record.id}
            dataSource={udfLogList}
            style={{ paddingBlock: 10 }}
            scroll={{ x: 1140 }}
          />
        </div>
      </TabPane>
    </Tabs>
  )
}
export default DetailLogModal
