import React, { Component } from 'react'
import { Tabs, Button } from 'antd'
import utilities from '../../../../style/utilities.scss'
import { Icon as IconFont } from '@fishballer/bui'
import { SERVICE_CONTENT } from '../../../../constant'
import InterfaceInfoConfig from './components/InterfaceInfoConfig/InterfaceInfoConfig'
import InterfaceBody from './components/InterfaceInfoConfig/InterfaceBody'
import InterfaceTest from './components/InterfaceInfoConfig/InterfaceTest'

const TabPane = Tabs.TabPane

export default class InterfaceContent extends Component {
  state = {
    interfaceId: this.props.currentNode
  }

  componentDidUpdate = prevProps => {
    if (prevProps.currentNode === this.props.currentNode) return
    this.setState({ interfaceId: this.props.currentNode })
  }

  handleTabsChange = (key) => {
    this.props.setActiveKey(key)
  }

  addedId = (id) => {
    this.setState({
        interfaceId: id
      }
    )
  }

  render () {
    const {
      activeKey,
      classNode,
      currentNode,
      serviceLogId,
      setCurrentPage
    } = this.props
    return (
      <Tabs
        animated={true}
        size={'large'}
        className={utilities['page-tab']}
        activeKey={activeKey}
        onTabClick={this.handleTabsChange}
        tabBarExtraContent={<Button
          type='primary'
          onClick={this.props.onBackClick}
        >
          <IconFont type={'icon-Return'}/> 返回列表
        </Button>}
      >
        <TabPane
          key={'info'}
          tab='接口信息配置'
        >
          <div>
            <InterfaceInfoConfig
              currentNode={this.state.interfaceId}
              addedId={this.addedId}
            />
          </div>
        </TabPane>
        <TabPane
          key={'body'}
          tab='接口参数体'
          disabled={!this.state.interfaceId}
        >
          <InterfaceBody
            currentNode={this.state.interfaceId}
          />
        </TabPane>
        <TabPane
          key={'test'}
          tab='接口测试'
          disabled={!this.state.interfaceId}
        >
          <InterfaceTest
            currentNode={this.state.interfaceId}
            // pageType={CONTENT_TYPE.SERVICE_CONTENT}
          />
        </TabPane>
      </Tabs>
    )
  }
}
