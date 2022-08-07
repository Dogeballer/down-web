import React, {Component} from 'react'
import { message } from 'antd'
import { isEmpty, toBlank } from '@fishballer/bui/dist/lib/utils'
import {Table} from '@fishballer/bui'
import utilities from '../../style/utilities.scss'

class ScrollTable extends Component {
  state = {
    loading: false,
    dataSource: [],
    hasMore: true,
    infiniteHeight: 200
  }

  params = {
    query: {},
    table: {pageNo: 1},
    custom: this.props.customParams || {}
  }
  loadMore = (event) => {
    let maxScroll = event.target.scrollHeight - event.target.clientHeight
    let currentScroll = event.target.scrollTop
    if (!this.state.loading && currentScroll === maxScroll && !this.state.donnotLoadMore) {
      this.handleInfiniteOnLoad()
    }
  }
  componentDidMount () {
    this.tableContent = document.querySelector('.ant-table-body')
    this.tableContent.addEventListener('scroll', this.loadMore)
    if (isEmpty(this.props.autoFetch) || this.props.autoFetch) {
      this.getData()
    }
    window.addEventListener('resize', this.handleHeight)
    this.handleHeight()
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.handleHeight)
    this.tableContent.removeEventListener('scroll', this.loadMore)
  }
  handleHeight = () => {
    const formHeight = document.getElementById('form').scrollHeight + 18// 查询那一栏的高度
    const navHeight = 70// 导航条的高度
    const headHeight = 64// head的高度
    const scrollY = this.props.height || document.body.clientHeight - navHeight - headHeight - formHeight - 100// 这个10不减会出现滚动调，我也不知道哪里多出来的，反正多减一点
    this.setState({scrollY: scrollY})
  }
  getFirstRecord () {
    const {dataSource} = this.state
    if (dataSource.length > 0) {
      return dataSource[0]
    }
  }
  getData (values) {
    this.setState({loading: true, donnotLoadMore: false})
    if (this.props.dataFetch) {
      return this.props.dataFetch({...this.props.params, pageSize: 20, pageNo: 1, ...this.state.filterParams, ...values})
        .then(response => {
          if (response.code === 8001) {
            window.location.reload()
          }
          const {dataList, operationHandle, hasMoreRows, totalRecord} = response.data
          this.setState({dataSource: dataList,
            operationHandle: operationHandle,
            hasMoreRows: hasMoreRows,
            totalRecord: totalRecord
          })
          this.props.onload && this.props.onload(response.data)
          return response
        }).finally(() => {
          this.handleHeight()
          this.setState({loading: false})
        })
    }
    return Promise.reject(new Error())
  }
  handleInfiniteOnLoad = () => {
    const {operationHandle, totalRecord, hasMoreRows, dataSource} = this.state
    const {field} = this.props
    if (!this.state.loading && hasMoreRows === true) {
      this.setState({loading: true})
      this.props.loadMore({pageNo: 1, pageSize: 10, ...operationHandle, totalRecord, field: field})
        .then(response => {
          if (response.code === 8001) {
            window.location.reload()
          }
          const dataList = response.data && response.data.dataList
          this.setState({
            dataSource: [...dataSource, ...dataList],
            operationHandle: response.data.operationHandle,
            hasMoreRows: response.data.hasMoreRows
          })
        }).finally(() => {
          this.setState({loading: false})
        })
    } else {
      message.success('数据已下载完毕')
      this.setState({donnotLoadMore: true})
    }
  }
  render () {
    const { dataSource, loading, scrollY } = this.state
    let { children, columns, scrollX, rowKey, ...tableProps } = this.props.tableProps
    columns = columns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          editRender: col.editRender,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      }
    })
    return (
      <div className={`${utilities['table-wrapper']} ${toBlank(this.props.className)}`}>
        <div id='form'>{this.props.top}</div>
        <Table
          id='table'
          bordered
          rowKey={rowKey}
          loading={loading}
          style={{tableLayout: 'fixed'}}
          dataSource={dataSource}
          columns={columns}
          {...tableProps}
          footer={this.props.footer}
          pagination={false}
          scroll={{ x: scrollX, y: scrollY }}
        />
      </div>

    )
  }
}

export default ScrollTable
