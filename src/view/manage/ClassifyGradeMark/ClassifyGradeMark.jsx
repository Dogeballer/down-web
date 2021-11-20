import React, { useReducer } from 'react'
import { Resizer } from '@cecdataFE/bui'
import AsideTree from './components/AsideTree'
import ClassifyContext from './context'
import DatabaseTable from './components/DatabaseTable'

const initState = {
  selected: null
}
const reducer = (state, action) => {
  const [type, payload] = action
  switch (type) {
    case 'setSelected': {
      const { selected } = payload
      state.selected = selected
      return { ...state }
    }
  }
}

const ClassifyGradeMark = (props) => {
  const [state, dispatch] = useReducer(reducer, { ...initState })
  const { selected } = state
  return (
    <ClassifyContext.Provider value={{ state, dispatch: (type, action) => dispatch([type, action]) }}>
      <Resizer left={<AsideTree />} right={<DatabaseTable />} />
    </ClassifyContext.Provider>
  )
}

export default ClassifyGradeMark
