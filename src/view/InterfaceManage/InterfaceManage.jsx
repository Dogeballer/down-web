import React, { Component } from 'react'

import Resizer from '../../components/resizer'
import style from './style.scss'
import InterfaceTree from './components/InterfaceTree'
import InterfaceList from './components/InterfaceList'
import InterfaceContent from './components/InterfaceContent'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchValue: {},
      activeKey: 'info',
      type: ''
    }
  }

  setActiveKey = (activeKey) => this.setState({ activeKey })

  componentDidMount () {}

  componentWillUnmount = () => {}

  onTreeSelect = selectedKeys => {
    if (selectedKeys.length) {
      const type = selectedKeys[0].split('-')[1]
      const id = selectedKeys[0].split('-')[0]
      this.setState({
        searchValue: { [type]: id },
        type: type
      })
    } else {
      this.setState({
        type: 'list'
      })
    }
  }

  interfaceDetail = id => {
    this.setState({
      searchValue: { 'interface': id },
      type: 'interface'
    })
  }

  onBackClick = () => {
    this.setState({
      type: 'list'
    })
  }
  addInterface = () => {
    this.setState({
      searchValue: { 'interface': undefined },
      type: 'interface'
    })
  }

  render () {
    const { type, searchValue, activeKey } = this.state
    return (
      <Resizer
        left={<InterfaceTree onPropsSelect={this.onTreeSelect}/>}
        right={
          type !== 'interface' ?
            <InterfaceList
              searchValue={searchValue}
              interfaceDetailInter={this.interfaceDetail}
              addInterface={this.addInterface}
            /> :
            <InterfaceContent
              activeKey={activeKey}
              currentNode={searchValue[type]}
              setActiveKey={this.setActiveKey}
              onBackClick={this.onBackClick}
            />
        }
      />
    )
  }
}

export default Home
