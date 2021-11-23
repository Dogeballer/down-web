import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Input, Spin } from 'antd'
import Tree from 'antd4/es/tree'
import 'antd4/es/tree/style/index.css'
import style from './style.scss'
import { dataClassTree } from '../../../../api/dataClassify'
import ClassifyContext from '../context'
import { treeForeach } from '@cecdataFE/bui/dist/lib/tree'

function AsideTree (props) {
  const { editable } = props
  const [treeData, setTreeData] = useState([])
  const chinese = useRef(true)
  const [expandedKeys, setExpandedKeys] = useState([])
  const { state, dispatch } = useContext(ClassifyContext)
  const { selected } = state
  const [loading, setLoading] = useState(false)

  const fetch = (queryStr) => {
    setLoading(true)
    dataClassTree({ keyword: queryStr, tableShowStatus: editable ? null : 1 })
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
              table.title = chinese.current ? (table.tableNameNotes || table.tableName) : table.tableName
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

  const handleSelect = (keys, { node }) => {
    dispatch('setSelected', node)
  }
  const handleSearch = (value) => {
    fetch(value)
  }
  const handleChineseSwitch = () => {
    chinese.current = !chinese.current
    treeForeach(treeData, (node, deep) => {
      if (deep === 3) {
        node.title = chinese.current ? (node.tableNameNotes || node.tableName) : node.tableName
      }
    })
    setTreeData([...treeData])
  }
  return (
    <div className={style.aside}>
      <div className={style.top}>
        <Input.Search placeholder='搜索IP/库名/表名' onSearch={handleSearch} />
        <Button type='link' size='large' icon='retweet' onClick={handleChineseSwitch} />
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
