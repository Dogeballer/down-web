import React, { Component } from 'react'

import { Tabs } from 'antd'
import { LOG_TAB_TYPE } from '../../constant'
import utilities from '../../style/utilities.scss'
import LogContent from './components/LogContent/LogContent'

const TabPane = Tabs.TabPane

class TaskLog extends Component {
  render () {
    return (
      <Tabs
        animated={false}
        size={'large'}
        className={utilities['page-tab']}
        // defaultActiveKey={LOG_TAB_TYPE.EXEC_TYPE}
      >
        <TabPane
          key={1}
          tab='已执行'
        >
          <LogContent
            // status={LOG_TAB_TYPE.EXEC_TYPE}
          />
        </TabPane>
        {/*<TabPane*/}
        {/*  key={LOG_TAB_TYPE.NOT_EXEC_TYPE}*/}
        {/*  tab='待执行'*/}
        {/*>*/}
        {/*  <LogContent status={LOG_TAB_TYPE.NOT_EXEC_TYPE} />*/}
        {/*</TabPane>*/}
      </Tabs>
    )
  }
}

export default TaskLog
