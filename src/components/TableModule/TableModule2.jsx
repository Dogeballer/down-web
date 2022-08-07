import React, {Component} from 'react'
import { Table } from '@fishballer/bui'
import { isEmpty, toBlank } from '@fishballer/bui/dist/lib/utils'
import constant from '../../constant'
import utilities from '../../style/utilities.scss'
import FixHeaderWrapper from '../FixHeaderWrapper'

const {PAGE_SIZE} = constant
/**
 * @constructor
 * @param {object} props
 * @param {object} props.tableProps - antd的Table参数
 * @param {function(json?): Promise<ResponseJson>>} props.dataFetch - 表格获取数据函数, 参数为查询条件, 返回promise对象
 * @param {boolean} props.autoFetch - 表格是否自动加载
 */
class TableModule extends Component {
  // formRef = React.createRef()

  state = {
    loading: false,
    tableSource: [],
    pagination: { pageSize: PAGE_SIZE, pageNo: 1, ...this.props.tableProps.pagination }
  }

  params = {
    query: {},
    table: {pageNo: 1, pageSize: 20},
    custom: this.props.customParams || {}
  }

  componentDidMount () {
    if (isEmpty(this.props.autoFetch) || this.props.autoFetch) {
      const { table, query, custom } = this.params
      this.fetch({ ...table, ...query, ...custom })
    }
  }

  refresh () {
    const { table, query, custom, form } = this.params
    return this.fetch({ ...table, ...query, ...custom, ...form })
  }

  addRow (record) {
    const tableSource = [...this.state.tableSource]
    tableSource.unshift(record)
    this.setState({tableSource})
  }

  reset (form = {}) {
    this.setState({
      pagination: {
        pageSize: PAGE_SIZE,
        pageNo: 1,
        ...this.props.tableProps.pagination
      }
    })
    this.params = {
      ...this.params,
      form: form
    }
    return this.refresh()
  }

  fetch (param = {}) {
    if (this.props.dataFetch) {
      this.setState({ loading: true })
      return this.props.dataFetch({
        pageSize: this.state.pagination.pageSize,
        ...param
      }).then((response) => {
        if (response.code === 8001) {
          window.location.reload()
        }
        const pagination = { ...this.state.pagination }
        let { total, data } = response.data
        if (typeof this.props.dataProcess === 'function') {
          data = this.props.dataProcess(data)
        }
        if (typeof this.props.handleData === 'function') {
          data = this.props.handleData(response.data)
        }
        pagination.total = total
        this.setState({
          pagination,
          tableSource: data
        })
        return response
      }).finally(() => {
        this.setState({ loading: false })
      })
    }
    return Promise.reject(new Error())
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.pageNo = pagination.current
    this.setState({
      pagination: pager
    })

    // 排序参数
    let sortParams = {}
    if (sorter.field) {
      sortParams = {
        sort: sorter.field,
        direction: sorter.order.slice(0, -3)
      }
    }
    // 翻页参数
    this.params.table = {
      pageNo: pagination.current,
      ...sortParams
    }
    this.refresh()
  }

  handleSave = (row, onError) => {
    const key = this.props.tableProps.rowKey
    const newData = [...this.state.tableSource]
    const index = newData.findIndex(item => row[key] === item[key])
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    this.setState({ tableSource: newData })
    this.props.onSave && this.props.onSave(row, onError)
  };

  render () {
    const { fixHeaderFlag } = this.props
    let style
    if (fixHeaderFlag) {
      if (this.props.className) {
        style = { height: 'calc(100% - 48px)' }
      } else {
        style = { height: '100%' }
      }
    }
    let { pagination, children, columns, ...tableProps } = this.props.tableProps
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
    const scrollX = tableProps.scroll.x || 1000
    return (
      <div className={`${utilities['table-wrapper']} ${toBlank(this.props.className)}`} style={style}>
        {this.props.top}
        {
          fixHeaderFlag
            ? <FixHeaderWrapper minusHeight={96} tableFooterHeight={32}>
              {
                (scrollY) => <Table
                  bordered
                  loading={this.state.loading}
                  dataSource={this.state.tableSource}
                  pagination={this.state.pagination}
                  onChange={this.handleTableChange}
                  rowKey={(record, index) => index}
                  columns={columns}
                  {...tableProps}
                  scroll={{x: scrollX, y: scrollY}}
                />
              }
            </FixHeaderWrapper>
            : <Table
              bordered
              rowKey={(record, index) => index}
              loading={this.state.loading}
              dataSource={this.state.tableSource}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
              columns={columns}
              {...tableProps}
            />
        }
        {children}
      </div>
    )
  }
}

export default TableModule
