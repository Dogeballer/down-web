import React, { Component } from 'react'

import TestSuiteSource from './components/TestSuiteSource'
import TestSuiteContent from './components/TestSuiteContent'
import Resizer from '../../components/resizer'
import constant from '../../constant'
import style from './style.scss'

const { SUITE_CONTENT } = constant

class TestSuite extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentType: SUITE_CONTENT.SUITE_LIST,
      currentClassId: '',
      currentSuiteId: ''
    }
  }

  onTreeNodeSelect = (isLeaf, value) => {
    let {
      currentType,
      currentClassId,
      currentSuiteId
    } = this.state
    if (isLeaf) {
      currentType = SUITE_CONTENT.EDIT_SUITE
      currentSuiteId = value
    } else {
      currentType = SUITE_CONTENT.SUITE_LIST
      currentClassId = value
    }
    this.setCurrentNode({
      type: currentType,
      classId: currentClassId,
      suiteId: currentSuiteId
    })
  }

  setCurrentNode = ({ type, classId, suiteId }) => {
    const node = { currentType: type }
    node.currentClassId = classId
    node.currentSuiteId = suiteId
    this.setState(node)
  }

  render () {
    const {
      currentType,
      currentClassId,
      currentSuiteId
    } = this.state
    return (
      <div className={style['etl-dispatch-wrapper']}>
        <Resizer
          left={
            <TestSuiteSource
              onTreeNodeSelect={this.onTreeNodeSelect}
            />
          }
          right={
            <TestSuiteContent
              currentType={currentType}
              currentClassId={currentClassId}
              currentSuiteId={currentSuiteId}
              setCurrentNode={this.setCurrentNode}
            />
          }
        />
      </div>
    )
  }
}

export default TestSuite
