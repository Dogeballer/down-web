import React, { useContext, useEffect, useRef, useState } from 'react'
import { Input, Spin } from 'antd'
import Tree from 'antd4/es/tree'
import style from './style.scss'
import { dataClassTree } from '../../../../api/dataClassify'
import ClassifyContext from '../context'

function AsideTree () {
  // const
  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const { state, dispatch } = useContext(ClassifyContext)
  const { selected } = state
  const [loading, setLoading] = useState(false)

  const fetch = (queryStr) => {
    setLoading(true)
    dataClassTree(queryStr)
      .then(r => {
        const data = r.data ?? []
        const expandedKeys = []
        for (const ip in data) {
          const databases = ip.children ?? []
          ip.title = ip.dataAssetIp
          ip.key = ip.dataAssetIp
          expandedKeys.push(ip.key)
          for (const base in databases) {
            base.title = base.dbServerName
            base.key = `${ip.dataAssetIp}_${base.dbServerName}`
            expandedKeys.push(ip.key)
            const tables = base.children ?? []
            for (const table in tables) {
              table.title = table.tableName
              table.key = `${ip.dataAssetIp}_${base.dbServerName}_${table.tableName}`
              if (queryStr) {
                expandedKeys.push(table.key)
              }
            }
          }
        }
        setExpandedKeys(expandedKeys)
        setTreeData(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetch()
  }, [])

  const handleSelect = (keys, { node }) => {
    dispatch('setSelected', node)
  }
  const handleSearch = (value) => {
    fetch(value)
  }
  return (
    <div className={style.aside}>
      <div className={style.top}>
        <Input.Search onSearch={handleSearch} />
      </div>
      <Spin className={style.body} spinning={loading}>
        <Tree
          treeData={treeData}
          selectedKeys={selected ? [selected.key] : []}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          onSelect={handleSelect}
        />
      </Spin>
    </div>
  )
}

export default AsideTree
