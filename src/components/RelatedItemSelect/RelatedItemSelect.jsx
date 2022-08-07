import React, { Component } from 'react'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import { TreeSelect } from 'antd'
import { ETLRelatedItemTree } from '../../api/ETLConfig'

class RelatedItemSelect extends Component {
  state = {
    treeData: [],
    loading: false
  }

  componentDidMount () {
    this.fetch()
  }

  /**
   * 加载数据
   */
  fetch () {
    this.setState({ loading: true })
    ETLRelatedItemTree()
      .then((response) => {
        this.treeDataSet(response.data.items)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  treeDataSet (tree) {
    const treeDataTrans = (node) => {
      node.title = node.tag
      node.value = node.tag
      node.key = node.tag
      node.selectable = false
      const children = node.itemList
      Array.isArray(children) && children.forEach(child => {
        child.title = child.name
        child.value = child.id
        child.key = child.id
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
  render () {
    const {
      autoFetch,
      dictTypeId,
      ...props
    } = this.props
    return (
      <TreeSelect
        treeNodeFilterProp={'title'}
        showSearch
        allowClear
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        placeholder={'请选择'}
        loading={this.state.loading}
        treeData={this.state.treeData}
        treeDefaultExpandAll
        {...props}
      />
    )
  }
}

export default RelatedItemSelect
