import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './style.g.scss'
import Table from '@fishballer/bui/dist/components/Ant4Table'
import { Button } from 'antd'
import { isMoment } from 'moment'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import classnames from 'classnames'
import { INIT_PAGE } from '../../constant'

const PAGE_SIZE = 20

function ProTable (props, ref) {
  const { querier, className, fetch, autoFetch = true, ...tableProps } = props
  const [tableSource, setTableSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, current: 1 })
  const forms = (querier?.forms || []).map(item => {
    return React.cloneElement(item, {
      ...item.props,
      key: item.props.name,
      onChange (e) {
        const value = isMoment(e) ? e.valueOf() : (e?.target ? e.target.value : e)
        queryData.current = {
          ...queryData.current,
          [item.props.name]: value
        }
      }
    })
  })
  const defaultQueries = {}
  forms.forEach(form => {
    const { name, defaultValue } = form.props
    defaultQueries[name] = defaultValue
  })
  const queryData = useRef({ limit: PAGE_SIZE, page: 1, ...defaultQueries })

  const hasPagination = tableProps.pagination !== false
  const dataFetch = (isFresh = false) => {
    if (typeof fetch !== 'function') {
      return
    }
    if (isFresh) {
      queryData.current.page = 1
    }
    const params = { ...queryData.current }
    setLoading(true)
    fetch(params)
      .then(res => {
        if (hasPagination) {
          const { items, total } = res?.data ?? {}
          setTableSource(items)
          setPagination(prev => ({ ...prev, total, current: isFresh ? 1 : prev.current }))
        } else {
          setTableSource(res?.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handlePageChange = (page, pageSize) => {
    queryData.current = {
      ...queryData.current,
      page,
      limit: pageSize
    }
    dataFetch()
    setPagination(prev => ({
      ...prev,
      pageSize,
      current: page
    }))
  }

  const handleSearch = () => {
    dataFetch(true)
  }

  useEffect(() => {
    if (autoFetch) {
      dataFetch()
    }
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      dataFetch(true)
    },
    get tableSource () { return [...tableSource] },
    set tableSource (data) { setTableSource(data) }
  }))

  return (
    <div className={classnames('pro-table', className)}>
      {
        querier
          ? (
            <div className='querier'>
              <div className='forms'>
                {!isEmpty(forms)
                  ? (
                    <>
                      {forms}
                      <Button type='primary' onClick={handleSearch}>??????</Button>
                    </>
                    )
                  : null}
                {querier.buttons}
              </div>
            </div>
            )
          : null
      }
      <Table
        dataSource={tableSource}
        loading={loading}
        pagination={{
          ...INIT_PAGE,
          pageSize: PAGE_SIZE,
          onChange: handlePageChange,
          ...pagination
        }}
        {...tableProps}
      />
    </div>
  )
}

export default forwardRef(ProTable)
