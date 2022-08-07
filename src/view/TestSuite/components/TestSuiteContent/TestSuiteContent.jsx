import React, { Component } from 'react'

import PageHeader from '../../../../components/PageHeader'
import TestSuiteTable from './components/TestSuiteTable'
import TestSuiteForm from '../TestSuiteForm'
import constant from '../../../../constant'

const { SUITE_CONTENT } = constant

class TestSuiteContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPage: 1
    }
  }

  getRenderContent = (type) => {
    const {
      currentClassId,
      currentSuiteId,
      ...otherProps
    } = this.props
    let element
    switch (type) {
      case SUITE_CONTENT.SUITE_LIST:
        element = <TestSuiteTable
          currentPage={this.state.currentPage}
          currentClassId={currentClassId}
          onSelectChange={this.onSelectChange}
          setCurrentPage={(currentPage) => this.setState({ currentPage })}
          {...otherProps}
        />
        break
      case SUITE_CONTENT.ADD_SUITE:
      case SUITE_CONTENT.EDIT_SUITE:
        element = <TestSuiteForm
          currentSuiteId={currentSuiteId}
          currentClassId={currentClassId}
          {...otherProps}
        />
        break
      default:
        break
    }
    return element
  }

  getPageHeaderTitle = (type) => {
    let title = ''
    switch (type) {
      case SUITE_CONTENT.SUITE_LIST:
        title = '测试套件'
        break
      case SUITE_CONTENT.ADD_SUITE:
        title = '新增套件'
        break
      case SUITE_CONTENT.EDIT_SUITE:
        title = '编辑套件'
        break
      default:
        break
    }
    return title
  }

  handleShowBack = (classId) => {
    this.props.setCurrentNode({ type: SUITE_CONTENT.SUITE_LIST, classId })
  }

  render () {
    const {
      currentType,
      currentClassId
    } = this.props

    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <PageHeader
          title={this.getPageHeaderTitle(currentType)}
          showBackBtn={currentType !== SUITE_CONTENT.SUITE_LIST}
          onClick={() => this.handleShowBack(currentClassId)}
        />
        {
          this.getRenderContent(currentType)
        }
      </div>
    )
  }
}

export default TestSuiteContent
