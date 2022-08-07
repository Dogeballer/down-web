import React, { Component } from 'react'
import { Select } from 'antd'

const { Option, OptGroup } = Select
class DbTableSelect extends Component {
  classCode = this.props.classCode
  state = {
    loading: false,
    dbTableList: []
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
          this.setState({dbTableList: newList})
          typeof handleDunsChange === 'function' && handleDunsChange(this.flattenData(newList))
        }
      })
      .finally(() => {
        this.setState({loading: false})
      })
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
    const { loading, dbTableList } = this.state
    const { disabled, ...restProps } = this.props
    return (
      <Select
        allowClear
        showSearch
        loading={loading}
        filterOption={(input, option) => {
          return typeof option.props.children === 'string' &&
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }}
        disabled={loading || disabled}
        {...restProps}
      >
        {
          (dbTableList || []).map(database =>
            <OptGroup key={database.dbName} label={<span style={{
              fontSize: 16,
              fontWeight: 600
            }}>
              {database.dbName}
            </span>}>
              {
                (database.tablesByDb || []).map(table =>
                  <Option
                    key={`${database.dbName}.${table.tableName}`}
                    value={`${database.dbName}.${table.tableName}`}
                  >
                    {table.tableNameZh ? `${table.tableNameZh} (${table.tableName})` : table.tableName}
                  </Option>
                )
              }
            </OptGroup>
          )
        }
      </Select>
    )
  }
}

export default DbTableSelect
