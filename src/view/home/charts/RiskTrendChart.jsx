import React, {useEffect, useState} from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'

export default function (props) {
    const [option, setOption] = useState()

    useEffect(() => {
        api.getRiskTrend().then(res => {
            setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    y: 'bottom'
                },
                yAxis: {
                    type: 'value'
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        stack: 'total',
                        data: [320, 302, 301, 334, 390, 330, 320]
                    },
                    {
                        name: 'Mail Ad',
                        type: 'bar',
                        stack: 'total',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: 'Affiliate Ad',
                        type: 'bar',
                        stack: 'total',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: 'Video Ad',
                        type: 'bar',
                        stack: 'total',
                        data: [150, 212, 201, 154, 190, 330, 410]
                    },
                    {
                        name: 'Search Engine',
                        type: 'bar',
                        stack: 'total',
                        data: [820, 832, 901, 934, 1290, 1330, 1320]
                    }
                ]
            })
        })
    }, [])

    return (
        <EchartsComp option={option} className={style.chart} />
    )
}