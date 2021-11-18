import React, {useEffect, useState} from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'

export default function (props) {
    const [option, setOption] = useState()

    useEffect(() => {
        api.getRisk().then(res => {
            setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                xAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [120, 200, 150, 80, 70, 110, 130],
                        type: 'bar'
                    }
                ]
            })
        })
    }, [])

    return (
        <EchartsComp option={option} className={style.chart} />
    )
}