import React, { useReducer } from 'react'
import { Resizer } from '@cecdataFE/bui'
import AsideTree from './components/AsideTree'
import DatabaseContent from './components/DatabaseContent'
import ClassifyContext from './context'


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
  const left = (
    <AsideTree />
  )
  const right = (
    <DatabaseContent />
  )
  return (
    <ClassifyContext.Provider value={{ state, dispatch }}>
      <Resizer left={left} right={right} />
    </ClassifyContext.Provider>
  )
}

export default ClassifyGradeMark
