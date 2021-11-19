import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './style.g.scss'
import Table from '@cecdataFE/bui/dist/components/Ant4Table'
import { Button } from 'antd'
import { isMoment } from 'moment'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import classnames from 'classnames'
import { INIT_PAGE } from '../../constant'

const PAGE_SIZE = 20

function ProTable (props, ref) {
  const { querier, className, fetch, ...tableProps } = props
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
    const params = { ...queryData.current }
    if (isFresh) {
      params.page = 1
    }
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

  const handlePageChange = (page) => {
    queryData.current = {
      ...queryData.current,
      page
    }
    dataFetch()
    setPagination(prev => ({
      ...prev,
      current: page
    }))
  }

  const handleSearch = () => {
    dataFetch(true)
  }

  useEffect(() => {
    dataFetch()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      dataFetch()
    }
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
                      <Button type='primary' onClick={handleSearch}>查询</Button>
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
