import React, {Component} from 'react'

import {Tabs} from 'antd'
import ProjectsManage from './components/ProjectsManage'
import ModulesManage from './components/ModulesManage'
import EnvironmentManage from './components/EnvironmentManage'
import AuthEnvironmentManage from './components/AuthEnvironmentManage'
import InterfaceClassManage from "./components/InterfaceClassManage/InterfaceClassManage";

const {TabPane} = Tabs
const tabs = [
  {
    key: 1,
    title: '项目管理',
    component: ProjectsManage
  },
  {
    key: 2,
    title: '模块管理',
    component: ModulesManage
  },
  {
    key: 3,
    title: '环境管理',
    component: EnvironmentManage
  },
  {
    key: 4,
    title: ' 鉴权环境管理',
    component: AuthEnvironmentManage
  }
]

class ProjectModule extends Component {
  constructor(props) {
    super(props)
    this.projectRef = null
    this.moduleRef = null
    this.environmentRef = null
    this.interfaceClassRef = null
  }

  handleChange = (activeKey) => {
    if (Number(activeKey) === 3) return
    const currentRef = Number(activeKey) === 1
      ? this.projectRef : this.moduleRef
    currentRef && currentRef.fetch()
  }
  setRef = (key, ref) => {
    switch (Number(key)) {
      case 1:
        this.projectRef = ref
        break
      case 2:
        this.moduleRef = ref
        break
      case 3:
        this.environmentRef = ref
        break
      case 4:
        this.interfaceClassRef = ref
        break
      default:
        break
    }
  }

  render() {
    return (
      <Tabs
        size={'large'}
        animated={false}
        className={'bui-tabs'}
        onChange={this.handleChange}
        style={{background: 'white'}}
      >
        {
          tabs.map(item => (
            <TabPane tab={item.title} key={item.key}>
              <item.component ref={ref => this.setRef(item.key, ref)}/>
            </TabPane>
          ))
        }
      </Tabs>
    )
  }
}

export default ProjectModule
