import React, { Component } from 'react'
import { TargetDatabaseList } from '../../api/ETLConfig'
import ClassSelect from '../ClassSelect/ClassSelect'
import AjaxSelect from '../AjaxSelect/AjaxSelect'
import { treeForeach as treeEach } from '@fishballer/bui/dist/lib/tree'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

class TargetDatabaseSelect extends Component {
  state = {
    classList: [],
    databaseList: []
  }

  render () {
    const {
      value,
      onChange,
      onDatabaseChange,
      onClassChange,
      databaseClassId,
      targetDatabaseClassName
    } = this.props

    return (
      <div>
        <ClassSelect
          placeholder={'请选择数据源分类'}
          classType={'database'}
          style={{ width: 150, marginRight: 16 }}
          value={this.state.classId || databaseClassId}
          setClassList={(classList) => {
            this.setState({ classList })
            if (isEmpty(classList) || isEmpty(targetDatabaseClassName)) return
            treeEach(classList, item => {
              if (item.name === targetDatabaseClassName) {
                this.setState({ classId: item.id })
              }
            })
          }}
          onChange={(value, e) => {
            this.setState({classId: value}, () => {
              if (!isEmpty(value)) {
                this.ajaxSelect.fetch()
              }
            })
            if (typeof onClassChange === 'function') {
              let classData = {}
              treeEach(this.state.classList, (item) => {
                if (item.id === value) classData = item
              })
              onClassChange(classData)
            }
          }}
        />
        <AjaxSelect
          ref={ref => { this.ajaxSelect = ref }}
          searchable
          autoFetch={!!this.state.classId}
          placeholder={'请选择数据库'}
          style={{ width: 'calc(100% - 166px)' }}
          disabled={isEmpty(this.state.classId)}
          fetch={() => TargetDatabaseList(this.state.classId)}
          optionsGet={(response) => (
            (response.data.items || []).map(({databaseId, databaseName, databaseNameZh}) => {
              return {
                value: databaseId,
                title: databaseNameZh ? `${databaseName}/${databaseNameZh}` : databaseName
              }
            })
          )}
          setDataList={(databaseList) => {
            this.setState({ databaseList })
          }}
          onChange={(value) => {
            const database = this.state.databaseList.find(item => item.databaseId === value)
            onDatabaseChange(database.databaseName)
            onChange(value)
          }}
          value={value}
        />
      </div>
    )
  }
}

export default TargetDatabaseSelect
