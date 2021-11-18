import React, {useState, Fragment} from 'react'
import cx from 'classnames'
import { Tabs } from 'antd'
import RiskChart from "../../home/charts/RiskChart"
import RiskTrendChart from "../../home/charts/RiskTrendChart"
import hstyle from '../../home/style.scss'
import style from './style.scss'
import TableContent from "./TableContent";
const { TabPane } = Tabs;

export default function (props) {
    const [data, setData] = useState()

    return (
        <Fragment>
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
                    <TabPane tab="Tab 1" key="1">
                        <TableContent />
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">
                        <TableContent />
                    </TabPane>
                    <TabPane tab="Tab 3" key="3">
                        <TableContent />
                    </TabPane>
                </Tabs>
            </div>
        </Fragment>
    )
}