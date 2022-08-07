import { TreeSelect } from 'antd'
import React, { Component } from 'react'
import categoryAPI from '../../api/category'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import { CATEGORY_FIELD_TYPE } from '../../constant'

class CategorySelect extends Component {
  state = {
    treeData: [],
    loading: false
  }

  componentDidMount () {
    const { tree, autoFetch } = this.props
    if (autoFetch) {
      this.fetch()
    } else {
      this.treeDataSet(tree)
    }
  }

  /**
   * 加载数据
   */
  fetch () {
    this.setState({ loading: true })
    let list = []
    if (this.props.showTopOption) {
      list.push({[this.fieldType.name]: '作为一级分类', [this.fieldType.id]: 0})
    }
    categoryAPI.getCategoryList(this.props.classType)
      .then((response) => {
        list = list.concat(response.data.items || [])
        this.treeDataSet(list)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  treeDataSet (tree) {
    const disableChildren = (node) => {
      if (isEmpty(node)) return
      node.disabled = true
      const { children } = node
      Array.isArray(children) && children.forEach(t => {
        disableChildren(t)
      })
    }
    const treeDataTrans = (node) => {
      node.title = node[this.fieldType.name]
      node.value = node[this.fieldType.id]
      node.key = node[this.fieldType.id]
      // 数据建模部分状态0停用
      if (node.status === 0 || node.privateFlag === 1) {
        disableChildren(node)
      } else {
        if (typeof this.props.filter === 'function' && node.disabled === void 0) {
          node.disabled = this.props.filter(node)
          if (node.disabled) {
            disableChildren(node)
          }
        }
      }
      const { children } = node
      Array.isArray(children) && children.forEach(t => {
        treeDataTrans(t)
      })
    }
    if (!isEmpty(tree)) {
      tree.forEach(t => {
        treeDataTrans(t)
      })
      this.setState({ treeData: tree })
    }
  }

  get fieldType () {
    const { classType } = this.props
    return classType === 'table' ? CATEGORY_FIELD_TYPE.TABLE_TYPE : CATEGORY_FIELD_TYPE.DATABASE_TYPE
  }

  render () {
    const {
      filter,
      classType,
      dataFilter,
      autoFetch,
      ...otherProps
    } = this.props
    return (
      <TreeSelect
        showSearch
        allowClear
        treeNodeFilterProp={'title'}
        placeholder={'请选择分类'}
        loading={this.state.loading}
        treeData={this.state.treeData}
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        {...otherProps}
      />
    )
  }
}

export default CategorySelect
