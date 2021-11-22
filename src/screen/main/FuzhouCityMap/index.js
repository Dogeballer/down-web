import React from 'react'
import ThreeJsMap from './ThreeJsMap'
import cx from 'classnames'
import './index.g.scss'

export const defaultProps = {
  activeColor: '#69C0FF',
  cityData: [
    {
      name: '长乐区',
      '发热人次': 238,
    },
    {
      name: '鼓楼区',
      '发热人次': 478,
    },
    {
      name: '仓山区',
      '发热人次': 257,
    },
    {
      name: '晋安区',
      '发热人次': 126,
    },
    {
      name: '台江区',
      '发热人次': 245,
    },
    {
      name: '马尾区',
      '发热人次': 89
    },
    {
      name: '闽侯县',
      '发热人次': 245
    }
  ],
  interval: 4000,
  optionMap: {
    color: '#004892',
    borderColor: '#5ca4de',
    borderWidth: 1.4
  }
}

export default class ChinaMap extends React.Component {
  static defaultProps = defaultProps

  onChangeActiveData = (pos, activeData) => {
    this.setState({
      pos, activeData
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      activeData: null,
      pos: {}
    }

    this.ref = React.createRef()
  }

  componentDidMount () {
    const props = this.props
    let root = this.ref.current
    this.three = new ThreeJsMap(root, root.offsetWidth, root.offsetHeight, {...props, onChangeActiveData: this.onChangeActiveData})
  }

  componentWillUnmount () {
    if (this.three) {
      this.three.dispose()
      this.three = null
    }
  }

  renderActiveData = actveData => {
    let {name, ...rest} = actveData
    return Object.keys(rest).map(key => {
      let value = rest[key]
      if (value === null || value === undefined) return null
      return <React.Fragment key={key}>
        <div className='dui-fuzhou-map-tip-name'>{name}</div>
        {
          Object.keys(rest).map(key => {
            let value = rest[key]
            if (value === null || value === undefined) return null
            return <div className='dui-fuzhou-map-tip-content' key={key}>{`${key}：${value}`}</div>
          })
        }
      </React.Fragment>
    })
  }

  render () {
    const {props, state} = this
    return (
      <div ref={this.ref} style={props.style} className={cx('dui-fuzhou-map', props.className)} >
        {
          state.activeData && <div className={cx('dui-fuzhou-map-tip', props.tipClassName)} style={{...props.tipStyle, left: state.pos.x, top: state.pos.y}} >
            {
              this.renderActiveData(state.activeData)
            }
          </div>
        }
      </div>
    )
  }
}
