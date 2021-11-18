import React, { Fragment } from 'react'
import {Divider} from "antd";
import {ReactComponent as Icon0} from './asset/shujuzichan.svg'
import {ReactComponent as Icon1} from './asset/wenjianzichan.svg'
import {ReactComponent as Icon2} from './asset/yingyongzichan.svg'
import {ReactComponent as Icon3} from './asset/yingyongzhanghu.svg'
import {ReactComponent as Icon4} from './asset/shujufenlei.svg'
import style from './style.scss'
import RiskChart from "./charts/RiskChart";
import RiskTrendChart from "./charts/RiskTrendChart";
import ExceptionChart from "./charts/ExceptionChart";
import ExceptionTrendChart from "./charts/ExceptionTrendChart";
import AppBugChart from "./charts/AppBugChart";
import DatabaseBugChart from "./charts/DatabaseBugChart";

export default function (props) {
  return <Fragment>
    <div className='flex' style={{marginBottom: 16}}>
      <section className={style.item}>
        <div className={style.decorate} style={{background: '#3A88F4'}}>
          <Icon0 className={style.icon} />
        </div>
        <div className='flex1'>
          <label className={style.f1}>数据资产</label>
          <Divider className={style.divider} />
          <div className='flex-center-v'>
            <label className={style.f2}>贴   源</label>
            <span className={style.f3}>3,000</span>
          </div>
          <div className='flex-center-v'>
            <label className={style.f2}>非贴源</label>
            <span className={style.f3}>12</span>
          </div>
        </div>
      </section>

      <section className={style.item}>
        <div className={style.decorate} style={{background: '#F8A201'}}>
          <Icon1 className={style.icon} />
        </div>
        <div className='flex1'>
          <label className={style.f1}>文件资产</label>
          <Divider className={style.divider} />
          <div className='flex-center-v'>
            <label className={style.f2}>数据文件</label>
            <span className={style.f3}>3,000</span>
          </div>
          <div className='flex-center-v'>
            <label className={style.f2}>影像文件</label>
            <span className={style.f3}>12</span>
          </div>
        </div>
      </section>

      <section className={style.item}>
        <div className={style.decorate} style={{background: '#3A88F4'}}>
          <Icon2 className={style.icon} />
        </div>
        <div className='flex1'>
          <label className={style.f1}>应用资产</label>
          <Divider className={style.divider} />
          <div className='flex-center-v'>
            <label className={style.f2}>业务系统</label>
            <span className={style.f3}>3,000</span>
          </div>
        </div>
      </section>

      <section className={style.item}>
        <div className={style.decorate} style={{background: '#F4AB8E'}}>
          <Icon3 className={style.icon} />
        </div>
        <div className='flex1'>
          <label className={style.f1}>帐号资产</label>
          <Divider className={style.divider} />
          <div className='flex-center-v'>
            <label className={style.f2}>数据库帐号</label>
            <span className={style.f3}>3,000</span>
          </div>
          <div className='flex-center-v'>
            <label className={style.f2}>应用帐号</label>
            <span className={style.f3}>3,000</span>
          </div>
        </div>
      </section>

      <section className={style.item}>
        <div className={style.decorate} style={{background: '#9541FC'}}>
          <Icon4 className={style.icon} />
        </div>
        <div className='flex1'>
          <label className={style.f1}>分类分级</label>
          <Divider className={style.divider} />
          <div className='flex-center-v'>
            <label className={style.f2}>元数据分类</label>
            <span className={style.f3}>3,000</span>
          </div>
          <div className='flex-center-v'>
            <label className={style.f2}>元数据分级</label>
            <span className={style.f3}>3,000</span>
          </div>
        </div>
      </section>
    </div>

    <div className='flex-space-between'>
      <div className={style.section}>
        <label className={style.title}>数据风险分布</label>
        <RiskChart />
      </div>
      <div className={style.section}>
        <label className={style.title}>数据风险趋势</label>
        <RiskTrendChart />
      </div>
    </div>

    <div className='flex-space-between'>
      <div className={style.section}>
        <label className={style.title}>数据异常流动分布</label>
        <ExceptionChart />
      </div>
      <div className={style.section}>
        <label className={style.title}>数据异常流动趋势</label>
        <ExceptionTrendChart />
      </div>
    </div>

    <div className='flex-space-between'>
      <div className={style.section}>
        <label className={style.title}>应用漏洞风险</label>
        <AppBugChart />
      </div>
      <div className={style.section}>
        <label className={style.title}>数据库漏洞风险</label>
        <DatabaseBugChart />
      </div>
    </div>

  </Fragment>
}