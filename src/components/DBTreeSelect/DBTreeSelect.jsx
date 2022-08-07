import React, { Component } from 'react'
import { TreeSelect } from 'antd'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import style from './style.scss'

class DBTreeSelect extends Component {
  classCode = this.props.classCode
  state = {
    loading: false,
    treeData: []
  }
  componentDidMount =() => {
    if (this.classCode) this.getDbTables()
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.classCode === this.props.classCode) return
    const { classCode, handleDunsChange } = this.props
    this.classCode = classCode
    if (this.classCode) this.getDbTables(handleDunsChange)
  }

  getDbTables = (handleDunsChange) => {
    const {
      optionsGet,
      requestMethod
    } = this.props
    this.setState({loading: true})
    requestMethod(this.classCode)
      .then((response) => {
        if (response.code === 0) {
          const newList = optionsGet(response)
          this.treeDataSet(newList)
          typeof handleDunsChange === 'function' && handleDunsChange(this.flattenData(newList))
        }
      })
      .finally(() => {
        this.setState({loading: false})
      })
  }

  treeDataSet = (tree) => {
    const treeDataTrans = (node) => {
      node.title = node.dbName
      node.value = node.dbName
      node.key = node.dbName
      node.selectable = false
      const children = node.tablesByDb
      Array.isArray(children) && children.forEach(child => {
        child.title = child.tableName
        child.value = `${node.dbName}.${child.tableName}`
        child.key = `${node.dbName}.${child.tableName}`
      })
      node.children = children
    }
    if (!isEmpty(tree)) {
      tree.forEach(t => {
        treeDataTrans(t)
      })
      this.setState({ treeData: tree })
    }
  }

  flattenData = (data) => {
    const array = [];
    (data || []).forEach(database => {
      (database.tablesByDb || []).forEach(table => {
        array.push({
          ...table,
          dbTabname: `${database.dbName}.${table.tableName}`
        })
      })
    })
    return array
  }

  render () {
    const { loading, treeData } = this.state
    const { disabled, ...restProps } = this.props
    return (
      <TreeSelect
        showSearch
        allowClear
        loading={loading}
        treeData={treeData}
        // treeDefaultExpandAll
        placeholder={'请选择'}
        treeNodeFilterProp={'title'}
        dropdownClassName={style['db-tree-wrapper']}
        disabled={loading || disabled}
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        {...restProps}
      />
    )
  }
}

export default DBTreeSelect
