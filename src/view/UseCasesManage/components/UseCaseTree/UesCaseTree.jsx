import { Tree, Icon } from 'antd'
import React, { Component, useEffect, useState } from 'react'
import UseCasesApi from '../../../../api/usecases'
import { isEmpty, treeCopy, treeEach } from '../../../../lib/utils'

const { TreeNode } = Tree

const UesCaseTree = ({ onPropsSelect }) => {
  const [treeData, setTreeData] = useState([])
  const [selectedKeys, setselectedKeys] = useState([])
  const [opStatus, setopStatus] = useState(undefined)
  useEffect(() => {
    fetchTreeData()
  }, [])
  const fetchTreeData = () => {
    UseCasesApi.getUseCaseTree({}).then(data => {
      let Data = data.data.items
      treeEach(Data, node => {
        if (node.modules) {
          node.title = node.name + '(user:' + node.user + ')'
          node.type = 'useCase'
        } else if (node.project) {
          node.title = node.name
          node.type = 'modules'
        } else {
          node.title = node.name
          node.type = 'project'
        }
        node.key = node.id + '-' + node.type
        if (isEmpty(node.children)) {
          delete node.children
        } else {
          node.children = node.children.filter(children => children.status === true)
          if (node.children.length === 0)
            delete node.children
        }
      })
      const tree = Data.filter(children => children.status === true)
      setTreeData(tree)
    })
    setselectedKeys(opStatus === 'category' ? [] : selectedKeys)
  }

  const onSelect = (keys, event) => {
    const props = event.node.props
    // console.log(props)
    setselectedKeys(keys)
    // setopStatus(undefined)
    onPropsSelect(keys)
  }

  const renderTreeNodes = (data) => {
    return data.map(item => {
      const selectTable = isEmpty(item.children)
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} title={item.title} {...item} selectable={selectTable}/>
    })
  }

  return (
    <Tree
      showSearch
      showLine
      defaultExpandAll
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      style={{padding:7}}
    >
      {renderTreeNodes(treeData)}
    </Tree>
  )
}

export default UesCaseTree