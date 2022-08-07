import { TreeSelect } from 'antd'
import React, { Component } from 'react'
import testSuiteAPI from '../../api/testsuite'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

class ClassSelect extends Component {
  state = {
    treeData: [],
    loading: false
  }

  componentDidMount () {
    const { tree } = this.props
    if (tree) {
      this.treeDataSet(tree)
    } else {
      this.fetch()
    }
  }

  /**
   * 加载数据
   */
  fetch () {
    this.setState({ loading: true })
    let list = []
    if (this.props.showTopOption) {
      list.push({name: '一级分类', id: 0})
    }
    testSuiteAPI.getTestSuiteClassList()
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
      if (isEmpty(node)) {
        return
      }
      node.disabled = true
      const { children } = node
      Array.isArray(children) && children.forEach(t => {
        disableChildren(t)
      })
    }
    const treeDataTrans = (node) => {
      node.title = node.name
      node.value = node.id
      node.key = node.id
      if (node.status === 0 && this.props.hideDisabledClassChildren) {
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
      // const { setClassList } = this.props
      // typeof setClassList === 'function' && setClassList(tree)
    }
  }
  render () {
    const {
      autoFetch,
      filter,
      classType,
      dataFilter,
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

export default ClassSelect
