import {Table, Divider, Card, Button, Popconfirm, Select} from 'antd'
import React, {useEffect, useState} from 'react'
import InterfacesApi from '../../../../api/interfaces'
import {StatusCreator} from '@fishballer/bui'
import utilities from '../../../../style/utilities.scss'
import IconFont from '../../../../components/Iconfont'
import moment from 'moment'
import Filter from '../../../../components/Filter/Filter'
import SwaggerForm from './components/SwaggerForm'
import TableContainer from '../../../../components/GetTableHeight'
import EllipsisText from '../../../../components/EllipsisText'

const TypeStatus = StatusCreator([
  {color: '#1890FF', text: '正常', value: true},
  {color: '#F5222D', text: '禁用', value: false}
])

const FILTER_STATUS = [
  {value: true, text: '正常', color: '#1890FF'},
  {value: false, text: '禁用', color: '#F5222D'}
]

class InterfaceList extends React.Component {
  constructor() {
    super()

    this.state = {
      refreshKey: 0,
      data: [],
      pagination: {
        pageSize: 20
      },
      loading: false,
      visible: true,
      SwaggerFormVisible: false,
      SwaggerFormData: {},
      filters: [],
      filtersValue: {}
    }
  }

  interfaceDetail = (id) => {

  }

  createFilter = () => {
    const methodList = [
      {value: 'GET', text: 'GET'},
      {value: 'POST', text: 'POST'},
      {value: 'PUT', text: 'PUT'},
      {value: 'DELETE', text: 'DELETE'},
      {value: 'PATCH', text: 'PATCH'},
      {value: 'OPTIONS', text: 'OPTIONS'}
    ]
    this.setState({
        filters: [
          {
            type: 'input',
            name: 'name',

            config: {
              initialValue: ''
            },
            attr: {
              placeholder: '接口名称',
              allowClear: true,
              style: {
                width: 170
              }
            }
          },
          {
            type: 'input',
            name: 'path',
            config: {
              initialValue: ''
            },
            attr: {
              placeholder: '接口路径',
              allowClear: true,
              style: {
                width: 170
              }
            }
          },
          {
            type: 'select',
            name: 'method',
            attr: {
              placeholder: '请求方式',
              allowClear: true,
              style: {
                width: 100
              },
              option: methodList.map(item => {
                return ({
                  value: item.value,
                  key: item.value,
                  text: item.text
                })
              })
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
      }
    )
    this.columns = [
      {
        title: '接口名称',
        dataIndex: 'name',
        sorter: true,
        render: (data, record) => (
          <React.Fragment>
            <a onClick={() => this.props.interfaceDetailInter(record.id)}>{data}</a> <span
            style={{color: 'rgba(0,0,0,0.25)'}}>(ID:{record.id})</span>
          </React.Fragment>
        ),
        width: 300,
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        width: 100
      },
      {
        title: '请求路径',
        dataIndex: 'path',
        width: 300,
        render: (value) => <EllipsisText value={value} width={284}/>
      },
      {
        title: '接口描述',
        dataIndex: 'describe',
        width: 250,
        render: (value) => <EllipsisText value={value} width={234}/>
      }, {
        title: '接口标签',
        dataIndex: 'tags',
        width: 250,
        render: (value) => <EllipsisText value={value} width={234}/>
      }, {
        title: '版本号',
        dataIndex: 'version',
        width: 100,
        render: (value) => <EllipsisText value={value} width={84}/>
      },
      {
        title: '添加时间',
        dataIndex: 'create_time',
        width: 200,
        render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
      },
      {
        title: '修改时间',
        dataIndex: 'update_time',
        width: 200,
        render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--'
      },
      {
        title: '接口状态',
        dataIndex: 'status',
        width: 150,
        // align: 'center',
        align: 'center',
        render: (data, record) => (<TypeStatus
          value={data}
          style={{cursor: 'pointer', color: '#6b6b6b'}}
          onClick={() => {
            const {id, status, project, ...restData} = record
            InterfacesApi.updateInterfaceStatus(id)
              .then(() => {
                this.fetch({
                  page: 1,
                  limit: 20
                })
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
              onClick={
                () => this.props.interfaceDetailInter(record.id)
              }
            />
            <Divider type="vertical"/>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                InterfacesApi.deleteInterface(record.id)
                  .then(() => {
                    this.fetch()
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
  }

  componentDidMount() {
    this.fetch({
      page: 1,
      limit: 20
    })
    this.createFilter()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.searchValue !== prevProps.searchValue) {
      const filters = this.state.filtersValue
      this.setState({
        pagination: {
          page: 1,
          limit: 20,
          current: 1
        }
      })
      this.fetch({
        page: 1,
        limit: 20,
        ...this.props.searchValue,
        ...filters
      })
    }
  }

  handleSearch = value => {
    this.setState({
      filtersValue: {...value},
      pagination: {
        page: 1,
        limit: 20,
        current: 1
      }
    })
    this.fetch({
      page: 1,
      limit: 20
      , ...value
      , ...this.props.searchValue,
    })
  }

  handleTableChange = (pagination, sorter) => {
    const pager = {...this.state.pagination}
    pager.current = pagination.current
    this.setState({
      pagination: pager,
    })
    const filters = this.state.filtersValue
    this.fetch({
      page: pagination.current,
      limit: 20,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
      ...this.props.searchValue
    })
  }

  fetch = (params = {}) => {
    // console.log('params:', params)
    let {refreshKey} = this.state
    this.setState({loading: true, refreshKey: refreshKey++})
    InterfacesApi.getInterfaceList(params).then(data => {
      const pagination = {...this.state.pagination}
      // Read total count from server
      pagination.total = data.total
      this.setState({
        loading: false,
        data: data.data.items,
        pagination,
      })
    })
  }

  render() {
    const buttons = (
      <div className={utilities['table-button-group']} style={{marginBottom: 0}}>
        <Button
          type={'primary'}
          onClick={() => {
            this.setState({
              SwaggerFormData: {},
              SwaggerFormVisible: true
            })
          }}>
          <IconFont type={'icon-addcopy'}/> 导入 </Button>
        <Button
          type={'primary'}
          onClick={this.props.addInterface}
        >
          <IconFont type={'icon-addcopy'}/> 新增接口 </Button>
      </div>
    )
    return (
      <div style={{background: '#ECECEC'}}>
        <Card title="接口列表" bordered={false} style={{width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBlockEnd: 15}}
               ref={ref => {
                 this.formRef = ref
               }}>
            <Filter
              fields={this.state.filters}
              onSubmit={this.handleSearch}
            />
            {buttons}
          </div>
          <TableContainer
            form={this.formRef}
            onResize={() => {
              let {refreshKey} = this.state
              this.setState({refreshKey: ++refreshKey})
            }}
            refreshKey={this.state.refreshKey}
          >
            {
              height => <Table
                size="middle"
                bordered
                columns={this.columns}
                rowKey={record => record.id}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                // pagination={false}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                scroll={{x: 2100, y: height}}
              />
            }
          </TableContainer>
          <SwaggerForm
            data={this.state.SwaggerFormData}
            visible={this.state.SwaggerFormVisible}
            onOk={() => {
              this.setState({SwaggerFormVisible: false})
              this.fetch({
                page: 1,
                limit: 20
              })
            }}
            onCancel={() => {
              this.setState({SwaggerFormVisible: false})
            }}
          />
        </Card>
      </div>
    )
  }

}

export default InterfaceList