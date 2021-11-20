import React, { useContext, useEffect, useState } from 'react'
import { Input, Spin } from 'antd'
import Tree from 'antd4/es/tree'
import 'antd4/es/tree/style/index.css'
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
        for (const ip of data) {
          const databases = ip.children ?? []
          ip.title = ip.dataAssetIp
          ip.key = ip.dataAssetIp
          expandedKeys.push(ip.key)
          for (const base of databases) {
            base.title = base.dbServerName
            base.key = `${ip.dataAssetIp}_${base.dbServerName}`
            if (queryStr) {
              expandedKeys.push(base.key)
            }
            const tables = base.children ?? []
            for (const table of tables) {
              table.title = table.tableName
              table.key = `${ip.dataAssetIp}_${base.dbServerName}_${table.tableName}`
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

  const handleSelect = (keys, { node: { dataAssetIp, dbServerName, tableName, key } }) => {
    dispatch('setSelected', { dataAssetIp, dbServerName, tableName, key })
  }
  const handleSearch = (value) => {
    fetch(value)
  }
  return (
    <div className={style.aside}>
      <div className={style.top}>
        <Input.Search placeholder='搜索IP/库名/表名' onSearch={handleSearch} />
      </div>
      <div className={style.body}>
        <Spin spinning={loading}>
          <Tree
            treeData={treeData}
            selectedKeys={selected ? [selected.key] : []}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            onSelect={handleSelect}
          />
        </Spin>
      </div>
    </div>
  )
}

export default AsideTree
