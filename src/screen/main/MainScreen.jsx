import React, {useEffect, useRef, useState} from 'react'
import debounce from "@cecdataFE/bui/dist/lib/debounce";
import cx from 'classnames'
import FuzhouCityMap from './FuzhouCityMap'
import style from './style.scss'
import RiskChart from "../../view/home/charts/RiskChart";
import RiskTrendChart from "../../view/home/charts/RiskTrendChart";
import ExceptionChart from "../../view/home/charts/ExceptionChart";
import AppBugChart from "../../view/home/charts/AppBugChart";
import DatabaseBugChart from "../../view/home/charts/DatabaseBugChart";
import ExceptionTrendChart from "../../view/home/charts/ExceptionTrendChart";

const width = 1920
const height = 1080

export default function (props) {
  const [data, setData] = useState()
  const root = useRef()
  const placeholder = useRef()

  useEffect(() => {

  }, [])

  useEffect(() => {
    const resize = () => {
      let ratioX = window.innerWidth / width
      let ratioY = window.innerHeight / height

      ratioX = ratioY = Math.min(ratioX, ratioY)

      root.current.style.transform = `scale(${ratioX}, ${ratioY})`

      placeholder.current.style.width = `${width * ratioX}px`
      placeholder.current.style.height = `${height * ratioY}px`
    }
    const onWinResizeLazy = debounce(resize, 250)
    window.addEventListener('resize', onWinResizeLazy)
    resize()
    return () => window.removeEventListener('resize', onWinResizeLazy)
  }, [])

  return (
    <div className={style.root}>
      <div className={style.placeHolder} ref={placeholder}>
      <div className={style.content} style={{width, height}} ref={root}>
        <div className='flex-space-between'>
          <div className='flex-direction-column'>
            <section className={style.section} style={{width: 500, height: 280}}>
              <div className={style.title}>资产概况</div>

              <div className='flex-center-vh' style={{flexWrap: 'wrap', paddingLeft: 30, paddingTop: 12}}>
                <div className='flex-center-v' style={{width: '50%', marginBottom: 32}}>
                  <img className={style.img} src={require('../asset/数据资产.png')}/>
                  <div className='flex-direction-column'>
                    <span className={style.f1}>数据资产</span>
                    <span className={style.f2}>29</span>
                  </div>
                </div>
                <div className='flex-center-v' style={{width: '50%', marginBottom: 32}}>
                  <img className={style.img} src={require('../asset/文件资产.png')}/>
                  <div className='flex-direction-column'>
                    <span className={style.f1}>文件资产</span>
                    <span className={style.f2}>29</span>
                  </div>
                </div>
                <div className='flex-center-v' style={{width: '50%'}}>
                  <img className={style.img} src={require('../asset/应用资产.png')}/>
                  <div className='flex-direction-column'>
                    <span className={style.f1}>应用资产</span>
                    <span className={style.f2}>29</span>
                  </div>
                </div>
                <div className='flex-center-v' style={{width: '50%'}}>
                  <img className={style.img} src={require('../asset/账号资产.png')}/>
                  <div className='flex-direction-column'>
                    <span className={style.f1}>账号资产</span>
                    <span className={style.f2}>29</span>
                  </div>
                </div>
              </div>
            </section>

            <section className={style.section} style={{width: 500, height: 300}}>
              <div className={style.title}>数据风险分布</div>
              <RiskChart theme='shine' grid={{top: '10%', bottom: '10%'}} style={{height: 240}} />
            </section>
          </div>

          <FuzhouCityMap className={style.map} style={{width: 900, height: 900}} />

          <div className='flex-direction-column'>
            <section className={style.section} style={{width: 500, height: 280}}>
              <div className={style.title}>分类分级</div>

              <div className='flex-center-vh' style={{flexWrap: 'wrap', paddingLeft: 30, paddingTop: 12}}>
                <div className='flex-center-v' style={{width: '50%', marginBottom: 32}}>
                  <img className={style.img} src={require('../asset/分类数.png')}/>
                  <div className='flex-direction-column'>
                    <span className={style.f1}>分类数</span>
                    <span className={style.f2}>29</span>
                  </div>
                </div>
                <div className='flex-center-v' style={{width: '50%', marginBottom: 32}}>
                  <img className={style.img} src={require('../asset/分级数据.png')}/>
                  <div className='flex-direction-column'>
                    <span className={style.f1}>分级数</span>
                    <span className={style.f2}>29</span>
                  </div>
                </div>
                <div className='flex-center-v' style={{width: '50%'}}>
                  <img className={style.img} src={require('../asset/分类标识量.png')}/>
                  <div className='flex-direction-column'>
                    <span className={style.f1}>分类标识量</span>
                    <span className={style.f2}>29</span>
                  </div>
                </div>
                <div className='flex-center-v' style={{width: '50%'}}>
                  <img className={style.img} src={require('../asset/分级标识量.png')}/>
                  <div className='flex-direction-column'>
                    <span className={style.f1}>分级标识量</span>
                    <span className={style.f2}>29</span>
                  </div>
                </div>
              </div>
            </section>

            <section className={style.section} style={{width: 500, height: 300}}>
              <div className={style.title}>数据异常流动分布</div>
              <ExceptionChart theme='shine' grid={{top: '10%', bottom: '18%'}} style={{height: 240}} />
            </section>
          </div>


        </div>


        <div className='flex-space-between'>
          <section className={style.section} style={{width: 500, height: 360}}>
            <div className={style.title}>数据风险趋势</div>
            <RiskTrendChart theme='shine' grid={{top: '10%', bottom: '18%', right: '2%'}} style={{height: 290}} />
          </section>

          <section className={style.section} style={{width: 400, height: 360}}>
            <div className={style.title}>应用漏洞风险</div>
            <AppBugChart theme='shine' grid={{top: '10%', bottom: '18%'}} style={{height: 290}} />
          </section>

          <section className={style.section} style={{width: 400, height: 360}}>
            <div className={style.title}>数据库漏洞风险</div>
            <DatabaseBugChart theme='shine' grid={{top: '10%', bottom: '18%'}} style={{height: 290}} />
          </section>

          <section className={style.section} style={{width: 500, height: 360}}>
            <div className={style.title}>数据异常流动趋势</div>
            <ExceptionTrendChart theme='shine' grid={{top: '10%', bottom: '18%'}} style={{height: 290}} />
          </section>
        </div>
      </div>
      </div>
    </div>
  )
}