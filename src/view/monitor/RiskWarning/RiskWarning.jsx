import React, { useState, Fragment } from 'react'
import cx from 'classnames'
import { Tabs } from 'antd'
import RiskChart from '../../home/charts/RiskChart'
import RiskTrendChart from '../../home/charts/RiskTrendChart'
import TableContent from './TableContent'
import hstyle from '../../home/style.scss'
import style from './style.scss'
import {DICT_SET} from "../../../constant";

const { TabPane } = Tabs

export default function (props) {

  return (
    <div>
      <div className='flex-space-between'>
        <div className={hstyle.section}>
          <label className={hstyle.title}>数据风险分布</label>
          <RiskChart />
        </div>
        <div className={hstyle.section}>
          <label className={hstyle.title}>数据风险趋势</label>
          <RiskTrendChart />
        </div>
      </div>
      <div className={style.section}>
        <Tabs>
          {
            DICT_SET.LOG_TYPES.map(v => {
              return <TabPane tab={v.text} key={v.value}>
                <TableContent query={{tab: v.value}} />
              </TabPane>
            })
          }
        </Tabs>
      </div>
    </div>
  )
}
