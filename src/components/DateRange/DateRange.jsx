import React, { PureComponent } from 'react'

import { DatePicker } from 'antd'

import { DATE_FORMAT } from '../../constant'
import style from './style.scss'

class DateRange extends PureComponent {
  state = {
    endOpen: false
  }

  disabledStartDate = startValue => {
    const { endValue } = this.props
    if (!startValue || !endValue) return false
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = endValue => {
    const { startValue } = this.props
    if (!endValue || !startValue) return false
    return endValue.valueOf() <= startValue.valueOf()
  }

  handleStartOpenChange = open => {
    if (!open) this.setState({ endOpen: true })
  }

  handleEndOpenChange = open => {
    this.setState({ endOpen: open })
  }

  render () {
    const { endOpen } = this.state
    const {
      startValue,
      endValue,
      onStartChange,
      onEndChange,
      ...otherProps
    } = this.props
    return (
      <div className={style['date-range-wrapper']} {...otherProps}>
        <DatePicker
          placeholder='开始时间'
          value={startValue}
          showTime={{ format: 'HH:mm' }}
          format={DATE_FORMAT.YYYYMMDDHHMM}
          defaultPickerValue={startValue}
          onChange={(value) => onStartChange(value)}
          disabledDate={this.disabledStartDate}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          placeholder='截止时间'
          open={endOpen}
          value={endValue}
          showTime={{ format: 'HH:mm' }}
          format={DATE_FORMAT.YYYYMMDDHHMM}
          onChange={(value) => onEndChange(value)}
          style={{marginLeft: 8}}
          defaultPickerValue={endValue}
          disabledDate={this.disabledEndDate}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    )
  }
}

export default DateRange
