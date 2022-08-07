import React, { Component, useEffect, useState } from 'react'
import { Spin, message, Tree } from 'antd'

import { Icon as IconFont } from '@fishballer/bui'
import memoizeOne from 'memoize-one'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import HeightKeepWrapper from '../../../../components/HeightKeepWrapper'
import style from './style.scss'
import TaskLogApi from '../../../../api/tasklog'
import myHistory from '../../../../route/history'
import { timestampFormat } from '../../../../lib/utils'

const {
  DirectoryTree
} = Tree
const query = myHistory.getQuery()
const memoizeTreeData = memoizeOne((treeNodes) => {
  const renderTreeNodeTitle = (title, executor, spend_time, total, failed) => (
    <span
      title={
        `${title}-${executor}(${spend_time})(${failed}/${total})`
      }
      className={style['log-node-title']}
    >
      <span>{title}({executor})({spend_time})</span>
        <span>
          (<span style={{ color: '#F5222D' }}>{failed}</span>/
            <span>{total}</span>)
          </span>
    </span>
  )

  const renderTreeNodes = treeNodes =>
    treeNodes.map(item => {
      const { deep, folderId, folderList, contentList } = item
      return {
        isLeaf: false,
        data: item,
        key: `folderId_${folderId}`,
        icon: <IconFont
          style={{ color: '#1890FF' }}
          type={deep ? 'icon-yijiwenjianjia' : 'icon-erjiwenjianjia'}
        />,
        title: item.folderName,
        children: [
          ...renderTreeNodes(folderList || []),
          ...renderTreeLeafNodes(contentList || [])
        ]
      }
    })

  const renderTreeLeafNodes = contentList =>
    contentList.map(item => {
      let spend_time = timestampFormat(item.spend_time)
      return {
        isLeaf: true,
        data: item,
        key: `contentId_${item['id']}`,
        icon: <IconFont style={{ color: '#1890FF' }} type="icon-wenjian"/>,
        title: renderTreeNodeTitle(
          item.contentName,
          item.executor,
          spend_time,
          item.total,
          item.failed_count
        )
      }
    })

  return renderTreeNodes(treeNodes)
})

const LogSource = (props) => {
  const [loading, setLoading] = useState(false)
  const [treeNodes, setTreeNodes] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [logDate, setLogDate] = useState(props.logDate)
  useEffect(() => {
      if (query.query.job_id) {
        if (logDate === props.logDate) {
          getTreeNodes({ job_id: query.query.job_id })
        } else {
          setLogDate(props.logDate)
          getTreeNodes({ execute_date: props.logDate })
        }
      } else {
        setLogDate(props.logDate)
        getTreeNodes({ execute_date: props.logDate })
      }
    }
    , [props.logDate])
  const getTreeNodes = (params) => {
    setLoading(true)
    TaskLogApi.getTaskLogTree(params).then(
      ({ data }) => {
        const { items } = data
        items.folderList && items.folderList.forEach(node => { node.deep = 1 })
        setLoading(false)
        setExpandedKeys(getAllExpandKeys(items.folderList))
        setTreeNodes(items.folderList || [])
      }
    ).catch(() => {setLoading(false)})
  }
  const getAllExpandKeys = (treeNodes) => {
    let keys = []
    const expandAllKeys = function (nodes) {
      nodes.forEach(_ => {
        if (!isEmpty(_.folderList) || !isEmpty(_.contentList)) {
          keys.push(`folderId_${_.folderId}`)
        }
        if (!isEmpty(_.folderList)) expandAllKeys(_.folderList)
      })
    }
    expandAllKeys(treeNodes)
    return keys
  }
  const onTreeNodeSelect = (keys, event) => {
    const { isLeaf, data } = event.node.props
    const params = {}
    if (selectedKeys[0] === keys[0]) {
      setSelectedKeys([])
      return props.onTreeNodeSelect(isLeaf, data, params)
    } else {
      if (isLeaf) {
        const { id } = data
        params.task_log = id
        props.onTreeNodeSelect(isLeaf, data, params)
        setSelectedKeys(keys)
      }
    }
  }
  return (
    <Spin
      spinning={loading}
      wrapperClassName={'tree-wrapper ' + style['log-source-wrapper']}
    >
      <HeightKeepWrapper minus={16}>{
        (height) => (
          <DirectoryTree
            showIcon
            height={height}
            expandAction={false}
            onExpand={setExpandedKeys}
            onSelect={onTreeNodeSelect}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            treeData={memoizeTreeData(treeNodes || [])}
          />
        )
      }
      </HeightKeepWrapper>
    </Spin>
  )
}

export default LogSource
