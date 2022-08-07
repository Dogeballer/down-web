import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { throttle } from '../../lib/throttle'

class FixHeaderWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollY: 300
    }
    this.ref = null
  }
  static propTypes = {
    minusHeight: PropTypes.number.isRequired
  }

  static defaultProps = {
    minusHeight: 0
  }

  componentDidMount = () => {
    this.resizeScrollYHeight()
    window.addEventListener('resize', this.resizeScrollYHeight)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resizeScrollYHeight)
  }

  resizeScrollYHeight = throttle(() => {
    const { tableFooterHeight } = this.props
    setTimeout(() => {
      const minusHeight = (!!tableFooterHeight && tableFooterHeight > 0)
        ? this.headHeight + tableFooterHeight : this.headHeight
      if (this.ref && this.ref.clientHeight > minusHeight) {
        this.setState({ scrollY: this.ref.clientHeight - minusHeight })
      }
    }, 0)
  })

  _headHeight = 0
  get headHeight () {
    if (this._headHeight) {
      return this._headHeight
    }
    if (this.ref) {
      const thead = this.ref.querySelector('table > thead')
      if (thead) this._headHeight = thead.clientHeight
    }
    return this._headHeight
  }

  render () {
    const height = `calc(100% - ${this.props.minusHeight || 0}px)`
    return (
      <div
        style={{height}}
        ref={ref => { this.ref = ref }}
      >
        {this.props.children(this.state.scrollY)}
      </div>
    )
  }
}
export default FixHeaderWrapper
