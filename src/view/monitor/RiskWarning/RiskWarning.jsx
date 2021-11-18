import React, {useState} from 'react'
import cx from 'classnames'
import style from './style.scss'

export default function (props) {
    const [data, setData] = useState()

    return (
        <div className={cx('', props.className)} style={props.style}>
            hello
        </div>
    )
}