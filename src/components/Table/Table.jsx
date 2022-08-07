import React, { memo, useMemo } from 'react'
import AntTable from 'antd4/es/table'
import cs from 'classnames'

import 'antd4/lib/table/style/index.css'
import './style.g.scss'

import { TableCell, VList } from './components/Vlist'
import { Empty } from 'antd'

const Table = memo((props = {
    bordered: true,
    showHeaderBorder: false,
    striped: true,
    scroll: { y: 400 }
  }
) => {
  // const height = useState(this.props?.scroll?.y)

  // const { height } = this.state
  const { className, showHeaderBorder, striped, bordered, virtual = true, ...thisProps } = props
  const classNames = cs('bui-table', className, {
    striped, 'header-no-border': !showHeaderBorder && bordered
  })

  const components = useMemo(() => {
    const height = props?.scroll?.y
    if (height) {
      if (virtual) {
        return VList({
          height: props?.scroll?.y ?? 0
        })
      } else {
        return {
          body: {
            cell: TableCell
          }
        }
      }
    } else {
      return {
        body: {
          cell: TableCell
        }
      }
    }

  }, [props?.scroll?.y, virtual])

  return (
    <AntTable
      className={classNames}
      bordered={bordered}
      components={components}
      locale={{ emptyText: <Empty style={{ padding: '16px 0'}} /> }}
      // scroll={{ x: scroll?.x, y: height }}
      {...thisProps}
    />
  )
})

export default Table
