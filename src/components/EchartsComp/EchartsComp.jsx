import React from 'react'
import debounce from '@fishballer/bui/dist/lib/debounce'
import * as echarts from 'echarts'
import './theme/shine'

export default class EchartsComp extends React.Component {
  static defaultProps = {
    onRenderChart: f => f // 当图表渲染完成后，回调
  }

  constructor (props) {
    super(props)
    this.ref = null
    this.myChart = null
  }

  resize = () => {
    if (this.ref && this.props.option && this.myChart) {
      this.myChart.resize()
    }
  }

  componentDidMount = () => {
    this.renderEcharts(this.props)
    this.observer = new window.ResizeObserver(debounce(entries => {
      entries.forEach(() => {
        this.resize()
      })
    }))
    this.observer.observe(this.ref)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.option && prevProps.option !== this.props.option) {
      this.renderEcharts(this.props)
    }
  }

  renderEcharts = props => {
    if (!props.option) return

    // 绘制图表
    if (!this.myChart) {
      this.myChart = echarts.init(this.ref, props.theme)
    }
    this.myChart.setOption(props.option)

    props.onRenderChart(this.myChart, props.option)
  }

  componentWillUnmount () {
    this.observer.disconnect()
    this.observer = null
    if (this.myChart && !this.myChart.isDisposed()) {
      this.myChart.dispose()
      this.myChart = null
    }
  }

  render () {
    const props = this.props
    return (
      <div className={props.className} style={props.style} ref={r => this.ref = r} />
    )
  }
}
