import React, { useEffect, useState } from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'
import cx from 'classnames'
import {mergeEchartConfig} from "../util";

export default function (props) {
  const [option, setOption] = useState()

  useEffect(() => {
    api.getRisk().then(res => {
      const option = {
        grid: {
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          bottom: 0,
          data: res.data.map(v => v.riskname)
        },
        xAxis: {
          type: 'value'
        },
        series: [
          {
            data: res.data.map(v => v.riskcount),
            type: 'bar'
          }
        ]
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
