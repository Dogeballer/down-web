import React, { Component, Fragment } from 'react'
import { Tree, Input, Modal, Empty, Button, message } from 'antd'

import moment from 'moment'
import FileSaver from 'file-saver'
import IconFont from '../Iconfont'
import { isJSON } from '../../lib/utils'
import systemLogAPI from '../../api/systemLog'
import utilities from '../../style/utilities.scss'
import style from './style.scss'

const { TextArea } = Input
const {
  TreeNode,
  DirectoryTree
} = Tree
class DetailLogModal extends Component {
  constructor () {
    super()
    this.state = {
      treeNodes: [],
      logInfo: {},
      expandedKeys: [],
      visible: false
    }
  }

  dataFetch (id) {
    this.props.dataFetch(id)
      .then(response => {
        if (response.code === 0) {
          const expandedKeys = []
          let treeNodes = response.data
          treeNodes.forEach((item, index) => {
            expandedKeys.push(`category_${index}`)
          })
          this.getComponentInfo(treeNodes?.[0]?.id || treeNodes?.[0]?.componentLogList?.[0]?.id)
          this.setState({ treeNodes, expandedKeys })
        }
      })
      .finally(() => {
        this.setState({ visible: true })
      })
  }

  getComponentInfo = (id) => {
    if (id === void 0) return
    systemLogAPI.serviceComponentDetail(id)
      .then((response) => {
        if (response.code === 0) {
          this.setState({ logInfo: response.data })
        }
      })
  }

  showModal = (id) => {
    this.dataFetch(id)
  }

  parseJson = (data, type) => {
    if (type === 'in') {
      return isJSON(data) ? JSON.stringify(JSON.parse(data), null, '\t') : data
    } else {
      if (!isJSON(data)) return data
      const dataString = JSON.stringify(JSON.parse(data), null, '\t')
      return dataString.length > 5000 ? dataString.substring(0, 5000) + '\r\n完整消息体请导出查看...' : dataString
    }
  }

  handleExport = (item) => {
    if (!item.outMessage) message.info('空消息不允许导出')
    const stringify = isJSON(item.outMessage)
      ? JSON.stringify(JSON.parse(item.outMessage), null, '\t')
      : item.outMessage
    var blob = new Blob([stringify], {type: 'text/plain;charset=utf-8'})
    FileSaver.saveAs(blob, '出参消息.txt')
  }

  renderTreeNodes = treeNodes =>
    treeNodes.map((item, index) => <TreeNode
      data={item}
      key={`category_${index}`}
      icon={<IconFont style={{color: '#1890FF'}} type={'icon-yijiwenjianjia'} />}
      title={<span style={{
        color: (item.callResult && item.callResult !== 1) ? '#f5222d' : 'rgba(0, 0, 0, 0.65)'
      }}>{`${item.componentName || '--'}`}</span>}
    >
      {
        (item.componentLogList || []).map((item, index) => <TreeNode
          isLeaf
          data={item}
          key={`leaf_${index}`}
          icon={<IconFont style={{color: '#1890FF'}} type='icon-wenjian' />}
          title={<span style={{
            color: (item.callResult && item.callResult !== 1) ? '#f5222d' : 'rgba(0, 0, 0, 0.65)'
          }}>{`${item.componentName || '--'}`}</span>}
        />)
      }
    </TreeNode>
    )

  handleSelect = (keys, event) => {
    const { data } = event.node.props
    let { expandedKeys } = this.state
    this.getComponentInfo(data?.id)
    if (!expandedKeys.includes(keys[0])) {
      expandedKeys.push(keys[0])
    } else {
      expandedKeys = expandedKeys.filter(item => item !== keys[0])
    }
    this.setState({ expandedKeys })
    this.tree.onExpand([...expandedKeys])
  }

  render () {
    const { treeNodes, expandedKeys, logInfo } = this.state
    return (
      <Modal
        title='详细日志'
        width={1000}
        visible={this.state.visible}
        bodyStyle={{ height: 512, overflow: 'auto', padding: 12 }}
        onCancel={() => this.setState({ visible: false })}
        onOk={() => this.setState({ visible: false })}
        footer={null}
      >
        <div className={style['service-modal-body']}>
          <div className={style['service-modal-list'] + ' ' + utilities['tree-wrapper']}>
            <DirectoryTree
              expandAction={false}
              expandedKeys={expandedKeys}
              ref={ref => { this.tree = ref }}
              onSelect={this.handleSelect}
            >
              { this.renderTreeNodes(treeNodes) }
            </DirectoryTree>
          </div>
          <div className={style['service-modal-content']}>
            {
              logInfo && Object.keys(logInfo).length > 0
                ? <Fragment>
                  <div className={style['discribe']}>
                    <div className={style['step-info']}>
                      <div className={style['step-item']}>
                        <span className={style['step-item-one']}>组件名：{logInfo?.componentName || '--'}</span>
                        <span>传入时间：{logInfo && moment(logInfo.acceptTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                        <span>传出时间：{logInfo && moment(logInfo.returnTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </div>
                      <div className={style['step-item']}>
                        <span className={style['step-item-one']}>用时：{`${logInfo?.takeTime || '--'}ms`}</span>
                        <span>状态：{logInfo?.callResultName || '--'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={style['message']}>
                    <div className={style['message-content-block']}>
                      <p className={style['title']}>消息传入内容：</p>
                      <TextArea
                        readOnly
                        className={style['text-content']}
                        value={this.parseJson(logInfo.inMessage, 'in')}
                      />
                    </div>
                    <div className={style['message-content-block']}>
                      <div className={style['title']}>
                        <span>消息传出内容:</span>
                        <Button
                          type='primary'
                          size='small'
                          onClick={() => this.handleExport(logInfo)}
                        >
                          <IconFont
                            type='icon-export1'
                          /> 导出
                        </Button>
                      </div>
                      <TextArea
                        readOnly
                        className={style['text-content']}
                        value={this.parseJson(logInfo.outMessage, 'out')}
                      />
                    </div>
                  </div>
                </Fragment>
                : <Empty />
            }
          </div>
        </div>
      </Modal>
    )
  }
}

export default DetailLogModal
