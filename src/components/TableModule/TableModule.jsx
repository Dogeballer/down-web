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
    pagination: { pageSize: PAGE_SIZE, current: 1, ...this.props.tableProps.pagination }
  }

  params = {
    query: {},
    table: {current: 1},
    custom: this.props.customParams || {}
  }

  componentDidMount () {
    if (isEmpty(this.props.autoFetch) || this.props.autoFetch) {
      const { table, query, custom } = this.params
      this.fetch({ ...table, ...query, ...custom })
    }
  }

  refresh () {
    const { table, query, custom } = this.params
    return this.fetch({ ...table, ...query, ...custom })
  }

  addRow (record) {
    const tableSource = [...this.state.tableSource]
    tableSource.unshift(record)
    this.setState({tableSource})
  }

  reset (custom = {}) {
    this.setState({
      pagination: {
        pageSize: PAGE_SIZE,
        current: 1,
        ...this.props.tableProps.pagination
      }
    })
    this.params = {
      query: {},
      table: {current: 1},
      custom: custom
    }
    return this.refresh()
  }

  fetch (param = {}) {
    this.setState({ tableSource: [] })
    if (this.props.dataFetch) {
      this.setState({ loading: true })
      return this.props.dataFetch({
        limit: this.state.pagination.pageSize,
        ...param
      }).then((response) => {
        const pagination = { ...this.state.pagination }
        let { total, list } = response.data

        if (typeof this.props.dataProcess === 'function') {
          list = this.props.dataProcess(list)
        }
        pagination.total = total
        this.setState({
          pagination,
          tableSource: list
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
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })

    // 排序参数
    let sortParams = {}
    if (sorter.field && sorter.order) {
      sortParams = {
        sort: sorter.field,
        direction: sorter.order.slice(0, -3)
      }
    }
    // 翻页参数
    this.params.table = {
      current: pagination.current,
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
    const { className, fixHeaderFlag, style, tableProps } = this.props
    let height
    if (fixHeaderFlag) {
      height = className ? 'calc(100% - 48px)' : '100%'
    }
    let { pagination, children, columns, ...restProps } = tableProps
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
    const scrollX = restProps.scroll.x || 1000
    return (
      <div className={`${utilities['table-wrapper']} ${toBlank(className)}`} style={{...style, height}}>
        {this.props.top}
        {
          fixHeaderFlag
            ? <FixHeaderWrapper minusHeight={56} tableFooterHeight={32}>
              {
                (scrollY) => <Table
                  bordered
                  loading={this.state.loading}
                  dataSource={this.state.tableSource}
                  pagination={this.state.pagination}
                  onChange={this.handleTableChange}
                  columns={columns}
                  {...restProps}
                  scroll={{x: scrollX, y: scrollY}}
                />
              }
            </FixHeaderWrapper>
            : <Table
              bordered
              loading={this.state.loading}
              dataSource={this.state.tableSource}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
              columns={columns}
              scroll={{x: scrollX}}
              {...restProps}
            />
        }
        {children}
      </div>
    )
  }
}

export default TableModule
