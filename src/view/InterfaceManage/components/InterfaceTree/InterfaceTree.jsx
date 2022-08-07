import { Tree, Icon } from 'antd'
import React, { Component, useEffect, useState } from 'react'
import InterfacesApi from '../../../../api/interfaces'
import { isEmpty, treeCopy, treeEach } from '../../../../lib/utils'

const { TreeNode } = Tree

const InterfaceTree = ({ onPropsSelect }) => {
  const [treeData, setTreeData] = useState([])
  const [selectedKeys, setselectedKeys] = useState([])
  const [opStatus, setopStatus] = useState(undefined)
  useEffect(() => {
    fetchTreeData()
  }, [])
  const fetchTreeData = () => {
    InterfacesApi.getInterfaceTree().then(res => {
      let Data = res.data.items
      treeEach(Data, node => {
        if (node.interface_class) {
          node.title = node.name + '(' + node.method + ')'
          node.type = 'interface'
        } else if (node.project) {
          node.title = node.name
          node.type = 'interface_class'
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
      // settreeData(treedata)
      let firstLeaf = undefined

      let found = false
    })
    setselectedKeys(opStatus === 'category' ? [] : selectedKeys)
  }
  const toggleCategory = () => {
    setopStatus('category')
    setselectedKeys([])
  }

  const onSelect = (selectedKeys, info) => {
    setselectedKeys(selectedKeys)
    setopStatus(undefined)
    onPropsSelect(selectedKeys)
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
      style={{ padding: 7 }}
    >
      {renderTreeNodes(treeData)}
    </Tree>
  )
}
InterfaceTree.defaultProps = {
  onPropsSelect: (key) => {}
}

export default InterfaceTree