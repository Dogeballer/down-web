import React, {useEffect, useState} from 'react'
import EchartsComp from '../../../components/EchartsComp'
import * as api from '../../../api/screen'
import style from './style.scss'

export default function (props) {
    const [option, setOption] = useState()

    useEffect(() => {
        api.getDatabaseBug().then(res => {
            setOption({
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
        <EchartsComp option={option} className={style.chart} />
    )
}