import React, { Component } from 'react'
import { ETLHospitalList } from '../../api/ETLConfig'
import AjaxSelect from '../AjaxSelect/AjaxSelect'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'

class HospitalSelect extends Component {
  classId = this.props.classId
  etlId = void 0
  componentWillReceiveProps (nextProps, nextContext) {
    let paramsChanged = false
    if (!isEmpty(nextProps.classId) && this.classId !== nextProps.classId) {
      this.classId = nextProps.classId
      paramsChanged = true
    }
    if (this.etlId !== nextProps.etlId) {
      this.etlId = nextProps.etlId
      paramsChanged = true
    }
    if (paramsChanged) {
      this.select.fetch(true)
    }
  }
  render () {
    return (
      <AjaxSelect
        ref={ref => { this.select = ref }}
        searchable
        fetch={() => ETLHospitalList(this.classId, this.etlId)}
        optionsGet={(response) => (
          (response.data.items || []).map(({orgCode, orgName}) => {
            return {
              value: orgCode,
              title: orgName
            }
          })
        )}
        {...this.props}
      />
    )
  }
}

export default HospitalSelect
