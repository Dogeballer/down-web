import React, {Component} from 'react'
import { Table } from '@fishballer/bui'
import { toBlank } from '../../lib/utils'
import utilities from '../../style/utilities.scss'
import FixHeaderWrapper from '../FixHeaderWrapper'
// 这是把tableSource传进来的表格
class NoPageTableModule extends Component {
  // formRef = React.createRef()

  params = {
    query: {},
    table: {pageNo: 1},
    custom: this.props.customParams || {}
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
    let { children, columns, ...tableProps } = this.props.tableProps
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
            ? <FixHeaderWrapper minusHeight={48}>
              {
                (scrollY) => <Table
                  bordered
                  loading={this.props.loading}
                  dataSource={this.props.tableSource}
                  columns={columns}
                  {...tableProps}
                  scroll={{x: scrollX, y: scrollY}}
                  footer={this.props.footer}
                  pagination={false}
                />
              }
            </FixHeaderWrapper>
            : <Table
              bordered
              loading={this.props.loading}
              tableSource={this.props.tableSource}
              columns={columns}
              {...tableProps}
              footer={this.props.footer}
              pagination={false}
            />
        }
        {children}
      </div>
    )
  }
}

export default NoPageTableModule
