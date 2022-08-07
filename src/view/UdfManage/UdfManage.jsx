import UdfApi from '../../api/udf'
import React, {Component, useEffect, useState} from 'react'
import {StatusCreator} from '@fishballer/bui'
import {DATE_FORMAT, PERMS_IDENTS} from '../../constant'
import Filter from '../../components/Filter/Filter'
import TableContainer from '../../components/GetTableHeight'
import {isEmpty, timestampFormat} from '../../lib/utils'
import utilities from '../../style/utilities.scss'
import IconFont from '../../components/Iconfont'
import EllipsisText from '../../components/EllipsisText'
import moment from 'moment'
import classnames from 'classnames'
import {Button, Divider, Popconfirm, Table} from 'antd'
import UdfEditModal from './components'
import PageHeader from "../../components/PageHeader";

const TypeStatus = StatusCreator([
  {color: '#1890FF', text: '正常', value: true},
  {color: '#F5222D', text: '禁用', value: false}
])

const FILTER_STATUS = [
  {value: true, text: '正常', color: '#1890FF'},
  {value: false, text: '禁用', color: '#F5222D'}
]

const UdfList = (props) => {
  const defaultPagination = {
    pageSize: 20
  }
  const pageParam = {
    page: 1,
    limit: 20,
  }
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState([])
  const [filtersValue, setFiltersValue] = useState({})
  const [udfList, setUdfList] = useState([])
  let [refreshKey, setRefreshKey] = useState(0)
  const [pagination, setPagination] = useState({...defaultPagination})
  const [formVisible, setFormVisible] = useState(false)
  const [udfId, setUdfId] = useState()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 50,
    }, {
      title: '函数名',
      dataIndex: 'name',
      width: 150,
      render: (value) => <EllipsisText value={value} width={134}/>
    }, {
      title: '函数中文名',
      dataIndex: 'zh_name',
      width: 150,
      render: (value) => <EllipsisText value={value} width={134}/>
    }, {
      title: '创建人',
      dataIndex: 'user',
      width: 100,
      render: (value) => <EllipsisText value={value} width={84}/>
    },
    {
      title: '表达式',
      dataIndex: 'expression',
      render: (value) => <EllipsisText value={value}/>
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center',
      width: 180,
      render: (value) => value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : '--'
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center',
      width: 180,
      render: (value) => value ? moment(value).format(DATE_FORMAT.YYYYMMDDHHMMSS) : '--'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (data, record) => (<TypeStatus
        value={data}
        style={{cursor: 'pointer', color: '#6b6b6b'}}
        onClick={() => {
          const {id} = record
          UdfApi.updateStatusUdf(id)
            .then(() => {
              fetch()
            })
        }}
      />)
    },
    {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (data, record, index) => (
        <div className={utilities['opt-dispaly-center']}>
          <IconFont
            title={'编辑'}
            position={index}
            type={'icon-bianji'}
            className={utilities['opt-disabled']}
            style={{fontSize: 24}}
            onClick={() => {
              setFormVisible(true)
              setUdfId(record.id)
            }}
          />
          <Divider type="vertical"/>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => {
              UdfApi.deleteUdf(record.id)
                .then(() => {
                  fetch()
                })
            }}
            okText={'删除'}
            placement="topRight"
          >
            <IconFont
              title={'删除'}
              position={index}
              type={'icon-shanchu1'}
              style={{fontSize: 24}}
              className={utilities['opt-disabled']}
            />
          </Popconfirm>
        </div>
      )
    }
  ]
  const createFilter = () => {
    setFilters(
      [
        {
          type: 'input',
          name: 'name',
          config: {
            initialValue: ''
          },
          attr: {
            placeholder: '函数名',
            allowClear: true
          }
        },
        {
          type: 'input',
          name: 'zh_name',
          config: {
            initialValue: ''
          },
          attr: {
            placeholder: '函数中文名',
            allowClear: true
          }
        },
        {
          type: 'input',
          name: 'user',
          style: {
            width: 150
          },
          config: {
            initialValue: ''
          },
          attr: {
            placeholder: 'user',
            allowClear: true
          }
        },
        {
          type: 'select',
          name: 'status',
          attr: {
            placeholder: '状态',
            allowClear: true,
            style: {
              width: 100
            },
            option: FILTER_STATUS.map(item => {
              return ({
                value: item.value,
                key: item.value,
                text: item.text
              })
            })
          }
        }
      ]
    )
  }
  useEffect(() => {
    fetch({...pageParam})
    createFilter()
  }, [])
  const fetch = (params = {}) => {
    setLoading(true)
    setRefreshKey(refreshKey++)
    UdfApi.getUdfList(params).then(data => {
      const newPagination = {...defaultPagination}
      newPagination.total = data.total
      setUdfList(data.data.items)
      setLoading(false)
      setPagination({...newPagination})
    })
  }
  const handleSearch = value => {
    setFiltersValue({...value})
    setPagination({...defaultPagination})
    fetch({
      ...pageParam
      , ...value
    })
  }
  const handleTableChange = (pagination, sorter) => {
    const pager = {...pagination}
    pager.current = pagination.current
    setPagination(pager)
    fetch({
      page: pagination.current,
      limit: 20,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filtersValue,
    })
  }
  const buttons = (
    <Button
      type={'primary'}
      onClick={() => {
        setUdfId(undefined)
        setFormVisible(true)
      }}>
      <IconFont type={'icon-addcopy'}/> 新建函数 </Button>
  )
  // console.log('udfId' + udfId)
  return (

    <div style={{height: '100%'}}>
      <div className={classnames(utilities['table-wrapper'], utilities['page-content'])}>
        <div style={{display: 'flex', alignItems: 'center', marginBlockEnd: 15}}>
          <Filter
            fields={filters}
            onSubmit={handleSearch}
          />
          {buttons}
        </div>
        <TableContainer
          // form={formRef}
          onResize={() => {
            setRefreshKey(++refreshKey)
          }}
          refreshKey={refreshKey}
        >
          {
            height => <Table
              size="middle"
              bordered
              columns={columns}
              rowKey={record => record.id}
              dataSource={udfList}
              pagination={pagination}
              loading={loading}
              onChange={handleTableChange}
              scroll={{x: 1140, y: height}}
            />
          }
        </TableContainer>
        <UdfEditModal
          udfId={udfId}
          setUdfId={setUdfId}
          visible={formVisible}
          onCancel={() => {
            setFormVisible(false)
            fetch({...pageParam})
          }}
        />
      </div>
    </div>
  )
}

export default UdfList
