import React, { useEffect, useState } from 'react'
import { TreeSelect } from 'antd'
import { dataGradeTree } from '../../api/dataGradeList'
import { treeForeach } from '@cecdataFE/bui/dist/lib/tree'

function DataClassSelect (props) {
  const [treeData, setTreeData] = useState([])
  useEffect(() => {
    dataGradeTree()
      .then(res => {
        const tree = res.data ?? []
        treeForeach(tree, node => {
          node.value = node.assetClassName
          node.title = node.assetClassName
        })
        setTreeData(tree)
      })
  }, [])
  return (
    <TreeSelect
      allowClear
      treeData={treeData}
      {...props}
    />
  )
}

export default DataClassSelect
