import React, { useEffect, useState } from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'
import cx from "classnames";

export default function (props) {
  const [option, setOption] = useState()

  useEffect(() => {
    api.getAppBug().then(res => {
      setOption({
        grid: props.grid,
        tooltip: {
          trigger: 'item'
        },
        legend: {
          y: 'bottom'
        },
        series: [
          {
            type: 'pie',
            avoidLabelOverlap: true,
            label: {
              formatter: '{b}：{d}%'
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
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
