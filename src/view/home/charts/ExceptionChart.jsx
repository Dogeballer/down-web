import React, { useEffect, useState } from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'
import cx from "classnames";
import {mergeEchartConfig} from "../util";

export default function (props) {
  const [option, setOption] = useState()

  useEffect(() => {
    api.getException().then(res => {
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: 0,
          itemWidth: 14,
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '62%'],
            avoidLabelOverlap: true,
            label: {
              formatter: '{b}：{d}%'
            },
            data: res.data.map(v => {
              return {
                name: v.datacorruptionflowname,
                value: v.datacorruptionflowcount
              }
            })
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
