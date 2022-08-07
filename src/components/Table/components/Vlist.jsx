import React, {
  useRef,
  useEffect,
  useContext,
  createContext,
  useReducer,
  useState,
  useMemo
} from 'react'
import { throttle } from '@fishballer/bui'
import './style.g.scss'
// import {Tooltip} from '@fishballer/bui'
import cs from 'classnames'

// ===============reducer ============== //
const initialState = {
  // 行高度
  rowHeight: 0,
  // 当前的scrollTop
  curScrollTop: 0,
  // 可滚动区域的高度
  scrollHeight: 0,
  // scrollY值
  tableScrollY: 0
}

function isNumber (val) {
  return typeof val === 'number'
}

function reducer(state, action) {
  switch (action.type) {
    // 改变trs 即 改变渲染的列表trs
    case 'changeTrs':
      // 获取值
      let curScrollTop = action.curScrollTop
      let scrollHeight = action.scrollHeight
      let tableScrollY = action.tableScrollY

      if (scrollHeight <= 0) {
        scrollHeight = 0
      }

      if (state.scrollHeight !== 0) {
        if (tableScrollY === state.tableScrollY) {
          scrollHeight = state.scrollHeight
        }
      }

      if (state.scrollHeight && curScrollTop > state.scrollHeight) {
        curScrollTop = state.scrollHeight
      }

      return {
        ...state,
        curScrollTop,
        scrollHeight,
        tableScrollY
      }
    // 初始化每行的高度, 表格总高度, 渲染的条数
    case 'initHeight':
      // 获取值
      let rowHeight = action.rowHeight
      return {
        ...state,
        rowHeight
      }

    case 'reset':
      return {
        ...state,
        curScrollTop: 0,
        scrollHeight: 0
      }
    default:
      throw new Error()
  }
}

// ===============context ============== //
const ScrollContext = createContext({
  dispatch: () => {},
  renderLen: 1,
  start: 0,
  offsetStart: 0,
  // =============
  rowHeight: initialState.rowHeight,
  totalLen: 0
})

// ============== 参数 ================== //
// let scrollY = 0
let reachEnd = null


// ==============组件 =================== //
// const useTooltip = Tooltip.useTooltip

export function TableCell (props) {
  const tdRef = useRef()
  let { tooltip, className, ...restProps } = props

  const tooltipContent = typeof tooltip === 'function' ? tooltip() : tooltip
  // useTooltip(tdRef, tooltipContent)

  if (tooltip) {
    className = cs(className, 'ant-table-cell-ellipsis')
  }

  return <td ref={tdRef} className={className} {...restProps} />
}

function VRow(props) {
  const { dispatch, rowHeight, totalLen } = useContext(ScrollContext)

  const { children, rowHeight: propRowHeight, ...restProps } = props

  const trRef = useRef(null)

  useEffect(() => {
    const initHeight = trRef => {
      if (propRowHeight) {
        dispatch({
          type: 'initHeight',
          rowHeight: propRowHeight
        })
      } else if (trRef?.current?.offsetHeight && !rowHeight && totalLen) {
        let tempRowHeight = trRef?.current?.offsetHeight ?? 0
        dispatch({
          type: 'initHeight',
          rowHeight: tempRowHeight
        })
      }
    }

    initHeight(trRef)
  }, [trRef, dispatch, propRowHeight, rowHeight, totalLen])

  return (
    <tr
      {...restProps}
      ref={trRef}
      style={{
        height: rowHeight ? rowHeight : 'auto',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </tr>
  )
}

function VWrapper(props) {
  const { children, ...restProps } = props

  const { renderLen, start, offsetStart } = useContext(ScrollContext)

  let contents = children[1]

  let tempNode = null
  if (Array.isArray(contents) && contents.length) {
    tempNode = [
      children[0],
      contents.slice(start, start + renderLen).map((item) => {
        if (Array.isArray(item)) {
          // 兼容antd v4.3.5 --- rc-table 7.8.1及以下
          return item[0]
        } else {
          // 处理antd ^v4.4.0  --- rc-table ^7.8.2
          return item
        }
      })
    ]
  } else {
    tempNode = children
  }

  return (
    <tbody
      {...restProps}
      style={{ transform: `translateY(-${offsetStart}px)` }}
    >
    {tempNode}
    </tbody>
  )
}

const VTable = (initProps) => {
  let scrollY = initProps.height

  function VTableComponent (props) {
    const { style, children, ...rest } = props
    const { width, ...rest_style } = style

    // const [curScrollTop, setCurScrollTop] = useState(0)

    const [state, dispatch] = useReducer(reducer, initialState)

    const wrap_tableRef = useRef(null)
    const tableRef = useRef(null)

    // 数据的总条数
    const [totalLen, setTotalLen] = useState(
      children[1]?.props?.data?.length ?? 0
    )

    useEffect(() => {
      if (isNumber(children[1]?.props?.data?.length)) {
        setTotalLen(children[1]?.props?.data?.length)
      }
    }, [children])

    // table总高度
    const tableHeight = useMemo(() => {
      let temp = 'auto'
      if (state.rowHeight && totalLen) {
        temp = state.rowHeight * totalLen + 10
      }
      return temp
    }, [state.rowHeight, totalLen])

    // table的scrollY值
    let tableScrollY = 0
    if (typeof scrollY === 'string') {
      tableScrollY = (wrap_tableRef.current?.parentNode)?.offsetHeight
    } else {
      tableScrollY = scrollY
    }

    if (isNumber(tableHeight) && tableHeight < tableScrollY) {
      tableScrollY = tableHeight
    }

    // 处理tableScrollY <= 0的情况
    if (tableScrollY <= 0) {
      tableScrollY = 0
    }

    // 渲染的条数
    const renderLen = useMemo(() => {
      let temp = 1
      if (state.rowHeight && totalLen && tableScrollY) {
        if (tableScrollY <= 0) {
          temp = 0
        } else {
          let tempRenderLen =
            ((tableScrollY / state.rowHeight) | 0) + 1 + 2
          // console.log('tempRenderLen', tempRenderLen)
          temp = tempRenderLen > totalLen ? totalLen : tempRenderLen
        }
      }
      return temp
    }, [state.rowHeight, totalLen, tableScrollY])

    // 渲染中的第一条
    let start = state.rowHeight ? (state.curScrollTop / state.rowHeight) | 0 : 0
    // 偏移量
    let offsetStart = state.rowHeight ? state.curScrollTop % state.rowHeight : 0

    // 用来优化向上滚动出现的空白
    if (
      state.curScrollTop &&
      state.rowHeight &&
      state.curScrollTop > state.rowHeight
    ) {
      if (start > totalLen - renderLen) {
        // 可能以后会做点操作
        offsetStart = 0
      } else if (start > 1) {
        start = start - 1
        offsetStart += state.rowHeight
      }
    } else {
      start = 0
    }

    // useEffect(() => {
      // // totalLen变化, 那么搜索条件一定变化, 数据也一定变化.
      // let parentNode = wrap_tableRef.current?.parentNode
      // if (parentNode) {
      //   parentNode.scrollTop = 0
      // }
      // dispatch({ type: 'reset' })
    // }, [totalLen])

    useEffect(() => {
      let lastScrollTime = Date.now()
      const throttleScroll = throttle(e => {
        let scrollTop = e?.target?.scrollTop ?? 0
        let scrollHeight = e?.target?.scrollHeight ?? 0
        let clientHeight = e?.target?.clientHeight ?? 0

        const currentScrollTime = Date.now()
        // 到底了
        if (scrollTop === scrollHeight) {
          // 没有滚动条的情况
          reachEnd && reachEnd()
        } else if (scrollTop + clientHeight === scrollHeight) {
          // 有滚动条的情况
          reachEnd && reachEnd()
        }

        if (scrollTop !== state.curScrollTop) {
          // 虚拟滚动时，滚动时自动失焦焦距元素
          if (currentScrollTime - lastScrollTime > 500) {
            const focus = e.target.querySelector(':focus')
            focus && focus.blur();
          }

          let scrollHeight = e.target.scrollHeight - tableScrollY

          dispatch({
            type: 'changeTrs',
            curScrollTop: scrollTop,
            scrollHeight,
            tableScrollY
          })
        }
        lastScrollTime = currentScrollTime
      }, 10)

      let ref = wrap_tableRef?.current?.parentNode

      if (ref) {
        ref.addEventListener('scroll', throttleScroll)
      }

      return () => {
        ref.removeEventListener('scroll', throttleScroll)
      }
    }, [wrap_tableRef, state.curScrollTop, tableScrollY, state.scrollHeight])

    return (
      <div
        className="virtuallist"
        ref={wrap_tableRef}
        style={{
          width: '100%',
          position: 'relative',
          height: tableHeight,
          boxSizing: 'border-box',
          paddingTop: state.curScrollTop
        }}
      >
        <ScrollContext.Provider
          value={{
            dispatch,
            rowHeight: state.rowHeight,
            start,
            offsetStart,
            renderLen,
            totalLen
          }}
        >
          <table
            {...rest}
            ref={tableRef}
            style={{
              ...rest_style,
              width,
              position: 'relative'
            }}
          >
            {children}
          </table>
        </ScrollContext.Provider>
      </div>
    )
  }
  return VTableComponent
}
// ================导出===================
export function VList(props) {
  // scrollY = props.height
  //
  // reachEnd = props.onReachEnd

  return {
    table: VTable(props),
    body: {
      wrapper: VWrapper,
      row: VRow,
      cell: TableCell
    }
  }
}
