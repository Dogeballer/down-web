import React, { useEffect, useState } from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'
import cx from 'classnames'
import moment from "moment"
import {DICT_SET} from "../../../constant";
import {mergeEchartConfig} from "../util";

export default function (props) {
  const [option, setOption] = useState()

  useEffect(() => {
    api.getRiskTrend().then(res => {

      let seriesNames = []
      if(res.data.length) {
        seriesNames = Object.keys(res.data[0]).filter(v => v !== 'statdate')
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          bottom: 0,
          itemWidth: 14,
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: res.data.map(v => {
            return moment(v.statdate).format('MM-DD')
          })
        },
        series: seriesNames.map(name => {
          return {
            name: DICT_SET.RISK_TYPES.find(v => v.value == name)?.text || name,
            type: 'bar',
            stack: 'total',
            data: res.data.map(v => v[name])
          }
        })
      }

      setOption(mergeEchartConfig(option, props.option))
    })
  }, [])

  return (
    <EchartsComp
      {...props}
      option={option}
      className={cx(style.chart, props.className)}
    />
  )
}
