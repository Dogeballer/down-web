import React, { useEffect, useState } from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'
import cx from "classnames";

export default function (props) {
  const [option, setOption] = useState()

  useEffect(() => {
    api.getException().then(res => {
      setOption({
        grid: props.grid,
        tooltip: {
          trigger: 'item'
        },
        legend: {
          y: 'bottom',
          itemWidth: 14,
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
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
      })
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
