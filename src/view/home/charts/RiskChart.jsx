import React, { useEffect, useState } from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'
import cx from 'classnames'

export default function (props) {
  const [option, setOption] = useState()

  useEffect(() => {
    api.getRisk().then(res => {
      setOption({
        grid: {
          ...props.grid,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          type: 'category',
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
