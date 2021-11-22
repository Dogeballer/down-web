import React, { useEffect, useState } from 'react'
import { TreeSelect } from 'antd'
import { dataGradeTree } from '../../api/dataGrade'
import { treeForeach } from '@cecdataFE/bui/dist/lib/tree'

function DataClassSelect (props) {
  const [treeData, setTreeData] = useState([])
  const { hasRootNode, disabledValues = [], ...restProps } = props
  useEffect(() => {
    dataGradeTree()
      .then(res => {
        const tree = res.data ?? []
        treeForeach(tree, node => {
          node.value = node.assetClassName
          node.title = node.assetClassName
          node.disabled = disabledValues.includes(node.assetClassName)
        })
        if (hasRootNode) {
          tree.unshift({
            value: '0',
            title: '作为一级分类'
          })
        }
        setTreeData(tree)
      })
  }, [])
  return (
    <TreeSelect
      allowClear
      treeData={treeData}
      {...restProps}
    />
  )
}

export default DataClassSelect
