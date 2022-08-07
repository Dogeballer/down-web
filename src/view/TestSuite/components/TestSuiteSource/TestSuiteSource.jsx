
import React, { Component } from 'react'

import {
  Input,
  Spin,
  message,
  AutoComplete
} from 'antd'

import {
  Icon as IconFont
} from '@fishballer/bui'
import Tree from 'antd4/lib/tree'
import 'antd4/lib/tree/style/index.css'
import memoizeOne from 'memoize-one'
import '../../../../style/common.g.scss'
import constant from '../../../../constant'
import testSuiteAPI from '../../../../api/testsuite'
import events from '../../../../lib/EventEmitter'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import { treeForeach as treeEach } from '@fishballer/bui/dist/lib/tree'
import HeightKeepWrapper from '../../../../components/HeightKeepWrapper'
import style from './style.scss'

const {
  DirectoryTree
} = Tree

const {
  EVENT_TYPE
} = constant

const Search = Input.Search

const memoizeTreeData = memoizeOne((treeNodes) => {
  const renderTreeNodeTitle = title => (
    <span
      title={title}
      className={style['dispatch-node-title']}
    >
      {title}
    </span>
  )

  const renderTreeNodes = treeNodes =>
    treeNodes.map(item => {
      const { deep, id, name, children, testSuiteList } = item
      return {
        data: item,
        key: `classId_${id}`,
        icon: <IconFont
          style={{color: '#1890FF'}}
          type={deep ? 'icon-yijiwenjianjia' : 'icon-erjiwenjianjia'}
        />,
        title: renderTreeNodeTitle(name),
        children: [
          ...renderTreeNodes(children || []),
          ...renderTreeLeafNodes(testSuiteList || [])
        ]
      }
    })

  const renderTreeLeafNodes = testSuiteList =>
    testSuiteList.map(item => {
      const { id, name } = item
      return {
        isLeaf: true,
        data: item,
        key: `testSuiteId_${id}`,
        icon: <IconFont style={{color: '#1890FF'}} type='icon-wenjian' />,
        title: renderTreeNodeTitle(name),
        disabled: item.status === false || item.delete === true
      }
    })

  return renderTreeNodes(treeNodes)
})
class TestSuiteSource extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ruleList: [],
      loading: false,
      treeNodes: [],
      expandedKeys: []
    }
  }

  componentDidMount = () => {
    this.getTreeNodes()
  }

  componentWillUnmount = () => {
  }

  /**
   * 获取数据
   */
  getTreeNodes = () => {
    this.setState({ loading: true })
    testSuiteAPI.getTestSuiteClassList()
      .then(({data}) => {
        if (data.items && data.items.length === 0) message.warning('未找到匹配的数据')
        data.items && data.items.forEach(node => { node.deep = 1 })
        this.setState({
          loading: false,
          expandedKeys: this.getAllExpandKeys(),
          treeNodes: data.items || []
        })
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  }

  getAllExpandKeys = keyword => {
    let keys = []
    if (keyword && keyword !== '') {
      treeEach(this.state.treeNodes, node => {
        if (!isEmpty(node.children) || !isEmpty(node.testSuiteList))
          keys.push(`${node.id}`)
      })
    } else {
      keys = this.state.expandedKeys
    }
    return keys
  }

  /**
   * 关键字搜索
   */
  keyWordOnSearch = (value) => {
    const keyword = value.replace(/\s+/g, '')
    if (keyword) events.emit(EVENT_TYPE.DISPATCH_TREE_CHANGED, keyword)
  }

  onChange = (value) => {
    const keyword = value.replace(/\s+/g, '')
    if (!keyword) events.emit(EVENT_TYPE.DISPATCH_TREE_CHANGED)
  }

  onTreeNodeSelect = (keys, event) => {
    const key = keys[0] && keys[0].split('_')[1]
    const isLeaf = event.node.isLeaf
    this.props.onTreeNodeSelect(isLeaf, key)
  }

  onExpand = expandedKeys => {
    this.setState({ expandedKeys })
  }

  render () {
    const {
      loading,
      ruleList,
      treeNodes,
      expandedKeys
    } = this.state
    return (
      <div className={style['dispatch-source-wrapper']}>
        <div className={style['dispatch-source-header']}>
          <span>
            测试套件分类
          </span>
          {/*<AutoComplete*/}
          {/*  backfill*/}
          {/*  autoFocus={false}*/}
          {/*  dataSource={ruleList}*/}
          {/*  style={{ width: '100%' }}*/}
          {/*  onChange={this.onChange}*/}
          {/*  onSelect={this.keyWordOnSearch}*/}
          {/*  defaultActiveFirstOption={false}*/}
          {/*>*/}
          {/*  <Search*/}
          {/*    placeholder='调度规则搜索'*/}
          {/*    onSearch={value => this.keyWordOnSearch(value)}*/}
          {/*  />*/}
          {/*</AutoComplete>*/}
        </div>
        <Spin
          spinning={loading}
          wrapperClassName={'tree-wrapper ' + style['dispatch-source-body']}
        >
          <HeightKeepWrapper minus={16}>{
            (height) => (
              <DirectoryTree
                showIcon
                height={height}
                expandAction={false}
                onExpand={this.onExpand}
                onSelect={this.onTreeNodeSelect}
                expandedKeys={expandedKeys}
                treeData={memoizeTreeData(treeNodes || [])}
              />
            )
          }
          </HeightKeepWrapper>
        </Spin>
      </div>
    )
  }
}

export default TestSuiteSource
