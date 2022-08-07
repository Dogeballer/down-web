import React, { Component } from 'react'
import { TargetDatabaseList } from '../../api/ETLConfig'
import ClassSelect from '../ClassSelect/ClassSelect'
import AjaxSelect from '../AjaxSelect/AjaxSelect'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

class TargetDatabaseSelect extends Component {
  state = {
    classId: this.props.databaseClassId
  }
  static getDerivedStateFromProps (nextProps) {
    if ('databaseClassId' in nextProps) {
      return {classId: nextProps.databaseClassId}
    } else {
      return null
    }
  }

  render () {
    const {onClassChange, onChange, value} = this.props
    return (
      <div>
        <ClassSelect
          placeholder={'请选择数据源分类'}
          classType={'database'}
          style={{ width: 150, marginRight: 16 }}
          value={this.state.classId}
          onChange={(value, e) => {
            this.setState({classId: value}, () => {
              if (!isEmpty(value)) {
                this.ajaxSelect.fetch()
              }
            })
            if (typeof onClassChange === 'function') {
              onClassChange(value)
            }
            if (typeof onChange === 'function') {
              onChange(void 0)
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
          onChange={onChange}
          value={value}
        />
      </div>
    )
  }
}

export default TargetDatabaseSelect
