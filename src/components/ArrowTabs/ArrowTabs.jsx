import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import style from './style.scss'

const ArrowTabs = (props = {}) => {
  const {
    children,
    className,
    onTabClick,
    defaultActiveKey,
    ...restProps
  } = props
  const [activeKey, setActiveKey] = useState(void 0)

  useEffect(() => {
    setActiveKey(defaultActiveKey)
  }, [defaultActiveKey])

  const getTabPaneClass = (key) => {
    return activeKey === key
      ? classnames(style['arrow-tabs-nav'], style['nav-active'])
      : style['arrow-tabs-nav']
  }

  const getTabContentClass = (key) => {
    return activeKey === key
      ? classnames(style['arrow-tabs-tabpane'], style['tabpane-active'])
      : style['arrow-tabs-tabpane']
  }

  const handleTabClick = (key) => {
    setActiveKey(key)
    typeof onTabClick === 'function' && onTabClick()
  }
  return (
    <div
      className={classnames(style['arrow-tabs'], className)}
      {...restProps}
    >
      {/* tab的title */}
      <ul className={style['arrow-tabs-bar']}>
        {
          React.Children.map(children, (e) => {
            const { tab, className, ...restProps } = e.props
            return (
              <li
                className={classnames(getTabPaneClass(e.key), className)}
                onClick={() => handleTabClick(e.key)}
                {...restProps}
              >
                {tab}
              </li>
            )
          })
        }
      </ul>
      {/* tab的内容 */}
      <div className={style['arrow-tabs-content']}>
        {
          React.Children.map(children, (e) => {
            return (
              <div className={getTabContentClass(e.key)}>
                {e.props.children}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default ArrowTabs
