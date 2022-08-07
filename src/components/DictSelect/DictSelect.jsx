import React, { Component } from 'react'
import AjaxSelect from '../AjaxSelect/AjaxSelect'
import dictionaryAPI from '../../api/dictionary'

class DictSelect extends Component {
  render () {
    const {
      dictCode,
      serverName,
      ...props
    } = this.props
    return (
      <AjaxSelect
        fetch={() => dictionaryAPI.getDictList(dictCode, serverName)}
        optionsGet={(response) => (
          ((response.data && response.data.items) || []).map(({dictNum, dictName}) => {
            return {
              value: dictNum,
              title: dictName
            }
          })
        )}
        {...props}
      />
    )
  }
}

export default DictSelect
