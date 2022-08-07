import { Button, Tabs } from 'antd'
import utilities from '../../../../style/utilities.scss'
import { Icon as IconFont } from '@fishballer/bui'
import InterfaceTest
  from '../../../InterfaceManage/components/InterfaceContent/components/InterfaceInfoConfig/InterfaceTest'
import React, { useEffect, useState } from 'react'
import UseCaseInfo from './components/UseCaseInfo/UseCaseInfo'
import UseCaseStep from './components/UseCaseStep'
import UseCaseLog from '../UseCaseLog/UseCaseLog'

const TabPane = Tabs.TabPane

const UseCaseContent = (props) => {
  const { currentNode } = props
  const [id, setId] = useState(currentNode)
  const saveId = (id) => {
    setId(id)
  }
  useEffect(() => {
    setId(currentNode)
  }, [currentNode])
  return (
    <Tabs
      animated={true}
      size={'large'}
      className={utilities['page-tab']}
      tabBarExtraContent={<Button
        type='primary'
        onClick={props.onBackClick}
      >
        <IconFont type={'icon-Return'}/> 返回列表
      </Button>}
    >
      <TabPane
        key={'info'}
        tab='用例信息配置'
      >
        <UseCaseInfo
          currentNode={id}
          saveId={saveId}
        />
      </TabPane>
      <TabPane
        key={'step'}
        tab='用例步骤'
      >
        <UseCaseStep
          currentNode={id}
        />
      </TabPane>
      <TabPane
        key={'logs'}
        tab='用例日志'
      >
        <UseCaseLog
          use_case={id}
        />
      </TabPane>
    </Tabs>
  )
}

export default UseCaseContent