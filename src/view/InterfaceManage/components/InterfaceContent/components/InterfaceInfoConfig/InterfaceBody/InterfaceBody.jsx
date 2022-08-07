import React, { Component } from 'react'

import { Button, Divider, Popconfirm, Icon, Modal } from 'antd'

import { Table } from '@fishballer/bui'

import {
  pushNewNode,
  getParentNode,
  getAllExpandKeys,
  handleNodeTreeData,
  resetDataForNodeChange
} from '../../../../../../../lib/utils'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import { treeForeach as treeEach } from '@fishballer/bui/dist/lib/tree'
import classnames from 'classnames'
import NodeForm from './components/NodeForm'
import IconFont from '../../../../../../../components/Iconfont'
import FixHeaderWrapper from '../../../../../../../components/FixHeaderWrapper'
import EllipsisText from '../../../../../../../components/EllipsisText'
import interfaceAPI from '../../../../../../../api/interfaces'
import utilities from '../../../../../../../style/utilities.scss'
import style from './style.scss'

class InterfaceBody extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      record: {},
      paramList: [],
      expandedKeys: [],
      loading: false,
      messageBody: '',
      paramFormat: 1,
      nodeVisible: false,
    }
  }

  // ------ 生命周期区 ----- //
  componentDidMount = () => {
    this.init(this.props.currentNode)
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.currentNode === this.props.currentNode) return
    this.init(nextProps.currentNode)
  }

  // ------ 数据交互区 ----- //

  init = (node) => {
    this.getParamList(node)
    this.setEnterParamList(node)
  }

  getParamList = (node) => {
    this.setState({ loading: true })
    interfaceAPI.getInterfaceBody(node)
      .then((response) => {
        if (response.code === 0) {
          const { items } = response.data
          const expandedKeys = getAllExpandKeys(items)
          this.setState({
            loading: false,
            expandedKeys,
            data: items || [],
          })
        }
      })
  }

  setEnterParamList = (node) => {
    interfaceAPI.getInterfaceBody(node)
      .then((response) => {
        if (response.code === 0) {
          const { items } = response.data
          handleNodeTreeData({ nodeList: items, isNodeTree: false })
          this.setState({ paramList: items })
        }
      })
  }

  // ------ 事件绑定区 ----- //

  // handleDelete = (record) => {
  //   let newData = [...this.state.data]
  //   let parentNode = getParentNode(newData, record.id)
  //   if (Array.isArray(parentNode)) {
  //     newData = parentNode.filter(item => item.id !== record.id)
  //   } else {
  //     parentNode.children = parentNode.children.filter(item => item.id !== record.id)
  //   }
  //   this.setState({ data: newData })
  // }
  handleDelete = (record) => {
    interfaceAPI.deleteInterfaceBody(record.id)
      .then(() => {
        this.setState({
          loading: true
        })
        this.init(this.props.currentNode)
        // EventEmitter.emit(EVENT_TYPE.ETL_TREE_CHANGED)
      })
      .finally(() => {
        this.setState({
          loading: false
        })
      })

  }

  /**
   * 节点处理成功回调
   */
    // handleNodeOk = (values) => {
    //   let { data, record } = this.state
    //   const keyLength = Object.keys(record).length
    //   if (keyLength === 0 || keyLength === 1) {
    //     data = pushNewNode(data, values.parent, values)
    //
    //   } else {
    //     data = resetDataForNodeChange(data, record, values)
    //
    //   }
    //   this.setState({ data, nodeVisible: false })
    // }
  handleNodeOk = () => {
    this.init(this.props.currentNode)
    this.setState({
      nodeVisible: false,
    })
  }

  /**
   * 消息处理成功回调
   */

  handleSave = () => {
    const { currentNode } = this.props
    interfaceAPI.getIntfBelongService(currentNode.id)
      .then((response) => {
        if (response.code === 0) {
          this.showConfirmModal(response.data.serviceInfo)
        }
      })
  }

  getConfirmTitle = () => (
    <div className={utilities['confirm-title-wrapper']}>
      <span>是否保存所有修改内容?</span>
    </div>
  )

  showConfirmModal = () => {
    Modal.confirm({
      title: '提示',
      content: this.getConfirmTitle(),
      okButtonProps: {
        type: 'primary'
      },
      onOk: () => {
        const { currentNode } = this.props
        const { messageBody, paramFormat, data } = this.state
        const params = {
          list: data,
          paramFormat,
          messageBody,
          interfaceId: currentNode.id
        }
        interfaceAPI.addIntfParamInfo(params)
          .then((response) => {
            if (response.code === 0) this.getParamList(currentNode)
          })
      },
      onCancel: () => {}
    })
  }

  cancelSave = () => {
    Modal.confirm({
      title: '提示',
      content: '是否取消所有修改',
      okButtonProps: {
        type: 'primary'
      },
      onOk: () => {
        this.props.returnBack()
      },
      onCancel: () => {}
    })
  }

  // ------ 公共方法区 ----- //

  createColumns = () => {
    this.initLength = 1000
    this.columns = [
      {
        title: '消息结构',
        dataIndex: 'name',
        width: 340,
        render: (value, record) => record.paramCategory === 2
          ? <font style={{ color: 'rgba(0, 0, 0, 0.35)' }}>{`${value} (属性)`}</font> : value
      },
      {
        title: '是否必填',
        dataIndex: 'required',
        width: 100,
        align: 'center',
        render: (value) => value ? '是' : '否'
      },
      {
        title: '是否循环',
        dataIndex: 'circulation',
        width: 100,
        align: 'center',
        render: (value) => value ? '是' : '否'
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 100,
        align: 'center',
        render: (value) => value
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 260,
        align: 'center',
        render: (value, reord) => <EllipsisText value={value} width={244}/>
      },
      {
        title: '示例值',
        dataIndex: 'example',
        width: 100,
        align: 'center',
        render: (value) => value
      }
    ]

    const operate = {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 150,
      align: 'center',
      render: (data, record, index) => (
        <div className={utilities['opt-display-center']}>
          <IconFont
            title={'编辑'}
            position={index}
            type={'icon-bianji'}
            style={{ fontSize: 24 }}
            onClick={() => {
              this.setState({
                nodeVisible: true,
                record: { ...record }
              })
            }}
          />
          <Divider type='vertical'/>
          <IconFont
            title={'增加子节点'}
            position={index}
            type={record.node ? 'icon-zengjia1' : 'icon-zengjia'}
            style={{ fontSize: 24 }}
            className={record.node ? '' : utilities['opt-disabled']}
            onClick={() => {
              if (record.node) {
                this.setState({
                  nodeVisible: true,
                  record: { parent: record.id }
                })
              }
            }}
          />
          <Divider type='vertical'/>
          <Popconfirm
            title='确定要删除吗?'
            onConfirm={() => { this.handleDelete(record) }}
            okText={'删除'}
            placement='topRight'
          >
            <IconFont
              title={'删除'}
              position={index}
              type={'icon-shanchu1'}
              style={{ fontSize: 24 }}
            />
          </Popconfirm>
        </div>
      )
    }
    this.columns = [...this.columns, operate]
  }

  filterExpandedKeys = (expanded, record) => {
    let newExpandedKeys = []
    const { expandedKeys } = this.state
    if (expanded) {
      newExpandedKeys = [...expandedKeys]
      newExpandedKeys.push(record.id)
    } else {
      newExpandedKeys = expandedKeys.filter(item => item !== record.id)
    }
    return newExpandedKeys
  }

  getAddNodeFlag = (record) => {
    const { data, paramFormat } = this.state
    const parentNode = getParentNode(data, record.id)
    const parentNotCycle = !Array.isArray(parentNode) && !parentNode.cycle
    return record.node === 1 || (record.paramCategory === 0 && paramFormat === 2 && parentNotCycle)
  }

  render () {
    const {
      data,
      record,
      loading,
      nodeVisible,
      paramList,
      paramFormat,
    } = this.state

    const {
      currentNode = {}
    } = this.props

    this.createColumns()

    return (
      <div className={style['intf-param-wrapper']}>
        <div className={classnames(utilities['table-wrapper'], style['intf-param-content'])}>
          <div className={utilities['table-button-group']}>
            <Button
              type='primary'
              onClick={() => {
                this.setState({
                  record: {},
                  nodeVisible: true
                })
              }}>
              <IconFont type={'icon-addcopy'}/>
              新建节点
            </Button>
          </div>
          <FixHeaderWrapper minusHeight={48} tableFooterHeight={0}>
            {
              (scrollY) => <Table
                bordered
                rowKey={'id'}
                loading={loading}
                columns={this.columns}
                dataSource={handleNodeTreeData({ nodeList: data, isNodeTree: false })}
                onExpand={(expanded, record) => {
                  this.setState({ expandedKeys: this.filterExpandedKeys(expanded, record) })
                }}
                expandedRowKeys={this.state.expandedKeys}
                scroll={{ x: this.initLength, y: scrollY }}
                pagination={false}
              />
            }
          </FixHeaderWrapper>
        </div>
        {/*<div className={style['intf-params-buttons']}>*/}
        {/*  <Button*/}
        {/*    onClick={this.cancelSave}>*/}
        {/*    取消*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    type='primary'*/}
        {/*    htmlType={'submit'}*/}
        {/*    onClick={this.handleSave}*/}
        {/*    style={{ marginLeft: 16 }}>*/}
        {/*    <Icon type='save'/> 保存*/}
        {/*  </Button>*/}
        {/*</div>*/}
        {
          nodeVisible ? (
            <NodeForm
              visible
              nodeTree={data}
              record={record}
              interfaceId={currentNode}
              paramList={paramList}
              onCancel={() => this.setState({ nodeVisible: false })}
              onOk={this.handleNodeOk}
            />
          ) : null
        }
      </div>
    )
  }
}

export default InterfaceBody
